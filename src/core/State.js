import StateManager from "./StateManager";

export default class State{
	constructor({
		name = null, 
		enter = ()=>{}, 
		exit = ()=>{}, 
		animate = ()=>{}, 
		resize = ()=>{},
		keydown = ()=>{}
	}){
		this.name = name;
		this.enter = enter;
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