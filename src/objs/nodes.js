import * as THREE from 'three';

import { create_earth, createDecentralizedGroup } from './nodes_utils';
import { create_block } from './blockchain_utils';
import Token from './token';


export default class Nodes{
	constructor() {
		if (Nodes.instance) return Nodes.instance;
		this.mesh = new THREE.Group();
	}

	async init(theme = 0) {
		// create and add earth (wait for texture to load)
		const earth = await create_earth(10);
		earth.position.set(0, -12, -10);
		earth.scale.set(2, 1, 1);
		this.mesh.add(earth);

		// create and add decentralized group
		this.nodes = createDecentralizedGroup({ theme: theme});
		this.nodes.position.y = -0.75;
		this.mesh.add(this.nodes);
		Nodes.instance = this;
	}
	mine(){

	}
	mine_animation(){

	}
	win(){

	}
	concensus(){
		const block = create_block(0.1);
		//block.move move block and increase size to 0, 0, 0 size to 1;
		const token = new Token(2);
		block.add(token);
		//block move to top right
		this.blockchain.addBlock(block);
	}



}