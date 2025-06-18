import * as THREE from 'three';
import { create_terrain, fractalNoise } from './utils/mountains_utils';

export default class Mountains{
	constructor(scene_group = null, theme = 0){
		this.mesh = new THREE.Group();
		this.scroll = 0;
		this.terrain_geometry();
		create_terrain(theme, this.mesh, this.geometry)
		// this.glowSpheres = []; // create_spheres(this.glowSpheres, this.width, this.depth, theme);
		this.updateTerrain(0);
		this.playing = false;
		this.lastTime = performance.now();
		if (scene_group)
			scene_group.add(this.mesh)
	}
	terrain_geometry(){
		this.width = 150;
		this.depth = 200;
		this.geometry = new THREE.PlaneGeometry(this.width, this.depth, 300, 300);
		this.geometry.rotateX(-Math.PI / 2);
		this.position = this.geometry.attributes.position;
		this.smoothedYs = new Float32Array(this.position.count).fill(0);
	}

	updateTerrain(deltaTime) {
		this.scroll -= 0.5 * deltaTime;
	  
		for (let i = 0; i < this.position.count; i++) {
		  const x = this.position.getX(i);
		  const z = this.position.getZ(i);
	  
		  const peakFactor = Math.pow(Math.abs(x) / (this.width / 2), 1);
	  
		  let y = fractalNoise(x * 0.1, 0, (z + scroll * 0.5) * 0.1);
		  y *= 200 * peakFactor;
	  
		  this.smoothedYs[i] = THREE.MathUtils.lerp(this.smoothedYs[i], y, 0.02);
		  this.position.setY(i, this.smoothedYs[i]);
		}
	  
		this.position.needsUpdate = true;
		this.geometry.computeVertexNormals();
	  
		// Animate glow spheres: pulse opacity and gentle vertical bobbing
		// const time = performance.now() * 0.002;
		// glowSpheres.forEach((sphere, i) => {
		//   const pulse = 0.4 + 0.6 * Math.sin(time * 2 + i);
		//   sphere.material.opacity = pulse * 0.6;
		//   sphere.position.y = -1.7 + 0.3 * Math.sin(time * 1.5 + i);
		// });
	  }
	move(){
		this.playing = true;
	}
	stop(){
		this.playing = false;
	}
	animate(){
		const now = performance.now();
		const deltaTime = (now - this.lastTime) / 16.67;
		this.lastTime = now;
		if (this.playing) this.updateTerrain(deltaTime);
	}
}