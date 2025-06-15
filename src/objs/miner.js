import * as THREE from 'three';
import gsap from 'gsap';

// 🎨 Single greenish theme
const themes =[
{ ball: 0xff66ff, ring: 0xcc33cc }, // Purple
{ ball: 0x66ccff, ring: 0x3399cc }, // Blue
{ ball: 0xff6699, ring: 0xcc3366 }, // Pink
 {
	ball: 0x66ffcc,       // brighter green
	ring: 0x88ffe0        // slightly lighter greenish-cyan
}];

function createMaterial(color) {
	return new THREE.MeshStandardMaterial({
		color,
		side: THREE.DoubleSide,         // show color on both sides
		transparent: false,             // fully solid
		depthWrite: true,
		emissive: new THREE.Color(color),
		emissiveIntensity: 0.3,         // slight self-lit effect
	});
}


function createPartialRing(radius, tube, arcAngle, segments, color) {
	const geometry = new THREE.TorusGeometry(radius, tube, 16, segments, arcAngle);
	const mesh = new THREE.Mesh(geometry, createMaterial(color));
	mesh.castShadow = false;
	mesh.receiveShadow = false;
	return mesh;
}


export default class Miner {
	constructor(size = 1, theme = 3) {
		this.mesh = new THREE.Group();

		// Main ball
		const ball = new THREE.Mesh(
			new THREE.SphereGeometry(size, 32, 32),
			createMaterial(themes[theme].ball)
		);
		this.mesh.add(ball);

		this.createRings(size, themes[theme].ring);

		this.amplitude = [0, 0.2, 0];
		this.frequency = 4;
		this.speed = 0.1;
		this.startTime = 0;

		this.animate = () => {};
		this.run()
		// this.move([0, 5, -10], 5);
	}

	createRings(size, color) {
		this.rings = [];

		const centerRing = createPartialRing(size * 1.2, 0.02, Math.PI * 0.5, 64,  color);
		centerRing.rotation.y = Math.PI / 2;
		centerRing.position.x = 0;
		this.mesh.add(centerRing);
		this.rings.push(centerRing);

		const leftRing = createPartialRing(size * 1.1, 0.015, Math.PI * 0.4, 64, color);
		leftRing.rotation.y = Math.PI / 2;
		leftRing.position.x = -size * 0.5;
		this.mesh.add(leftRing);
		this.rings.push(leftRing);

		const rightRing = createPartialRing(size, 0.015, Math.PI * 0.4, 64, color);
		rightRing.rotation.y = Math.PI / 2;
		rightRing.position.x = size * 0.5;
		this.mesh.add(rightRing);
		this.rings.push(rightRing);
	}
	stopGsap() {
		this.animate = ()=>{}
		if (this.tween) {
		  this.tween.kill();
		  this.tween = null;
		}
	  }
	setRingsVisible(visible) {
		this.rings.forEach(ring => ring.visible = visible);
	}

	iddle(y = 0.2, freq = 4) {
		this.setRingsVisible(false);
		this.amplitude = [0, y, 0];
		this.frequency = freq;
		this.startTime = performance.now();
		this.animate = this.bounce_animation.bind(this);
	}

	jump(height = 4, duration = 1.2, ease = "power2.out") {
		this.stopGsap();
		this.setRingsVisible(false);
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

	run(speed = 1) {
		this.setRingsVisible(true);
		this.speed = speed;
		this.animate = this.rotate_rings.bind(this);
	}
	rotate_rings() {
		this.rings.forEach((ring, i) => {
			ring.rotation.x += this.speed + i * 0.05;
		});
	}
	move([x, y, z], duration = 1) {
		// this.run(1/ duration * 0.1)
		this.setRingsVisible(false);
		this.stopGsap();
		gsap.to(this.mesh.position, {
			x, y, z,
			duration,
			ease: "power1.out"
		});
	}
}
