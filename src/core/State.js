import StateManager from "./StateManager";
import Engine from "./Engine";
import gsap from 'gsap';


export default class State{
	constructor({
		name = null, 
		default_cam_pos = [0, 0, 5],
		// target_lookat = [0, 0, -1],
		duration = 2,
		enter = ()=>{}, 
		exit = ()=>{}, 
		animate = ()=>{}, 
		resize = ()=>{},
		keydown = ()=>{}
	}){
		this.name = name;
		this.duration = duration;
		this.default_cam_pos = default_cam_pos;
		// this.target_lookat = target_lookat;
		this.enter = ()=>{
			enter();
			const engine = new Engine();
		const og_lookat = engine.lookAt.clone();
		return new Promise(resolve => {
		gsap.to(engine.camera.position, {
			x: this.default_cam_pos[0],
			y: this.default_cam_pos[1],
			z: this.default_cam_pos[2] + engine.cam_pos_resize,
			duration: this.duration,
			ease: 'power2.inOut',
			onUpdate: () => {
				engine.lookAt = og_lookat.clone();
			},
			onComplete: ()=>{
				resolve();
				// engine.camera.lookAt(og_lookat); // update camera orientation
			}
		});	
	});	
		}

		this.exit = exit;
		this.animate = (time)=>{
			animate(time);
		}
		this.keydown = (event)=>{
			keydown(event);
		}
		this.resize = resize;
		this.exit();
		new StateManager().addState(this);
	}
}