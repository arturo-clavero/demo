
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
	switchState(name) {
		if (this.currentState && this.currentState.name == name) return;
		if (this.currentState) this.currentState.exit();
		this.currentState = this.states[this.names[name]];
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
  