import * as THREE from 'three';

import Galaxy from '../backgrounds/Galaxy';
import Token from '../objs/Token';
import BlockChain from '../objs/Blockchain';
import Nodes from '../objs/Nodes';
import Engine from '../core/Engine';
import Model from '../objs/Model';
import ActionLink, { currentAction } from '../core/ActionLink';
import { create_block } from '../objs/utils/blockchain_utils';

//CREATE OBJS
const scene_group = new THREE.Group();
export const background = new Galaxy(scene_group);
const c_nodes = new Nodes(scene_group, true, 2, [0, -3, 0]);
const d_nodes = new Nodes(scene_group, false, 1, [0, -3, 0]);
let blockchain = null;
const transaction = new THREE.Group();
scene_group.add(transaction);
const token = new Token(transaction, 3, 0.4, [0, 0, 0]);
export const user1 = new Model({x: -4, y:0,  scale:0.75, group: transaction, type: "user"}); 
export const user2 = new Model({x: 4.15, y:0, scale:1., group: transaction, type: "user"}); 


//INIT OBJS
await user1.load();
await user2.load();
token.iddle(0.1, 2)
user1.mesh.rotation.z -= Math.PI / 6
user2.mesh.rotation.z += Math.PI / 5

   
//ANIMATIONS:
let state;
// const c_verify = new ActionLink(
// 	[
		
// 	]
// )
let newblock;
// const d_verify = new ActionLink(
	
// )
const tx = new ActionLink(
[
	//MOVE TO CENTER
	3,
	async () => {
		console.log('lets go');
		token.hide();
		token.changeColor(3);
		token.move(user1.addPos([0.5, 1.25, 0]), 0);
		token.show();
		await token.move(token.addPos([0, 0.75, 0]), 1, 1);
	},
	0.5,
	async()=>{
		await token.move([0,0,0], 1);
		token.iddle();
	}, 
	1,
	//VERIFY
		async()=>{
			c_nodes.verify();
		},
		1,
		async()=>{
			await token.verify();
		},
	//SEND 
	0,
	async () => {
		await token.move(user2.addPos([-0.5, 2, 0]), 1);
		await token.move(token.addPos([0, -0.75, 0]), 1, 0);
		token.hide()
		if (state == 0)
			c_nodes.reset_colors();
		else if (state == 1)
			d_nodes.reset_colors();
	},
],
);


const tx2 = new ActionLink(
	[
		//MOVE TO CENTER
		3,
		async () => {
			console.log('lets go');
			token.hide();
			token.changeColor(3);
			token.move(user1.addPos([0.5, 1.25, 0]), 0);
			token.show();
			await token.move(token.addPos([0, 0.75, 0]), 1, 1);
		},
		0.5,
		async()=>{
			await token.move([0,0,0], 1);
			token.iddle();
		}, 
			0,
			async()=>{
	console.log("hey")
				d_nodes.verify(true);
			},
			
			0,
			async()=>{
				console.log("hey2")
				newblock = create_block(blockchain.blockSize * 1.5);
				console.log("newblock: ", newblock);
				new Engine().scene.add(newblock.mesh);
				newblock.show();
				newblock.mesh.position.set(token.addPos([0, 2, 0]))
				console.log("MOVE 1")
				const worldPos = new THREE.Vector3();
				token.mesh.getWorldPosition(worldPos); 
				await newblock.move([worldPos.x, worldPos.y + 0.2, worldPos.z], 1, 1);
				//d_nodes.verify();
			},
			2,
			async()=>{
				console.log("MOVE 2")
				const tok = new Token(scene_group, 2, 0.4, [0, 0, 0]);
				tok.show()
				newblock.mesh.add(tok.mesh)
				// tok.toFlat()
				console.log("blockchain: ", blockchain);
				await blockchain.attachBlock(newblock, 2, 0.75);
				console.log("atach block ?")
				tok.toFlat()
				//d_nodes.verify();
			},
			2,
			async()=>{
				d_nodes.verify();
			},
			2,
			async()=>{
				await token.verify();
			},	
		//SEND 
		0,
		async () => {
			await token.move(user2.addPos([-0.5, 2, 0]), 1);
			await token.move(token.addPos([0, -0.75, 0]), 1, 0);
			token.hide()
			if (state == 0)
				c_nodes.reset_colors();
			else if (state == 1)
				d_nodes.reset_colors();
		},
	],
	);


function animate(time){
	background.animate(time);
	token.animate(time);
	user1.animate(time);
	user2.animate(time);
	console.log("..");
	// nodes.mesh.position.y += 0.01;
}

//SCENE EXPORTS
export const intro_group = scene_group;

//SCENE 1.0
export const intro = {
	default_cam_pos: [0, 0, 9],
	name : "intro",
	enter: ()=>{
		state = 0;
		token.hide();
		c_nodes.mesh.position.y = 0.5;
		d_nodes.hide();
		c_nodes.show();
		user1.mesh.position.y = 0;
		user2.mesh.position.y = 0;
		transaction.position.y = 2.5;
		tx.execute(true);
		background.move_stars();
		user1.float(
			0.3,                  // Y float amplitude
			0.5,                  // Float frequency
			[0.02, 0.02, 0.02],      // Drift in x/z
			[0.09, 0.09, 0.09]    // Small rotations in x/y/z
		);
		user2.float(
			0.2,                  // Y float amplitude
			0.4,                  // Float frequency
			[0.01, 0.02, 0.02],      // Drift in x/z
			[0.09, 0.09, 0.07]    // Small rotations in x/y/z
		);
	},
	exit: (name)=>{
		token.hide();
		c_nodes.hide();
		c_nodes.reset_colors();
tx.finish_now();
		// if (name == "nodes")
		// 	return
		// nodes.mesh.visible = false;

	},
	animate: (time)=>{animate(time)},
}
intro.exit()

//SCENE 1.1
export const intro_scroll = {
		default_cam_pos: [0, 2, 9],
		name : "decentralization",
		enter: ()=>{
			state = 1;
			token.hide();
			d_nodes.mesh.position.y = -1;
			d_nodes.show();
			d_nodes.move([0, 1.5, 0], 2)
			blockchain = new BlockChain(scene_group, 1, 3, 0.8, [0, 8, 0]);
			blockchain.show();
			blockchain.move([0, 7, 0], 1);
			transaction.position.y = 2.5;
			user1.mesh.position.y = 0;
			user2.mesh.position.y = 0;
			console.log("execute true?")
			tx2.execute(true)
		},
		exit: (name)=>{
			token.hide();
			d_nodes.hide();
			d_nodes.reset_colors();
			if (blockchain)
				blockchain.hide();
			tx2.finish_now();
			// currentAction.finish_now();
			// if (name == "intro")
			// 	return
			// nodes.mesh.visible = false;
		},
		animate: (time)=>{animate(time)},
	}
//SCENE 1.2


