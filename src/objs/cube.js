import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Engine from '../core/Engine';
import ObjectFactory from '../core/ObjectFactory';

const radius = 0.85;
const hat_size = 0.2;
function new_hat(){
	const group = new THREE.Group();

	const brimRadius = radius * (1.4 + hat_size); // a little wider
	const brimHeight = radius * 0.05;
	const topRadius = radius * (1 + hat_size);

	// Brim of the hat (thin cylinder)
	const brim = new THREE.Mesh(
		new THREE.CylinderGeometry(brimRadius, brimRadius, brimHeight, 32),
		new THREE.MeshStandardMaterial({ color: 0x222222 })
	);
	brim.position.y = radius + brimHeight / 2;

	// Dome part of the hat (half-sphere)
	const dome = new THREE.Mesh(
		new THREE.SphereGeometry(
			topRadius,
			32,
			32,
			0, Math.PI * 2,
			0, Math.PI / 2 // upper half
		),
		new THREE.MeshStandardMaterial({ color: 0xffff00 }) // yellow
	);
	dome.position.y = radius + brimHeight;

	group.add(brim, dome);
	return group;
}

let loadedHat = null;
const loader = new GLTFLoader();

function loadHat() {
	return new Promise((resolve, reject) => {
	  loader.load('hat2.glb', gltf => resolve(gltf.scene), undefined, reject);
	});
  }


function new_hat_model(){
	const hatClone = loadedHat; // deep clone with children & materials
hatClone.position.y = radius;
return hatClone;
}

const geometry = new THREE.SphereGeometry(radius, 16, 16);

class Miner extends ObjectFactory{
	constructor(color = 0x0000ff){
		const material = new THREE.MeshStandardMaterial({ color: color })
		const ball = new THREE.Mesh(geometry, material);
		const miner = new THREE.Group();
		//miner.add(ball, new_hat());
		miner.add(ball);

		super({model: miner})
		loadHat().then((hatModel) => {
			let scale = 0.046;
			hatModel.scale.set(scale, scale, scale + 0.01)
			// hatModel.rotation.z = Math.PI /2;
			hatModel.position.set(0.1, -6.7, -0.04);
			console.log('Hat position:', hatModel.position);

			new Engine().scene.add(hatModel);
			this.obj.add(hatModel)
			this.obj.rotation.y -= Math.PI / 2;
			// this.obj.scale.set(0.1, 0.1, 0.1)
			// Now safe to add copies
		  });
		//super({ geo: geometry, mat: material });	
	}

	static(){

	}
	jump(){

	}
}

let miner = new Miner();

miner.show();
console.log("About to call rotate");

// miner.rotate([1, 0, 0], -0.1);
// miner.move([0, 0, -0.1])
miner.bounceSinusoidal([0, 0.05, 0], 3)

console.log('miner.rotate is function:', typeof miner.rotate === 'function');

// miner.addAnimation(miner.rotate([1,0,0]));


const cube = 1;
export {cube}