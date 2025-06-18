import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const loader = new GLTFLoader();

export function loadModel(url, scale = 0.5, position = new THREE.Vector3(0, 0, 0)) {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(gltf) => {
				const model = gltf.scene;
				model.scale.set(scale, scale, scale);
				model.position.copy(position);
				resolve(model);
			},
			undefined,
			reject
		);
	});
}

export function loadTextureAsync(url) {
	
	return new Promise((resolve, reject) => {
	  const loader = new THREE.TextureLoader();
	  loader.load(
		url,
		texture => resolve(texture),
		undefined,
		err => reject(err)
	  );
	});
  }

