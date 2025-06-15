import * as THREE from 'three';
import StateManager from './StateManager';
import Token from '../objs/token';
const newMiner = new Token();//TEST DELETE
newMiner.mesh.position.set(0, 0, -5)
const stateManager = new StateManager();
export default class Engine{
	constructor(){
		if (Engine.instance)
			return Engine.instance;
		console.log("Engine created")
		this.setUpBase();
		this.setUpLights();
		this.setUpAnimation();
		window.addEventListener('resize', this.resize);
		Engine.instance = this;
		this.scene.add(newMiner.mesh); //TEST DELETE
	}
	setUpBase(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 5;
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);		
	}
	setUpLights(){
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // white, soft intensity
		this.scene.add(ambientLight);
	}
	setUpAnimation(){
		this.animate = this.animate.bind(this);
		this.animatedObjects = new Set();
	}
	addObject(object){
		this.scene.add(object.obj);
	}
	addAnimatedObject(obj){
		this.animatedObjects.add(obj);
	}
	removeAnimatedObject(obj){
		this.animatedObjects.delete(obj);
	}
	resize(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	animate(time){
		requestAnimationFrame(this.animate);
		// this.animatedObjects.forEach(obj => {
		// 	// console.log("obj should be .. ", obj);
		// 	obj.animations.forEach(anim =>{
		// 		// console.log("ft should eb : ", anim);
		// 		anim(obj.obj)
		// 	}
		// 	)
		// });
		stateManager.animate(time)
		newMiner.animate(time);//TEST DELETE
		this.renderer.render(this.scene, this.camera);
	}
}