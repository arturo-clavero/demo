import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

const combos = [
  {
    name: "Mystic Cyan-Purple",
    background: 0x111122,
    fog: 0x111122,
    terrainColor: 0x88ccff,
    terrainEmissive: 0x66aaff,
    sphereHueBase: 0.55, // cyan-purple range
  },
  {
    name: "Electric Indigo",
    background: 0x0a0a1f,
    fog: 0x0a0a1f,
    terrainColor: 0x4b3b8a,    // deep indigo purple
    terrainEmissive: 0x8a7bff, // soft purple glow
    sphereColors: [0x9988ff, 0xbbccff, 0x7766ff], // lilac, pale blue, vivid blue
  },
  {
    name: "Mystic Lavender",
    background: 0x1f1330,
    fog: 0x1f1330,
    terrainColor: 0x6f4c8b,    // muted lavender purple
    terrainEmissive: 0xbba6ff, // pale glowing lavender
    sphereColors: [0xd3c0ff, 0xa88cff, 0x9980ff], // light purple shades
  },
  {
    name: "Frozen Dream",
    background: 0x0d1f2f,
    fog: 0x0d1f2f,
    terrainColor: 0x417aad,    // steel blue
    terrainEmissive: 0x88bfff, // icy blue glow
    sphereColors: [0xaaddff, 0x77bbff, 0x99ccff], // icy blues and cyan
  },
  {
    name: "Pink Nebula",
    background: 0x210028,
    fog: 0x210028,
    terrainColor: 0x9a5c8f,    // dusty pink-purple
    terrainEmissive: 0xd480ff, // bright pink glow
    sphereColors: [0xff99ff, 0xff77ff, 0xe666ff], // neon pinks & purples
  },
  {
    name: "Blue Aura",
    background: 0x121b31,
    fog: 0x121b31,
    terrainColor: 0x486fbd,    // vibrant blue
    terrainEmissive: 0x88aaff, // soft blue glow
    sphereColors: [0x77aaff, 0x5599ff, 0x33aaff], // cool blue gradients
  },
];


export function fractalNoise(x, y, z) {
	let total = 0;
	let frequency = 1;
	let amplitude = 1;
	let max = 0;
  
	for (let i = 0; i < 3; i++) {
	  total += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
	  max += amplitude;
	  frequency *= 2;
	  amplitude *= 0.3;
	}
  
	return total / max;
  }
  
  const createMagicGlowMaterial = (baseHue) => {
	const hue = baseHue + (Math.random() - 0.5) * 0.2;
	const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
	return new THREE.MeshBasicMaterial({
	  color: color.getHex(),
	  transparent: true,
	  opacity: 0.5,
	  blending: THREE.AdditiveBlending,
	  depthWrite: false,
	  toneMapped: false,
	});
  };
export function create_terrain(currentCombo, scene, geometry){
	const combo = combos[currentCombo];
	scene.fog = new THREE.FogExp2(combo.fog, 0.02);
	scene.add(new THREE.AmbientLight(0xffffff, 0.3));
	const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(0, 50, 30);
	scene.add(dirLight);

	// Geometry
	
	const material = new THREE.MeshToonMaterial({
	color: combo.terrainColor,
	flatShading: true,
	emissive: combo.terrainEmissive,
	emissiveIntensity: 0.4,
	transparent: true,
	opacity: 0.7,
	});

	const terrain = new THREE.Mesh(geometry, material);
	scene.add(terrain);
}

export function create_spheres(glowSpheres, width, depth, combo){
// Glow spheres with random hue shifts around combo.sphereHueBase
const sphereCount = 30;
const sphereGeometry = new THREE.SphereGeometry(0.35, 16, 16);


for (let i = 0; i < sphereCount; i++) {
	const mat = createMagicGlowMaterial(combo.sphereHueBase);
	const sphere = new THREE.Mesh(sphereGeometry, mat);
	sphere.position.set(
	  (Math.random() - 0.5) * width,
	  -1.7 - Math.random() * 0.6,
	  (Math.random() - 0.5) * depth
	);
  //   scene.add(sphere);
	glowSpheres.push(sphere);
  }
  
}




