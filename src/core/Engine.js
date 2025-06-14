import * as THREE from 'three';
import StateManager from './StateManager';

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
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // white, brighter
// directionalLight.position.set(5, 10, 15); // top-right-front
// directionalLight.castShadow = true;
// // Make shadows soft
// this.scene.add(directionalLight);
// Optional helper to visualize the light direction
// const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
// scene.add(helper);


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
		this.renderer.render(this.scene, this.camera);
	}
}