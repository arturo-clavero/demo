import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Engine from '../core/Engine';
import ObjectFactory from '../core/ObjectFactory';

const radius = 0.85;
const hat_size = 0.2;


let loadedHat = null;
const loader = new GLTFLoader();

function loadHat() {
	return new Promise((resolve, reject) => {
	  loader.load('hat2.glb', gltf => resolve(gltf.scene), undefined, reject);
	});
  }

  function loadBody() {
	return new Promise((resolve, reject) => {
	  loader.load('ball.glb', gltf => resolve(gltf.scene), undefined, reject);
	});
  }

  function addEyesTo(mesh, spacing = 0.2, size = 0.05) {
	const eyeGeo = new THREE.SphereGeometry(size, 8, 8);
	const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  
	const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
	const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
  
	eye1.position.set(-spacing, 0, -2); // in front of the sphere
	eye2.position.set(spacing, 0, 2);
  
	mesh.add(eye1, eye2);
  }
const geometry = new THREE.SphereGeometry(radius, 64, 64);

class Miner extends ObjectFactory{
	constructor(color = 0x0000ff){
		// const material = new THREE.MeshStandardMaterial({
		// 	color: 0x8b5a2b,     // Earthy brown (like dug-up soil)
		// 	roughness: 0.9,      // Very matte
		// 	metalness: 0.2,      // Slight natural reflectivity
		//   });	
		const textureLoader = new THREE.TextureLoader();
const grungeMap = textureLoader.load('dirt2.jpg'); // use a grungy texture

const material = new THREE.MeshStandardMaterial({
  color: 0xf9b4f1,
  roughnessMap: grungeMap,
  roughness: 0.9,
  metalness: 0.9,
});
		//   const material = new THREE.MeshStandardMaterial({
		// 	color: 0xf9b4f1,     // Dark steel
		// 	roughness: 0.5,
		// 	metalness: 0.8,
		//   });
		  const ball = new THREE.Mesh(geometry, material);
		const miner = new THREE.Group();
		const eye = new THREE.Mesh(
			new THREE.SphereGeometry(0.15, 8, 8),
			new THREE.MeshStandardMaterial({color: 0x000000})
	)
eye.position.z += 0.3;
eye.position.x += radius ;
const eye2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.15, 8, 8),
	new THREE.MeshStandardMaterial({color: 0x000000})
)
eye2.position.z -= 0.3;
eye2.position.y -= 0.1;
eye2.position.x += (radius);
		miner.add(ball, eye, eye2);
		
		super({model: miner})
		loadHat().then((hatModel) => {
			let scale = 0.046;
			hatModel.scale.set(scale, scale, scale + 0.01)
			// hatModel.rotation.z = Math.PI /2;
			hatModel.position.set(0.1, -6.7, -0.04);
			console.log('Hat position:', hatModel.position);

			new Engine().scene.add(hatModel);
			this.obj.add(hatModel)
			this.obj.rotation.x -= Math.PI / 8;

			this.obj.rotation.y -= Math.PI / 3;
			// this.obj.add(new THREE.Mesh(
			// 	new THREE.geometry
			// ))
			// this.obj.scale.set(0.1, 0.1, 0.1)
			// Now safe to add copies
		  });
		//   loadBody().then((hatModel) => {
		// 	let scale = 0.2;
		// 	hatModel.scale.set(scale, scale, scale + 0.01)
		// 	// hatModel.rotation.z = Math.PI /2;
		// 	// hatModel.position.set(0.1, -6.7, -0.04);
		// 	console.log('Hat position:', hatModel.position);

		// 	new Engine().scene.add(hatModel);
		// 	this.obj.add(hatModel)
		// 	this.obj.rotation.y = Math.PI / 2;
		// 	// this.obj.scale.set(0.1, 0.1, 0.1)
		// 	// Now safe to add copies
		//   });
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