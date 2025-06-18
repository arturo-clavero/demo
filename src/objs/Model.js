import * as THREE from 'three';
import { loadModel } from '../core/load';
import ObjectMovement from '../core/ObjectMovement';

const urls = {
	"user" : "models/user2.glb",
}

export default class Model extends ObjectMovement{
	constructor({x = 0, y = 0, z= 0, scale = 0.5, group = null, type}){
		super(null, true)
		this.url = urls[type]
		this.pos = new THREE.Vector3(x, y, z)
		this.scale = scale;
		this.group = group;
		this.animate = ()=>{}
	}
	async load(){
		this.mesh = await loadModel(this.url, this.scale, this.pos)
		if (this.group)
			this.group.add(this.mesh)
	}

	
}