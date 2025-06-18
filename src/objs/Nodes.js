import * as THREE from 'three';

import { createDecentralizedGroup, createCentralizedGroup, nodeThemes } from './utils/nodes_utils';
import { create_block } from './utils/blockchain_utils';
import Token from './Token';
import ObjectMovement from '../core/ObjectMovement';



export default class Nodes extends ObjectMovement {
	constructor(scene_group = null, centralised = false, theme = 0, pos = [0, 0, 0]) {
		super(new THREE.Group());
		this.theme = theme;
		this.isCentralised = centralised;
		this.centralNode = null;
		this.nodeMeshes = [];

		if (centralised) {
			this.nodes = createCentralizedGroup({ theme: theme });
			this.centralNode = this.nodes.children.find(obj => obj.isMesh && obj.geometry.type === 'SphereGeometry');
		} else {
			this.nodes = createDecentralizedGroup({ theme: theme });
			this.nodeMeshes = this.nodes.children.filter(obj => obj.isMesh && obj.geometry.type === 'SphereGeometry' && obj.userData.type === "node");
		}

		this.nodes.position.y = -0.75;
		this.mesh.add(this.nodes);
		if (scene_group)
			scene_group.add(this.mesh);
		this.mesh.position.set(pos[0], pos[1], pos[2]);
	}

	verify(minority = false) {
		if (this.isCentralised) {
			if (this.centralNode) {
				console.log("centralised")
				this.centralNode.material.color.set(0x00ff00); // Green
			}
		} else {
			console.log("hey?")
			const count = this.nodeMeshes.length;
			const percentage = minority
				? THREE.MathUtils.randInt(15, 25)
				: THREE.MathUtils.randInt(36, 100);
			const greenCount = Math.floor((percentage / 100) * count);
			const shuffled = [...this.nodeMeshes].sort(() => 0.5 - Math.random());
			for (let i = 0; i < greenCount; i++) {
				shuffled[i].material.color.set(0x00ff00); // Green
			}
			console.log("count: ", count,"pc: ", percentage, "green count: ", greenCount, )
		}
	}

	reset_colors() {
		const color = new THREE.Color(nodeThemes[this.theme].sphereColor);
		if (this.isCentralised) {
			if (this.centralNode) {
				this.centralNode.material.color.set(color);
			}
		} else {
			this.nodeMeshes.forEach(mesh => {
				mesh.material.color.set(color);
			});
		}
	}
}
