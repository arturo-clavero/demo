import * as THREE from 'three';

import Galaxy from '../backgrounds/galaxy';
import Token from '../objs/token';
import BlockChain from '../objs/blockchain';
import { loadModel } from '../core/utils';
import Nodes from '../objs/nodes';
import gsap from 'gsap';
import Engine from '../core/Engine';

//CREATE OBJS
const scene_group = new THREE.Group();
const background = new Galaxy();
const nodes = new Nodes();
await nodes.init(1);
const blockchain = new BlockChain(3, 1);
const token = new Token(3, 0.4);

//ORGANIZE OBJECTS
scene_group.add(background.mesh);
const bs = 0.7
blockchain.mesh.scale.set(bs, bs, bs)
blockchain.mesh.position.set(0, 3, 0);
scene_group.add(blockchain.mesh);
const user1URL = 'models/user2.glb';
const user1 = await loadModel(user1URL, 0.5, new THREE.Vector3(-2, -0.5, 0));
scene_group.add(user1);
const user2URL = 'models/user2.glb';
const user2 = await loadModel(user2URL, 0.5, new THREE.Vector3(2, -0.5, 0));
scene_group.add(user2);
token.mesh.position.set(0, 0.5, 0);
scene_group.add(token.mesh);
nodes.mesh.position.set(0, -3, 0);
scene_group.add(nodes.mesh);

token.iddle(0.1, 2)
background.move_stars();
//ANIMATIONS:

function animate(time){
	background.animate(time);
	token.animate(time);
	console.log("..");
	// nodes.mesh.position.y += 0.01;
}

const default_cam_pos= [0, 0, 9];
const lookat = new THREE.Vector3(0, 0, -1);
const target_lookat = new THREE.Vector3(0, 2, -1);
export const intro = {
	// default_cam_pos: [0, 0, 5],
	name : "intro",
	enter: ()=>{
		const og_lookat = lookat.clone();
		const engine = new Engine();
		gsap.to(engine.camera.position, {
			x: default_cam_pos[0],
			y: default_cam_pos[1],
			z: default_cam_pos[2] + engine.cam_pos_resize,
			duration: 2,
			ease: 'power2.inOut',
			onUpdate: () => {
				engine.camera.lookAt(og_lookat); // update camera orientation
			}
			
		});	
		gsap.to(og_lookat, {
			x: target_lookat.x,
			y: target_lookat.y,
			z: target_lookat.z,
			duration: 2,
			onUpdate: () => {
			//   engine.camera.lookAt(target_lookat[0], target_lookat);
			}
		  });
	},
	exit: ()=>{
	},
	animate: (time)=>{animate(time)},
}

export const intro_group = scene_group;

const default_cam_pos_scroll= [0, 0, 10];
export const intro_scroll = {
		// default_cam_pos: [0, 0, 5],
		name : "intro-scroll",
		enter: ()=>{
			const engine = new Engine();
			const og_lookat = target_lookat.clone();
			gsap.to(engine.camera.position, {
				x: default_cam_pos_scroll[0],
				y: default_cam_pos_scroll[1],
				z: default_cam_pos_scroll[2] + engine.cam_pos_resize,
				duration: 2,
				ease: 'power2.inOut',
				onUpdate: () => {
					engine.camera.lookAt(og_lookat); // update camera orientation
				}
			});
			gsap.to(og_lookat, {
				x: lookat.x,
				y: lookat.y,
				z: lookat.z,
				duration: 2,
				onUpdate: () => {
				//   engine.camera.lookAt(target_lookat[0], target_lookat);
				}
			  });
			},
		exit: ()=>{
		},
		animate: (time)=>{animate(time)},
	}
intro.exit()

