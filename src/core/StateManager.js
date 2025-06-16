import Engine from "./Engine";

export default class StateManager {
	constructor() {
	  if (StateManager.instance) {
		return StateManager.instance;
	  }
	  this.states = [];
	  this.names = {};
	  this.currentState = null;
	  StateManager.instance = this;
	}
	addState(state) {
		this.states.push(state);
		this.names[state.name] = this.states.length - 1;
	}
	switchState(name = null, move) {
		if (name == null && this.currentState == null)
		{
			if (this.states.length == 0) return;
			this.currentState = this.states[0];
		}
		else if (name == null){
			let i = this.names[this.currentState.name] + move;
			if (i >= this.states.length || i < 0) return;
			this.currentState.exit();
			this.currentState = this.states[i]
		}
		else if(this.currentState && this.currentState.name == name) return;
		else{
			if (this.currentState) this.currentState.exit(name);
			this.currentState = this.states[this.names[name]];
		}
		this.currentState.enter();
	}
	animate(time){
		if (this.currentState) this.currentState.animate(time);
	}
	resize(){
		if (this.currentState) this.currentState.resize();
	}
	keydown(event){
		if (this.currentState) this.currentState.keydown(event);
	}
  }
  