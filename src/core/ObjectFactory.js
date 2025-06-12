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
		this.defaultAnimation = animation;
		this.animations = new Set();
		if (animation)
			this.addAnimation(animation);
		engine.addObject(this);
		this.hide();
	}
	addAnimation(anim){
		console.log("adding .. ", anim)
		this.animations.add(anim);
		if (this.animations.size == 1)
			engine.addAnimatedObject(this);
	}
	removeAnimation(anim){
		this.animations.delete(anim);
		if (this.animations.size == 0)
			engine.removeAnimatedObject(this);
	}
	clearAnimations(anim){
		this.animations.clear();
		if (this.defaultAnimation)
			this.addAnimation(this.defaultAnimation);
		else
			engine.removeAnimatedObject(this)
	}
	show(){
		console.log("show")
		this.obj.visible = true;
	}
	hide(){
		this.obj.visible = false;
	}
	rotate([x, y, z] , speed = 0.01){
		this.addAnimation(() => {
			console.log("x ", y)
			if (x) this.obj.rotation.x += speed;
			if (y) this.obj.rotation.y += speed;
			if (z) this.obj.rotation.z += speed;
		  });
	}
	move([x, y, z] , speed = 0.01){
		this.addAnimation(() => {
			console.log("x ", y)
			if (x != 0) this.obj.position.x += x;
			if (y != 0) this.obj.position.y += y;
			if (z != 0) this.obj.position.z += z;
		  });
	}
	bounceSinusoidal(amplitude = [1, 1, 1], frequency = 1) {
		const startTime = performance.now();
	
		this.addAnimation(() => {
			const elapsed = (performance.now() - startTime) / 1000; // in seconds
			const pos = this.obj.position;
	
			pos.x = amplitude[0] * Math.sin(elapsed * frequency);
			pos.y = amplitude[1] * Math.sin(elapsed * frequency * 1.2); // slightly different freq for more organic movement
			pos.z = amplitude[2] * Math.sin(elapsed * frequency * 0.8);
		});
	}
	
	
}