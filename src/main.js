import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111122);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 20, 10);
scene.add(light);

// Geometry
const width = 30;
const depth = 100;
const segments = 100;
const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
geometry.rotateX(-Math.PI / 2);

// Material
const material = new THREE.MeshStandardMaterial({
  color: 0x4477aa,
  flatShading: true,
});
const terrain = new THREE.Mesh(geometry, material);
scene.add(terrain);

const position = geometry.attributes.position;
let scroll = 0;

function updateTerrain() {
  scroll -= 0.1; // Scroll speed

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);

    const y = noise3D(x * 0.1, 0, (z + scroll) * 0.1) * 2.5;
    position.setY(i, y);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function animate() {
  requestAnimationFrame(animate);
  updateTerrain();
  renderer.render(scene, camera);
}

animate();
