import * as THREE from 'three';
import gsap from 'gsap';
import { createMaterial, createPartialRing, themes } from './utils/miner_utils';
import ObjectMovement from '../core/ObjectMovement';

export default class Miner extends ObjectMovement{
	constructor(scene_group = null, size = 1, theme = 3) {
		super(new THREE.Group())
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

		this.run()
		// this.move([0, 5, -10], 5);
		if (scene_group)
			scene_group.add(this.mesh)
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
	run(speed = 1, vel = 0) {
		console.log("run!")
		this.setRingsVisible(true);
		this.speed = speed;
		this.animate = ()=> this.rotate_rings.bind(this);
	}
	rotate_rings() {
		console.log("rotate tings")
		this.rings.forEach((ring, i) => {
			ring.rotation.x += this.speed + i * 0.05;
		});
	}
}
