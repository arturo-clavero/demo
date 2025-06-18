import * as THREE from 'three';

export function material(theme) {
	switch(theme) {
	  case 0: // pinkish red
		return new THREE.MeshStandardMaterial({ color: 0xff3388 });
	  case 1: // electric blue
		return new THREE.MeshStandardMaterial({ color: 0x00b3ff });
	  case 2: // transparent white
		return new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
	  case 3: // yellow-gold (improved)
		return new THREE.MeshStandardMaterial({
			color: 0xffe066, // soft golden yellow
			emissive: 0xffd700, // classic gold emissive glow
			emissiveIntensity: 0.3,
			metalness: 0.5,
			roughness: 0.3
		});
	  case 4: // green theme
		return new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x005533, emissiveIntensity: 0.5 });
	  default:
		return new THREE.MeshStandardMaterial({ color: 0xff44cc });
	}
}

export function neonColor(theme) {
	switch(theme) {
	  case 0: return 0xff44cc; // neon pink/red
	  case 1: return 0x3f9fff; // neon blue
	  case 2: return 0xffffff; // white edges for transparent
	  case 3: return 0xffea00; // brighter yellow for gold edges
	  case 4: return 0x33ff99; // neon green
	  default: return 0xff44ff;
	}
}

export function attach_number(number_text, rad){
	// Create a canvas for the number texture
const size = 128;
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#00000000'; // transparent background
ctx.clearRect(0, 0, size, size);
ctx.font = 'bold 64px Arial';
ctx.fillStyle = '#ffffff'; // white text
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(number_text, size / 2, size / 2); // You can change '1' to any number

// Create texture and material
const texture = new THREE.CanvasTexture(canvas);
const matText = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
const geo = new THREE.PlaneGeometry(rad * 1.2, rad * 1.2); // slightly larger than token

// Create mesh and position it on the bottom face
const textMesh = new THREE.Mesh(geo, matText);
// textMesh.rotation.x = -Math.PI / 2; // Face downward
// textMesh.position.y = -0.11 * rad - 0.01; // Slight offset to avoid z-fighting
textMesh.rotation.x = Math.PI / 2; // face upward toward bottom of cylinder
textMesh.rotation.z = Math.PI * 1.1; // face upward toward bottom of cylinder
textMesh.position.y = -rad * 0.1 - 0.01;
return textMesh

}

