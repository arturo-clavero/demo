import * as THREE from 'three';
import ObjectFactory from '../core/ObjectFactory';

console.log("cube created")

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
function rotateCube(obj){
	obj.rotation.x += 0.01;
	obj.rotation.y += 0.01;
}

// const  cube1 = new ObjectFactory({geo: geometry, mat: material, animation: rotateCube})
const totalHairs = 10000;
// const totalHairs = 100;
const hairLenDif = 0.3;
let hairLen = 1;
hairLen -= (hairLenDif / 2);
const ballCov = 0.5;
class CustomSinCurve extends THREE.Curve {
	constructor(scale = 1, time = 0) {
		super();
		this.scale = scale;
		this.time = time;
	}
	setTime(t) {
		this.time = t;
	}
	getPoint(t, optionalTarget = new THREE.Vector3()) {
		const randomOffset = Math.random() * hairLenDif;
		const length = hairLen + randomOffset;
		const tx = t * length;
		const wave = Math.sin(Math.PI * t + this.time) * 0.1;
		const ty = wave;
		const tz = 0;
		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
	}
}


const path = new CustomSinCurve( 5 );
let geometry = new THREE.TubeGeometry( path, 100, 0.05, 3, false );
const material = new THREE.MeshStandardMaterial( { color: 0x222222 } );
function makeOrientedTube(direction) {
	const hair = new THREE.Mesh(geometry, material);
	hair.scale.set(0.1, 0.1, 0.1);
	const dir = direction.clone().normalize();
	const quat = new THREE.Quaternion();
	quat.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
	hair.quaternion.copy(quat);

	return hair;
}
const hairs = [];
const group = new THREE.Group();
for (let i = 0; i < totalHairs; i++) {
	const theta = Math.random() * Math.PI * 2;
	const phi = Math.acos(2 * Math.random() - 1);
	const x = Math.sin(phi) * Math.cos(theta);
	const y = Math.sin(phi) * Math.sin(theta);
	const z = Math.cos(phi);

	const direction = new THREE.Vector3(x, y, z);

// 	const tubeRadius = 0.01 + Math.random() * 0.01; // random thinness
//  geometry = new THREE.TubeGeometry(path, 20, tubeRadius, 4, false);

 const curve = new CustomSinCurve(5, 0);
 	const tubeRadius = 0.01 + Math.random() * 0.01; // random thinness

const geometry = new THREE.TubeGeometry(curve, 20, tubeRadius, 4, false);
const hair = new THREE.Mesh(geometry, material);
hair.scale.set(0.1, 0.1, 0.1);

const dir = direction.clone().normalize();
const quat = new THREE.Quaternion();
quat.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
hair.quaternion.copy(quat);

group.add(hair);
hairs.push({ curve, mesh: hair }); // store for animation

	// const hair = makeOrientedTube(direction);
	group.add(hair);
	hairs.push({ curve, mesh: hair }); // store for animation
}
function rotateBall(obj){
	let t = performance.now() * 0.001; // time in seconds
for (const { curve, mesh } of hairs) {
	curve.setTime(t);
	mesh.geometry.dispose(); // dispose old geometry
	mesh.geometry = new THREE.TubeGeometry(curve, 20, 0.01 + Math.random() * 0.01, 4, false);
}
	// rotateCube(obj)
}
const spgeo = new THREE.SphereGeometry(hairLen * ballCov, 16, 16);
const sp = new THREE.Mesh(spgeo, material);
group.add(sp)
const  hair1 = new ObjectFactory({model: group, animation: rotateBall})

const cube = 0
export {cube}