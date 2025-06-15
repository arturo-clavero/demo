import * as THREE from 'three';
import gsap from 'gsap';

function material(theme) {
	switch(theme) {
	  case 0: // pinkish red
		return new THREE.MeshStandardMaterial({ color: 0xff3388 });
	  case 1: // electric blue
		return new THREE.MeshStandardMaterial({ color: 0x00b3ff });
	  case 2: // transparent white
		return new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
	  case 3: // gold
		return new THREE.MeshStandardMaterial({ color: 0xffd700 });
	  default:
		return new THREE.MeshStandardMaterial({ color: 0xff44cc });
	}
  }
  
  function neonColor(theme) {
	switch(theme) {
	  case 0: return 0xff44cc; // neon pink/red
	  case 1: return 0x3f9fff; // neon blue
	  case 2: return 0xffffff; // white edges for transparent
	  case 3: return 0xffcc00; // neon gold
	  default: return 0xff44ff;
	}
  }

  

export default class Token {
	constructor(theme = 3) {
		this.mesh = new THREE.Group();
	  
		const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
		const mat = material(theme);
		const tokenMesh = new THREE.Mesh(geometry, mat);
	  
		const edges = new THREE.EdgesGeometry(geometry);
		const edgeMaterial = new THREE.LineBasicMaterial({
		  color: neonColor(theme),
		  linewidth: 2,
		});
		const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
	  
		this.mesh.add(tokenMesh);
		this.mesh.add(edgeLines);
	  
		const radius = 0.8;
		const segments = 64;
		const circleGeometry = new THREE.CircleGeometry(radius, segments);
		const edgesGeometry = new THREE.EdgesGeometry(circleGeometry);
		const outlineMaterial = new THREE.LineBasicMaterial({
		  color: neonColor(theme), 
		  linewidth: 2,
		  transparent: true,
		  opacity: 0.7,
		});
	  const outlines = new THREE.Group();
		const frontOutline = new THREE.LineSegments(edgesGeometry, outlineMaterial);
		frontOutline.position.z = 0.11;
		outlines.add(frontOutline);
		const backOutline = new THREE.LineSegments(edgesGeometry, outlineMaterial);
		backOutline.position.z = -0.11;
		outlines.add(backOutline);
		outlines.rotation.x = Math.PI * 0.5;
		this.mesh.add(outlines)
	  
		this.animate = () => {};
		this.toFlat();
		this.toUp();
		this.toRight();
	  
		this.amplitude = [0, 0.2, 0];
		this.frequency = 4;
		this.speed = 0.1;
		this.startTime = 0;
	  
		this.jump();
	  }
	  
	  
  toFlat(){
	this.mesh.rotation.x = Math.PI * 0.5;
	this.mesh.rotation.z = 0;
  }
  toUp(){
	this.mesh.rotation.x = Math.PI * 0.4;
  }
  toDown(){
	this.mesh.rotation.x = Math.PI * 0.6;
  }
  toRight(){
	this.mesh.rotation.z = Math.PI * 0.85;
  }
  toLeft(){
	this.mesh.rotation.z = Math.PI * 0.15;
  }
	iddle() {
		const elapsed = (performance.now() - this.startTime) / 1000; // in seconds
		const pos = this.mesh.position;
		pos.x = this.amplitude[0] * Math.sin(elapsed * this.frequency);
		pos.y = this.amplitude[1] * Math.sin(elapsed * this.frequency * 1.2);
		pos.z = this.amplitude[2] * Math.sin(elapsed * this.frequency * 0.8);
	}
	iddle(y = 0.2, freq = 4) {
		this.amplitude = [0, y, 0];
		this.frequency = freq;
		this.startTime = performance.now();
		this.animate = this.bounce_animation.bind(this);
	}
	jump(height = 4, duration = 1.2, ease = "power2.out") {
		this.stopGsap();
		const originalY = this.mesh.position.y;
		this.jumpTween = gsap.timeline({
		  onComplete: () => {
			this.jumpTween = null;
			this.mesh.position.y = originalY;
		  }
		});
		this.jumpTween.to(this.mesh.position, {
		  y: originalY + height,
		  duration: duration / 2,
		  ease: ease
		});
		this.jumpTween.to(this.mesh.position, {
		  y: originalY,
		  duration: duration / 2,
		  ease: "bounce.out"
		});
	  }
	  
	bounce_animation() {
		const elapsed = (performance.now() - this.startTime) / 1000;
		const pos = this.mesh.position;
		pos.x = this.amplitude[0] * Math.sin(elapsed * this.frequency);
		pos.y = this.amplitude[1] * Math.sin(elapsed * this.frequency * 1.2);
		pos.z = this.amplitude[2] * Math.sin(elapsed * this.frequency * 0.8);
	}
	stopGsap() {
		this.animate = ()=>{}
		if (this.tween) {
		  this.tween.kill();
		  this.tween = null;
		}
	  }
	spin(duration = 2, spins = 3, axis = 'z', lift = 0.2) {
		this.stopGsap();
		const startAngle = this.mesh.rotation[axis];
		const endAngle = startAngle + spins * Math.PI * 2;
		this.tween = gsap.timeline({
		  onUpdate: () => {
		  },
		  onComplete: () => {
			this.mesh.position.y = 0;
			this.tween = null;
		  }
		});
	
		this.tween.to(this.mesh.position, {
		  y: lift,
		  duration: duration / 2,
		  ease: "power2.out"
		}).to(this.mesh.position, {
		  y: 0,
		  duration: duration / 2,
		  ease: "power2.in"
		}, `-=${duration / 2}`);
	
		this.tween.to(this.mesh.rotation, {
		  [axis]: endAngle,
		  duration: duration,
		  ease: "power3.out"
		}, 0);
	  }
	  
	move([x, y, z], duration = 1) {
		this.stopGsap();
		gsap.to(this.mesh.position, {
			x, y, z,
			duration,
			ease: "power1.out"
		});
	}
	
}