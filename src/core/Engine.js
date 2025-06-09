import * as THREE from 'three';

export default class Engine{
	constructor(){
		if (Engine.instance)
			return Engine.instance;
		console.log("Engine created")
		this.setUpBase();
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
	setUpAnimation(){
		this.animate = this.animate.bind(this);
		this.animatedObjects = [];
	}
	addObject(object){
		this.scene.add(object.obj);
		if (object.animate)
		{
			this.animatedObjects.push(object)
		}
	}
	resize(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	animate(){
		requestAnimationFrame(this.animate);
		this.animatedObjects.forEach(obj => {
			console.log("called animate cube");
			obj.animate(obj.obj);	
		});
		this.renderer.render(this.scene, this.camera);
	}
}