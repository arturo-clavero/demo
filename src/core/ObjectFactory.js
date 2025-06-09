import * as THREE from 'three';
import Engine from './Engine';

const engine = new Engine();

export default class ObjectFactory {
	constructor(
		{
			model = null, 
			geo = null, 
			mat = null, 
			animation = null, 
		}
	){
		if (model)
			this.obj = model;
		else 
			this.obj = new THREE.Mesh(geo, mat);
		this.animate = animation;
		engine.addObject(this);
	}
}