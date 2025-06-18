import * as THREE from 'three';
import gsap from 'gsap';



  
export default class ObjectMovement {
	constructor(mesh, isModel = false){
		this.mesh = mesh;
		this.animate = ()=>{}
		this.isModel = isModel;
		this.hide();
	}
	show(){
		if (this.isModel)
			return;
		this.mesh.visible = true;
	}
	hide(){
		if (this.isModel)
			return;
		this.mesh.visible = false;
	}
	addPos([x, y, z]){
		return [
			this.mesh.position.x + x,
			this.mesh.position.y + y,
			this.mesh.position.z + z
		]
	}
	iddle(y = 0.2, freq = 4) {
		this.amplitude = [0, y, 0];
		this.frequency = freq;
		this.startTime = performance.now();
	
		this.initialPos = this.mesh.position.clone();
	
		this.animate = this.bounce_animation.bind(this);
	}
	  
	  bounce_animation() {
		const elapsed = (performance.now() - this.startTime) / 1000;
		const offsetX = this.amplitude[0] * Math.sin(elapsed * this.frequency);
		const offsetY = this.amplitude[1] * Math.sin(elapsed * this.frequency * 1.2);
		const offsetZ = this.amplitude[2] * Math.sin(elapsed * this.frequency * 0.8);
	
		this.mesh.position.x = this.initialPos.x + offsetX;
		this.mesh.position.y = this.initialPos.y + offsetY;
		this.mesh.position.z = this.initialPos.z + offsetZ;
	}
	
	stopGsap() {
		this.animate = ()=>{}
		if (this.tween) {
		  this.tween.kill();
		  this.tween = null;
		}
	  }
	  jump(height = 4, duration = 1.2, ease = "power2.out") {
		this.stopGsap();
		const originalY = this.mesh.position.y;
	  
		return new Promise(resolve => {
		  this.jumpTween = gsap.timeline({
			onComplete: () => {
			  this.jumpTween = null;
			  this.mesh.position.y = originalY;
			  resolve();
			}
		  });
		  this.jumpTween.to(this.mesh.position, {
			y: originalY + height,
			duration: duration / 2,
			ease: ease
		  });
		  this.jumpTween.to(this.mesh.position, {
			y: originalY,
			duration: duration / 2,
			ease: "bounce.out"
		  });
		});
	  }
	  
	  spin(duration = 2, spins = 3,  onMidway = null, axis = 'z', lift = 0.2) {
		this.stopGsap();
		const startAngle = this.mesh.rotation[axis];
		const endAngle = startAngle + spins * Math.PI * 2;
	
		return new Promise(resolve => {
			this.tween = gsap.timeline({
				onComplete: () => {
					this.mesh.position.y = 0;
					this.tween = null;
					resolve();
				}
			});
			this.tween.to(this.mesh.position, {
				y: lift,
				duration: duration / 2,
				ease: "power2.out"
			});
			this.tween.to(this.mesh.position, {
				y: 0,
				duration: duration / 2,
				ease: "power2.in"
			}, `-=${duration / 2}`);
			this.tween.to(this.mesh.rotation, {
				[axis]: endAngle,
				duration: duration,
				ease: "power3.out"
			}, 0);
			if (typeof onMidway === 'function') {
				this.tween.add(() => {
					onMidway();
				}, duration / 2);
			}
		});
	}
	
	  
	  move([x, y, z], duration = 1, scale = -1) {
		if (duration == 0)
		{
			this.mesh.position.set(x, y, z);
			return;
		}
		this.stopGsap();
		return new Promise(resolve => {
		  const anims = [];
	  
		  // Animate position
		  anims.push(gsap.to(this.mesh.position, {
			x, y, z,
			duration,
			ease: "power1.out",
		  }));
	  
		  if (scale === 1) {
			this.mesh.scale.set(0, 0, 0); // immediately set scale to 0
			anims.push(gsap.to(this.mesh.scale, {
			  x: 1,
			  y: 1,
			  z: 1,
			  duration,
			  ease: "power1.out",
			}));
		  } 
		  else if (scale != -1) {
			anims.push(gsap.to(this.mesh.scale, {
			  x: scale,
			  y: scale,
			  z: scale,
			  duration,
			  ease: "power1.out",
			}));
		  }
		  // if scale == -1 do nothing
	  
		  // Wait for all animations to finish
		  Promise.all(anims.map(anim => new Promise(res => anim.eventCallback("onComplete", res)))).then(resolve);
		});
	  }
	  
	float(amplitude = 0.2, frequency = 1, drift = [0, 0, 0], rotationAmplitude = [0.05, 0.05, 0.05]) {
		this.amplitude = [drift[0], amplitude, drift[2]];
		this.frequency = frequency;
		this.rotationAmplitude = rotationAmplitude;
		this.startTime = performance.now();
	
		// Store original position and rotation
		this.initialPos = this.mesh.position.clone();
		this.initialRot = this.mesh.rotation.clone();
	
		this.animate = this.float_animation.bind(this);
	}
	
	float_animation() {
		const elapsed = (performance.now() - this.startTime) / 1000;
		const offsetY = this.amplitude[1] * Math.sin(elapsed * this.frequency * 1.2);
		const offsetX = this.amplitude[0] * Math.sin(elapsed * this.frequency) * 0.01;
		const offsetZ = this.amplitude[2] * Math.sin(elapsed * this.frequency * 0.9) * 0.01;
	
		this.mesh.position.x = this.initialPos.x + offsetX;
		this.mesh.position.y = this.initialPos.y + offsetY;
		this.mesh.position.z = this.initialPos.z + offsetZ;
	
		this.mesh.rotation.x = this.initialRot.x + this.rotationAmplitude[0] * Math.sin(elapsed * this.frequency * 0.8);
		this.mesh.rotation.y = this.initialRot.y + this.rotationAmplitude[1] * Math.sin(elapsed * this.frequency * 1.1);
		this.mesh.rotation.z = this.initialRot.z + this.rotationAmplitude[2] * Math.sin(elapsed * this.frequency * 0.9);
	}
	delete(object = null){
		if (object == null)
			object = this.mesh
		if (object.parent) {
			object.parent.remove(object);
		}
		if (object.geometry) {
			object.geometry.dispose();
		  }
				  if (object.material) {
			if (Array.isArray(object.material)) {
			  object.material.forEach(mat => mat.dispose());
			} else {
			  object.material.dispose();
			}
		}
		if (object.children) {
			for (let i = object.children.length - 1; i >= 0; i--) {
			  this.delete(object.children[i]);
			}
		  }
		}
		pulse(scaleMin = 0.9, scaleMax = 1.1, duration = 0.6, pulses = 3, vanish = false) {
			this.stopGsap(); // Stop any running animations
		
			return new Promise(resolve => {
				this.mesh.scale.set(scaleMin, scaleMin, scaleMin); // start at scaleMin
		
				this.tween = gsap.to(this.mesh.scale, {
					x: scaleMax,
					y: scaleMax,
					z: scaleMax,
					duration: duration,
					yoyo: true,
					repeat: pulses * 2 - 1, // up + down = 1 pulse
					ease: "sine.inOut",
					onComplete: () => {
						this.tween = null;
		
						if (vanish) {
							// Animate scale down to 0 after pulse finishes
							gsap.to(this.mesh.scale, {
								x: 0,
								y: 0,
								z: 0,
								duration: 0.3,
								ease: "power2.in",
								onComplete: resolve
							});
						} else {
							// Reset scale to normal
							this.mesh.scale.set(1, 1, 1);
							resolve();
						}
					}
				});
			});
		}
		
		stopPulse() {
			this.stopGsap();
			this.mesh.scale.set(1, 1, 1); // Reset to original scale if needed
		}
		vanish(duration = 0.5) {
			this.stopGsap();
		
			return new Promise(resolve => {
				this.tween = gsap.to(this.mesh.scale, {
					x: 0,
					y: 0,
					z: 0,
					duration: duration,
					ease: "power1.in",
					onComplete: () => {
						this.tween = null;
						this.mesh.visible = false; // Optionally hide after disappearing
						resolve();
					}
				});
			});
		}
		
				
}