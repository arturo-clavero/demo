import * as THREE from 'three';

export const themes =[
	{ ball: 0xff66ff, ring: 0xcc33cc }, // Purple
	{ ball: 0x66ccff, ring: 0x3399cc }, // Blue
	{ ball: 0xff6699, ring: 0xcc3366 }, // Pink
	 {
		ball: 0x66ffcc,       // brighter green
		ring: 0x88ffe0        // slightly lighter greenish-cyan
	}];
	
	export function createMaterial(color) {
		return new THREE.MeshStandardMaterial({
			color,
			side: THREE.DoubleSide,         // show color on both sides
			transparent: false,             // fully solid
			depthWrite: true,
			emissive: new THREE.Color(color),
			emissiveIntensity: 0.3,         // slight self-lit effect
		});
	}
	
	
	export function createPartialRing(radius, tube, arcAngle, segments, color) {
		const geometry = new THREE.TorusGeometry(radius, tube, 16, segments, arcAngle);
		const mesh = new THREE.Mesh(geometry, createMaterial(color));
		mesh.castShadow = false;
		mesh.receiveShadow = false;
		return mesh;
	}
	