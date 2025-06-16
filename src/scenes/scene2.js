//mining

import * as THREE from 'three';
import gsap from 'gsap';

import Engine from '../core/Engine';
import Mountains from '../backgrounds/mountaiins';
import Nodes from '../objs/nodes';
import Miner from '../objs/miner';
import { create_block } from '../objs/blockchain_utils';
import BlockChain from '../objs/blockchain';
import Token from '../objs/token';

//CREATE OBJS
const scene_group_2 = new THREE.Group();
const background = new Mountains();
background.mesh.position.y -= 10;
const miners = [];
const total = 3;
const visible = 3;
let rad = 0.5;
let sp = 1.5
for (let i = 0; i < total; i++ )
{
	let color;
	if (i == 0) 
		color = 1;
	else if (i == 1)
		color = 1
	else if (i == 2)
		color = 1
	let miner = new Miner(rad, color);
	miner.mesh.position.set(0, -3, 0)
	miners.push(miner);
	if (i == 0)
		miner.mesh.position.x -= rad * 2 * sp;
	if (i == 2)
		miner.mesh.position.x += rad * 2 * sp;
	scene_group_2.add(miner.mesh);
}
const winner_token = new Token(2, 0.5);
winner_token.mesh.position.set(0, 0, 0)
const blockChain = new BlockChain(2, 0);
blockChain.mesh.position.y = 2.75
winner_token.mesh.visible = false;
//ORGANIZE OBJECTS
scene_group_2.add(background.mesh);
scene_group_2.add(winner_token.mesh);
scene_group_2.add(blockChain.mesh);

//CONSTANT ANIM:
let state = null;


let t = 5;
let winner, winner_id;

function start_race(){
	if (state == "mining")
		return;
	state = "mining";
	console.log("start race!")
	winner_id = Math.floor(Math.random() * 3);
	console.log("winner id: ", winner_id)
	winner = miners[winner_id]
	background.move();
	miners.forEach((miner)=>{
		if (miner != winner)
		{
			let z = 4 + Math.random() * (6 - 4);
			miner.move([miner.mesh.position.x + 0, miner.mesh.position.y + 0, miner.mesh.position.z + z], t)
		}
		miner.run();
	})
	setTimeout(() => {
		console.log("stop race!")
		miners.forEach((miner)=>{
			miner.animate = ()=>{}
		})
		set_winner();
	  }, 8000);

}

// setTimeout(() => {
		
// }, 1000);
function set_winner(){
	miners.forEach((miner) => {
		if (miner != winner)
			miner.mesh.position.z = 0;
		miner.mesh.position.y = -3;
		
	});
	background.stop();
	const og_pos = winner.mesh.position;
	winner.move([winner.mesh.position.x, winner.mesh.position.y + 2, winner.mesh.position.z], 1);
	setTimeout(() => {
		// blockChain.move([0, 10, 0], 1);
		setTimeout(() => {
			blockChain.addBlock();
			setTimeout(() => {
				winner_token.mesh.position.set(winner.mesh.position.x + 1.25, winner.mesh.position.y+ 0.5, winner.mesh.position.z)
				winner_token.mesh.visible = true;
				winner_token.jump(2);
				setTimeout(() => {
					winner_token.spin();
					setTimeout(() => {
						winner_token.mesh.visible = false;
						setTimeout(()=>{
							winner.move([og_pos.x, -3, 0], 2)
							setTimeout(()=>{
								state = null;
								setTimeout(()=>{
									start_race();
								}, 3000)
							})
						}, 2000)
					}, 3000);
				}, 2000);
			}, 1000);
		}, 1000);
	  }, 1000);
}


//ANIMATIONS:

function animate(time){
	background.animate(time);
	miners[0].animate(time);
	miners[1].animate(time);
	miners[2].animate(time);
	winner_token.animate(time);
	console.log("k");
}


let y = -10
export const mining = {
	default_cam_pos: [ 0, y, 10],
	target_lookat: [0, y, -1],
	name : "mining",
	enter: ()=>{
		//
		// 

		background.reset();
		new Nodes().mesh.visible = false;
		winner_token.mesh.visible = false;

		// start_race();

		setTimeout(()=>{
			start_race();
		}, 5000)

	},
	exit: ()=>{
		background.reset();
	},
	animate: (time)=>{animate(time)},
	keydown: (event)=>{
		console.log("key pressed: ", event)
		if (event.key == "Enter")
			start_race();
	}
}
scene_group_2.position.y = y;
export const mining_group = scene_group_2;