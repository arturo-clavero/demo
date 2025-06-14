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
		this.animate = animate;
		this.resize = resize;
		new StateManager().addStates(this);
	}
}