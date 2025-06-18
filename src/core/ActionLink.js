export default class ActionLink{

	constructor(fts = null, startFt = null){
		this.actions = [];
		this.durations = [];
		this.steps = 0;
		this.state = 0;
		this.startFt = startFt;
		if (fts)
		{
			for (let i = 0; i < fts.length; i++)
			{
				this.add_action(fts[i], fts[i + 1])
				i += 1;
			}
		}
		this.loop = false;
		this.end_loop = false;
		this.running = false;
	}
	add_action(duration, action){
		this.actions.push(action);
		this.durations.push(duration);
		this.steps += 1;
	}
	async execute(loop = false) {	
		this.loop = loop;
		this.end_loop = false;
		this.end_now = false;
		if (this.running)
			return;
		this.running = true;
		if (this.startFt) this.startFt();
		// await this.timeout(0);
		return new Promise(resolve => {
			this._resolve = resolve;
			this._timeout(0);
		});
	}
	_timeout(i) {
		if (this.end_now) {
		  this._resolve();
		  this.running = false;
		  return;
		}
	
		if (i >= this.steps) {
		  if (!this.loop || this.end_loop) {
			this._resolve();
			this.running = false;
			return;
		  }
		  i = 0;
		}
	
		setTimeout(async () => {
		  await this.actions[i]();
		  this._timeout(i + 1);
		}, this.durations[i] * 1000);
	  }
	// async timeout(i) {
	// 	if (this.end_now) return;
	// 	if (i >= this.steps) {
	// 		if (!this.loop || this.end_loop) return;
	// 		i = 0;
	// 	}
	// 	await this.actions[i]();
	// 	await new Promise(resolve => setTimeout(resolve, this.durations[i] * 1000));
	// 	await this.timeout(i + 1);
	// }
	finish_loop(){
		this.end_loop = true;
	}
	finish_now(){
		this.end_now = true;
	}


}