import StateManager from "./StateManager";

export default class State{
	constructor({
		name = null, 
		enter = ()=>{}, 
		exit = ()=>{}, 
		animate = ()=>{}, 
		resize = ()=>{},
	}){
		this.name = name;
		this.enter = enter;
		this.exit = exit;
		this.animate = (time)=>{
			console.log("animations for ", this.name)
			animate(time);
		}
		this.resize = resize;
		this.exit();
		new StateManager().addState(this);
	}
}