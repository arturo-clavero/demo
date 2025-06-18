import * as THREE from 'three';
import {create_sky, create_stars } from './utils/galaxy_utils'

export default class Galaxy{
	constructor(scene_group = null)
	{
		this.mesh = new THREE.Group();
		this.stars = create_stars();
		this.mesh.add(this.stars);
		this.mesh.add(create_sky());
		this.animate = ()=>{};
		if (scene_group)
			scene_group.add(this.mesh)
	}
	move_stars(){
		this.animate = this.rotate_stars;
	}
	rotate_stars(time=0)
	{
		this.stars.rotation.y = time * 0.00001;
	}
}

