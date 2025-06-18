import * as THREE from 'three';

import { background, user1, user2 } from './scene1';
import Token from '../objs/Token';
import ActionLink from '../core/ActionLink';
import { neonColor } from '../objs/utils/token_utils';
import { JoinNode } from 'three/webgpu';

const scene_group = new THREE.Group();

class TokenGroup{
	constructor(name, title, pos, theme, hz = false, shift = true, canUpdate = true)
	{
		this.name = name;
		this.pos = pos;
		this.isHz = hz;
		this.length = 0;
		this.tokens = [];
		this.color = theme;
		this.rad = 0.5;
		this.space = this.rad * 2.5;
		this.container = new THREE.Group();           // Main visual group
		this.container_token = new THREE.Group();     // Tokens
		this.titleGroup = new THREE.Group();          // Title only
		
		scene_group.add(this.container, this.container_token, this.titleGroup);
		
		this.will_shift = shift;
// Set fixed dimensions
// Fixed dimensions
const width = this.space * 1.15;
const height = this.space * 3;
const offset = this.space * 1.8;

// Create background plane
this.outlineMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(width, height),
	new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.15,
		side: THREE.DoubleSide,
		depthWrite: false
	})
);

// Create outline lines
const outlineColor = neonColor(theme);
const outlineGeometry = new THREE.BufferGeometry();
const halfW = width / 2;
const halfH = height / 2;

const vertices = new Float32Array([
	-halfW, -halfH, 0,  halfW, -halfH, 0,
	halfW, -halfH, 0,   halfW, halfH, 0,
	halfW, halfH, 0,   -halfW, halfH, 0,
	-halfW, halfH, 0,  -halfW, -halfH, 0
]);
outlineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const outlineLines = new THREE.LineSegments(
	outlineGeometry,
	new THREE.LineBasicMaterial({ color: outlineColor })
);

// Positioning both outline and plane correctly
if (this.isHz) {
	this.outlineMesh.rotation.z = Math.PI / 2;
	this.outlineMesh.position.set(pos[0], pos[1], pos[2]);

	outlineLines.rotation.z = Math.PI / 2;
	outlineLines.position.set(pos[0], pos[1], pos[2] + 0.01); // Slightly in front
} else {
	this.outlineMesh.position.set(pos[0], pos[1] - offset, pos[2]);
	outlineLines.position.set(pos[0], pos[1] - offset, pos[2] + 0.01);
}

// Add both to the main container
scene_group.add(this.outlineMesh);
scene_group.add(outlineLines);

// Optional: Title positioning
if (title) {
	this.addTitleSprite(title);
	this.titleSprite.position.set(pos[0], pos[1] , 0);
}

		
	}
	addTitleSprite(text) {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 64;
		const ctx = canvas.getContext('2d');
		ctx.font = '28px Arial';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(text, canvas.width / 2, 40);
	
		const texture = new THREE.CanvasTexture(canvas);
		const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
		this.titleSprite = new THREE.Sprite(material);
		this.titleSprite.scale.set(2.5, 0.6, 1);
	
		// Fixed above the container

		this.titleSprite.position.set(this.pos[0], this.pos[1] + 2.5, this.pos[2]);
		if (this.isHz)
			this.titleGroup.position.y -= 0.5;
		this.titleGroup.add(this.titleSprite);
	}
	recenter() {
		if (this.tokens.length === 0) return;
	
		let totalLength = (this.tokens.length - 1) * this.space;
		let startOffset = -totalLength / 2;
	
		this.tokens.forEach((tok, i) => {
			if (this.isHz) {
				const x = this.pos[0] + startOffset + i * this.space;
				tok.move([x, this.pos[1], this.pos[2]], 0);
			} else {
				const y = this.pos[1] + startOffset - i * this.space;
				tok.move([this.pos[0], y, this.pos[2]], 0);
			}
		});
	}
		
	
	
	get_next_pos(canMove){
		let pos;
		if (canMove == false && !this.isHz)
			return [this.pos.x, this.pos.y - this.space, this.pos.z];
		if (this.isHz)
			{
				pos = [this.pos[0]+ (this.space * (this.tokens.length + 1)), this.pos[1], this.pos[2]]
				this.container.position.x -= this.space;
			}
			else
				pos = [this.pos[0], this.pos[1] - (this.space * (this.tokens.length + 1)), this.pos[2]]
		return pos;
	}
	async add_token(num, id = null, color = null, canMove = true, canUpdate){
		let pos = this.get_next_pos(canMove);	
		console.log("pos: ", pos);
		let newtok;
		if (color == null)
			color = this.color;
		if (this.isHz)
			newtok = new Token(this.container_token, color, this.rad, pos);
		else
			newtok = new Token(scene_group, color, this.rad, pos);
		// newtok.toFlat();
		if (id)
			newtok.id = id;
		this.tokens.push(newtok);
		if (this.isHz)
			this.recenter();
		// if (canUpdate)
		// 	this.updateOutline();
		// newtok.toFlat();
		newtok.add_number(num);
		newtok.show();
		if (this.name != "utxo")
			newtok.partOf = this;
		if (this.name == "user1" || this.name == "user2")
			await utxo_set.add_token(num, newtok.id)
		else if (this.name != "utxo")
			await utxo_set.remove(newtok.id)
	}
	async migrate_token(token, color = -1, duration = 1, canMove = true, canUpdate = true, nextUpdate = true){
		await token.move(this.get_next_pos(), duration);
		this.tokens.push(token);
		// if (canUpdate) this.updateOutline()
		if (color >= 0)
			token.changeColor(color);
		await token.partOf.remove(token.id, canMove, nextUpdate);
		if (this.name != "utxo")
			token.partOf = this;
		if (this.name == "user1" || this.name == "user2")
			await utxo_set.add_token(token.num, token.id)
	}
	async remove(id, canMove = true, canUpdate = true, vanish = false){
		console.log("removing")
		if (this.name == "user1" || this.name== "user2")
			await utxo_set.remove(id);
		for (let i = 0; i < this.tokens.length; i++)
		{
			let tok = this.tokens[i];
			if (tok.id == id)
			{
				this.tokens.splice(i, 1);
				// if (canUpdate)
				// 	this.updateOutline()
				if (this.name == "utxo" || vanish == true)
					await tok.disappear();
				for (let j = i; j < this.tokens.length && ((canMove == true && this.will_shift == true) || this.isHz); j++)
				{
					let next = this.tokens[j];
					if (this.isHz)
						next.move([next.mesh.position.x - this.space, next.mesh.position.y, next.mesh.position.z], 0)
					else
						next.move([next.mesh.position.x, next.mesh.position.y + this.space, next.mesh.position.z], 0)
					this.container_token.position.x -= this.space / 2;
				}
				if (this.isHz)
					this.recenter()
			}	
		}
		// this.tokens.forEach((tok)=>{
		// 	if (tok.id == id){
		// 		this.tokens.delete(tok)
		// 	}
		// })
	}
	async clear() {
		while (this.tokens.length > 0) {
			await this.remove(this.tokens[0].id, false, true, true);
		}
	}
}

let utxo_set = new TokenGroup("utxo", "UTXO SET", [0, -7, -5], 4, true);
let user1_set = new TokenGroup("user1", "Alice", [-3.5, -2, 0], 5);
let user2_set = new TokenGroup("user2", "Bob", [3.5, -2, 0], 1);
let input_set = new TokenGroup("input", "Input", [-0.75, 0, 0], 2);
let output_set = new TokenGroup("output", "Output", [0.75, 0, 0], 3, false, false);


let total_input, total_output, total_return;
let all_text = [
	"Alice sends 1 token to Bob",
	"Alice sends 2 tokens to Bob",
	"Bob sends 3 tokens to Alice",
]
let all_send = [1, 2, 3];
let sender, send, receiver;
let all_sender = [user1_set, user1_set, user2_set]
let all_receiver = [user2_set, user2_set, user1_set] ;
let n = 0;
let amount;

const tsx = new ActionLink(
	[
		4,
		//SEND to input
		async()=>{
			// console.log("n: ", n);
			if (n >= 3)
				n = 0;
			showTitle(all_text[n])
},
3,
async()=>{
			sender = all_sender[n];
			send = all_send[n];
			receiver = all_receiver[n];
			let tok = null;
			for (let i = 0; i < sender.tokens.length && tok == null; i++)
			{
				if (sender.tokens[i].num >= send)
				{
					tok = sender.tokens[i]
					await input_set.migrate_token(tok, 2, 2);
					amount = tok.num;
					return;
				}
			}
			console.log("amount not enough")
			amount = 0;
			while ( sender.tokens.length > 0 && amount < send)
			{

					amount += sender.tokens[0].num;
					await input_set.migrate_token(sender.tokens[0], 2, 2);

			}
		},
		2,
		//
		async()=>{
			await input_set.add_token(send, null, receiver.color, false)
			input_set.tokens[1].mesh.position.copy(input_set.tokens[0].mesh.position)
			if (amount - send > 0)
			{
				await input_set.add_token(amount - send, null, sender.color, false);
				input_set.tokens[2].mesh.position.copy(input_set.tokens[0].mesh.position)

			}},
		1,
		async()=>{
			await output_set.migrate_token(input_set.tokens[1], receiver.color, 1, false, true, false)
		},
		1,
		async()=>{
			if (amount - send > 0)
				await output_set.migrate_token(input_set.tokens[1], sender.color, 1, false, true, false);
		},
		2,
		
		async()=>{
			await receiver.migrate_token(output_set.tokens[0], receiver.color, 2, false, true);
		// },
		// 3,
		// async()=>{
		// 	if (output_set.tokens.length > 0)
			if (amount - send > 0)
				await sender.migrate_token(output_set.tokens[0], sender.color, 2, false, true);
		},
		2,
		async()=>{
			await input_set.remove(input_set.tokens[0].id, false, true, true);
			const title = document.getElementById("topTitle");
			title.textContent = all_text[n] + " ✔";
			n += 1;
		},
		2,
		async()=>{
			hideTitle();
		}
	]
)

function animate(time){
	user1.animate(time);
	user2.animate(time);
	background.animate(time);
	// tokens[0].mesh.rotation.z += 0.01;
}
const y_scene = -15;
const topTitle = document.getElementById("topTitle");
scene_group.position.y = y_scene + 5;
export const transactions = {
	default_cam_pos: [0, y_scene, 12],
	name : "transactions",
	enter: ()=>{
		user1.move([-4, y_scene + 1.75, 0], 2)
		user2.move([4.15, y_scene + 1.75, 0], 2)
		user1_set.add_token(1);
		user1_set.add_token(5);
		background.move_stars();
		n = 0;

		// showTitle(all_text[n]);
		tsx.execute(true);
	},
	exit: ()=>{
		tsx.finish_now();
		user1_set.clear();
		user2_set.clear();
		input_set.clear();
		output_set.clear();
		hideTitle();
	},
	animate: (time)=>{animate(time)},
	keyboard: (event)=>{
		if (event.key == "ArrowRight")
		{
			n += 1;
			if (n > all_receiver.length)
				n = 0;
			tsx.finish_now();
			tsx.execute(true);
			showTitle(all_text[n]);
		}
		if (event.key == "ArrowLeft")
			{
				n -= 1;
				if (n < 0)
					n = 2;
				tsx.finish_now();
				tsx.execute(true);
				showTitle(all_text[n]);
			}
	}
}


function showTitle(text) {
	const title = document.getElementById("topTitle");
	title.textContent = text;
	title.style.display = "block";
	requestAnimationFrame(() => {
	  title.style.opacity = "1";
	});
  }
  
  function hideTitle() {
	const title = document.getElementById("topTitle");
	title.style.opacity = "0";
	setTimeout(() => {
	  title.style.display = "none";
	}, 500); // match transition duration
  }
  

export const transactions_group = scene_group;

transactions.exit()