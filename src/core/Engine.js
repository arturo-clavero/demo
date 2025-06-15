import * as THREE from 'three';
import Token from '../objs/token';
// const newMiner = new Token();//TEST DELETE
// newMiner.mesh.position.set(0, 0, -5)
export default class Engine{
	constructor(){
		if (Engine.instance)
			return Engine.instance;
		console.log("Engine created")
		this.setUpBase();
		this.setUpLights();
		this.setUpAnimation();
		// this.resize = this.resize.bind(this);
		this.cam_pos_resize = 0;
		Engine.instance = this;
		// this.scene.add(newMiner.mesh); //TEST DELETE
		this.resize();
	}
	setUpBase(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
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
		const canvas = this.renderer.domElement;
		this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}