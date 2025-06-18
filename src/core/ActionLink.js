export let currentAction = null;

export default class ActionLink {

	constructor(fts = null, startFt = null) {
		this.actions = [];
		this.durations = [];
		this.steps = 0;
		this.state = 0;
		this.startFt = startFt;

		if (fts) {
			for (let i = 0; i < fts.length; i += 2) {
				this.add_action(fts[i], fts[i + 1]);
			}
		}

		this.loop = false;
		this.end_loop = false;
		this.end_now = false;
		this.running = false;

		this.currentIndex = 0;
		this.paused = false;
		this._resolve = null;
		this._timeoutID = null;
	}

	add_action(duration, action) {
		this.actions.push(action);
		this.durations.push(duration);
		this.steps += 1;
	}

	async execute(loop = false) {
		console.log("executing ?")
		this.loop = loop;
		this.end_loop = false;
		this.end_now = false;
		console.log("this running: ", this.running)
		console.log("this paused: ", this.paused)

		if (this.paused) return;
		console.log("ok")
		currentAction = this;
		this.running = true;
		this.paused = false;

		if (this.startFt) this.startFt();
	
		return new Promise(resolve => {
			this._resolve = resolve;
			this._timeout(this.currentIndex);
		});
	}

	_timeout(i) {
		if (this.end_now) {
			this.running = false;
			this._resolve?.();
			return;
		}

		if (i >= this.steps) {
			if (!this.loop || this.end_loop) {
				this.running = false;
				this._resolve?.();
				return;
			}
			i = 0;
		}

		this.currentIndex = i;

		if (this.paused) {
			// Pause: do not continue
			return;
		}

		this._timeoutID = setTimeout(async () => {
			await this.actions[i]();

			if (!this.paused) {
				this._timeout(i + 1);
			}
			// else: do nothing — will be resumed later
		}, this.durations[i] * 1000);
	}

	pause() {
		console.log("pause")
		if (!this.running || this.paused) return;
console.log("yes")
		this.paused = true;

		if (this._timeoutID) {
			clearTimeout(this._timeoutID);
			this._timeoutID = null;
		}
	}

	resume() {
		console.log("resume")
		if (!this.paused) return;
		console.log("yes")
		this.paused = false;
		this.running = true;

		this._timeout(this.currentIndex + 1); // Resume from where it left off
	}

	finish_loop() {
		this.end_loop = true;
	}

	finish_now() {
		this.end_now = true;
		if (this._timeoutID) {
			clearTimeout(this._timeoutID);
			this._timeoutID = null;
		}
	}
}
