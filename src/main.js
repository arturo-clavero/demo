import * as THREE from 'three';
// import Engine from './core/Engine.js';
// import {cube} from './objs/miner.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {createNoise3D} from 'simplex-noise';


// noiseStrength	How deep/high the ridges	1.5 to 3.0* 0.08 in Z	
// How stretched the ridges are	0.05 to 0.15* 2.5	
// Micro-bump frequency	1.0 to 5.0* 0.15	Micro-bump strength	0.05 to 0.3
const noise3D = createNoise3D();

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tunnel Parameters
const radius = 5;
const radialSegments = 60;
const lengthSegments = 200;
const length = 100;
const noiseScale = 3.5;
const noiseStrength = 3.2;
let time = 0;

// Geometry
const geometry = new THREE.BufferGeometry();
const positions = [];
const indices = [];

// Generate vertices
const baseData = []; // Store base angle and z for each vertex

for (let z = 0; z <= lengthSegments; z++) {
  const zPos = (z / lengthSegments) * length;
  for (let i = 0; i <= radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const r = radius;
    positions.push(x * r, y * r, zPos);
    baseData.push({ angle, z: zPos }); // Save for deformation
  }
}


// Generate indices
for (let z = 0; z < lengthSegments; z++) {
  for (let i = 0; i < radialSegments; i++) {
    const a = z * (radialSegments + 1) + i;
    const b = a + radialSegments + 1;
    indices.push(a, b, a + 1);
    indices.push(b, b + 1, a + 1);
  }
}
// Simple test cube at origin
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
const cubee = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubee.position.set(0, 0, 5); // Place it in front of the camera path
scene.add(cubee);

geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({ color: 0x5588ff, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.z = -5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
	const ix = i * 3;
	const { angle, z } = baseData[i];
  
	// Major ridge stretched along Z, with some angular variance
	const ridgeNoise = Math.abs(noise3D(
	  Math.cos(angle) * 0.3,  // Slight curve around ring
	  Math.sin(angle) * 0.3,  // "
	  (z + time * 10) * 0.08  // Stretch Z
	));
  
	// Optional: Add small high-frequency bumps
	const detailNoise = noise3D(
	  Math.cos(angle) * 2.5,
	  Math.sin(angle) * 2.5,
	  (z + time * 10) * 0.4
	) * 0.15;
  
	const delta = ridgeNoise + detailNoise;
  
	const r = radius + delta * noiseStrength;
  
	pos.array[ix] = Math.cos(angle) * r;
	pos.array[ix + 1] = Math.sin(angle) * r;
	pos.array[ix + 2] = z;
  }
  
  
  pos.needsUpdate = true;
  time += 0.01;

  camera.position.z += 0.05; // Move forward
  mesh.position.z = -camera.position.z;

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
