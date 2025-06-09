import * as THREE from 'three';
import ObjectFactory from '../core/ObjectFactory';

console.log("cube created")

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
function rotateCube(obj){
	obj.rotation.x += 0.01;
	obj.rotation.y += 0.01;
}

const  cube = new ObjectFactory({geo: geometry, mat: material, animation: rotateCube})

export {cube}