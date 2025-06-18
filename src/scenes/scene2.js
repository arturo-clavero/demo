import * as THREE from 'three';

import { user1, user2 } from './scene1';
import Token from '../objs/Token';
import ActionLink from '../core/ActionLink';

const scene_group = new THREE.Group();

class TokenGroup{
	constructor(name, pos, theme, hz = false, shift = true)
	{
		this.name = name;
		this.pos = pos;
		this.isHz = hz;
		this.length = 0;
		this.tokens = [];
		this.color = theme;
		this.rad = 0.5;
		this.space = this.rad * 2.2;
		this.container = new THREE.Group();
		scene_group.add(this.container);
		this.will_shift = shift;
	}
	get_next_pos(canMove){
		let pos;
		if (canMove == false)
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
	async add_token(num, id = null, color = null, canMove = true){
		let pos = this.get_next_pos(canMove);	
		console.log("pos: ", pos);
		let newtok;
		if (color == null)
			color = this.color;
		if (this.isHz)
			newtok = new Token(this.container, color, this.rad, pos);
		else
			newtok = new Token(scene_group, color, this.rad, pos);
		// newtok.toFlat();
		if (id)
			newtok.id = id;
		this.tokens.push(newtok);
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
	async migrate_token(token, color = -1, duration = 1, canMove = true){
		await token.move(this.get_next_pos(), duration);
		this.tokens.push(token);
		if (color >= 0)
			token.changeColor(color);
		await token.partOf.remove(token.id, canMove);
		if (this.name != "utxo")
			token.partOf = this;
	}
	async remove(id, canMove, vanish = false){
		console.log("removing")
		if (this.name == "user1" || this.name== "user2")
			utxo_set.remove(id);
		for (let i = 0; i < this.tokens.length; i++)
		{
			let tok = this.tokens[i];
			if (tok.id == id)
			{
				this.tokens.splice(i, 1);
				if (this.name == "utxo" || vanish == true)
					await tok.disappear();
				for (let j = i; j < this.tokens.length && canMove == true && this.will_shift == true; j++)
				{
					let next = this.tokens[j];
					if (this.hz)
						next.move([next.mesh.position.x - this.space, next.mesh.position.y, next.mesh.position.z], 0)
					else
						next.move([next.mesh.position.x, next.mesh.position.y + this.space, next.mesh.position.z], 0)
					this.container.position.x += this.space / 2;
				}
			}	
		}
		this.tokens.forEach((tok)=>{
			if (tok.id == id){
				this.tokens.delete(tok)
			}
		})
	}
	clear(){
		while (this.tokens.length > 0)
			this.remove[this.tokens[0].id]

	}
}

let utxo_set = new TokenGroup("utxo", [0, -7, -5], 4, true);
let user1_set = new TokenGroup("user1", [-3.5, -2, 0], 5);
let user2_set = new TokenGroup("user2", [3.5, -2, 0], 1);
let input_set = new TokenGroup("input", [-0.75, 0, 0], 2);
let output_set = new TokenGroup("output", [0.75, 0, 0], 1, false, false);

//  user1_set.add_token(1);
//  user1_set.add_token(2);

// user2_set.add_token(4);
// user2_set.add_token(5);

// input_set.migrate_token(user1_set.tokens[0], 2)// input_set.add_token(0);
// utxo_set.add_token(3);

// output_set.add_token(2);

let total_input, total_output, total_return;
let all_send = [2, 3, 5];
let sender, send, receiver;
let all_sender = [user1_set, user1_set, user2_set]
let all_receiver = [user2_set, user2_set, user1_set] ;
let n = 0;
let amount;

const tsx = new ActionLink(
	[
		2,
		//SEND to input
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
			amount = 0
			for (let i = 0; i < sender.tokens.length && amount < sender; i++)
			{

					amount += sender.tokens[i].num;
					await input_set.migrate_token(sender.tokens[i], 2, 2);
			}
		},
		4,
		//
		async()=>{
			await input_set.add_token(send, null, receiver.color, false)
			if (amount - send > 0)
				await input_set.add_token(amount-send, null, sender.color, false);
		},
		1,
		async()=>{
			await output_set.migrate_token(input_set.tokens[1], receiver.color, 1, false)
		},
		1,
		async()=>{
			if (amount - send > 0)
				await output_set.migrate_token(input_set.tokens[1], sender.color, 1, false);
		},
		4,
		
		async()=>{
			await receiver.migrate_token(output_set.tokens[0], receiver.color, 2, false);
		// },
		// 3,
		// async()=>{
		// 	if (output_set.tokens.length > 0)
			if (amount - send > 0)
				await sender.migrate_token(output_set.tokens[0], sender.color, 2, false);
		},
		async()=>{
			await input_set.remove(input_set.tokens[0].id, false, true);
		},
		4,
	]
)

function animate(time){
	user1.animate();
	user2.animate();
	// tokens[0].mesh.rotation.z += 0.01;
}
let state;
const y_scene = -5
export const transactions = {
	default_cam_pos: [0, y_scene, 9],
	name : "transactions",
	enter: ()=>{
		state = 0;
		user1.move([-4, y_scene + 3, 0])
		user2.move([4.15, y_scene + 3, 0])
		user1_set.add_token(5);
		tsx.execute();
	},
	exit: ()=>{
		user1_set.clear();
		user2_set.clear();
		input_set.clear();
		output_set.clear();
	},
	animate: (time)=>{animate(time)},
}
export const transactions_group = scene_group;

transactions.exit()