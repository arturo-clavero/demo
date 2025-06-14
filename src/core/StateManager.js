
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
	addStates(states) {
		for (let i = 0; i < states.length; i++){
			this.states.push(states[i]);
			this.names[states[i].name] = this.states.length - 1;
		}
		this.states.push(states);
		this.names[states]
	}
	changeState(name) {
		if (this.currentState) this.currentState.exit();
		this.currentState = this.states[this.names[name]];
		this.currentState.enter();
	}
	animate(){
		if (this.currentState) this.currentState.animate();
	}
	resize(){
		if (this.currentState) this.currentState.resize();
	}
  }
  