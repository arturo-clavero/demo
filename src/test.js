import * as THREE from 'three';

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const purpleLight = new THREE.PointLight(0x9955ff, 1, 20);
purpleLight.position.set(0, 3, 5);
scene.add(purpleLight);

const orangeLight = new THREE.PointLight(0xff9955, 0.5, 20);
orangeLight.position.set(-3, 2, 7);
scene.add(orangeLight);

// Tunnel geometry helper: create jagged circular tunnel with noise
function createJaggedTunnel(radius=3, length=15, segments=50) {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments, 1, true);
  
  // Displace vertices for jagged effect
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // add noise on x,z plane for jagged edges on circumference
    const noise = (Math.random() - 0.5) * 0.3; 
    pos.setX(i, x + noise * (x > 0 ? 1 : -1));
    pos.setZ(i, z + noise * (z > 0 ? 1 : -1));
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

// Create tunnel mesh
const tunnelMat = new THREE.MeshStandardMaterial({
  color: 0x664466,
  roughness: 1,
  metalness: 0,
  side: THREE.BackSide, // inside view
});

const tunnel = new THREE.Mesh(createJaggedTunnel(), tunnelMat);
scene.add(tunnel);

// Create layered wall frames (simple example with planes)
function createLayeredWall(xPos) {
  const group = new THREE.Group();
  for(let i = 0; i < 5; i++) {
    const planeGeo = new THREE.PlaneGeometry(1 + Math.random()*0.5, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.75, 0.5, 0.4 + i * 0.05),
      roughness: 1,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(planeGeo, mat);
    mesh.position.set(xPos, (i - 2) * 1.1, -i * 0.5);
    mesh.rotation.y = (Math.random() - 0.5) * 0.3;
    group.add(mesh);
  }
  return group;
}
scene.add(createLayeredWall(-3.5)); // Left wall frame
scene.add(createLayeredWall(3.5));  // Right wall frame

// Stalactites/Stalagmites helper
function createSpikes(count, yStart, yEnd, floor = true) {
  const spikes = new THREE.Group();
  for(let i = 0; i < count; i++) {
    const spikeHeight = 0.5 + Math.random();
    const spikeGeo = new THREE.ConeGeometry(0.1 + Math.random() * 0.1, spikeHeight, 4);
    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0x997799,
      roughness: 1,
      metalness: 0,
    });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(
      (Math.random() - 0.5) * 5,
      floor ? yStart + spikeHeight/2 : yStart - spikeHeight/2,
      -Math.random() * 10
    );
    if (!floor) spike.rotation.x = Math.PI; // flip for ceiling
    spikes.add(spike);
  }
  return spikes;
}
scene.add(createSpikes(15, -3, -3.5, true));  // Floor spikes
scene.add(createSpikes(15, 3, 3.5, false));   // Ceiling spikes

// Glowing crystal at far end
const crystalGeo = new THREE.OctahedronGeometry(0.8);
const crystalMat = new THREE.MeshStandardMaterial({
  color: 0x55aaff,
  emissive: 0x55aaff,
  emissiveIntensity: 2,
  roughness: 0.3,
  metalness: 0.1,
});
const crystal = new THREE.Mesh(crystalGeo, crystalMat);
crystal.position.set(0, 0, -12);
scene.add(crystal);

// Animate
function animate() {
  requestAnimationFrame(animate);
  crystal.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
