import StateManager from './core/StateManager';
import Engine from './core/Engine';
import State from './core/State';
import * as THREE from 'three';
import gsap from 'gsap';
import { intro, intro_group, intro_scroll } from './scenes/scene1';
import { transactions, transactions_group } from './scenes/scene2';

// import { mining, mining_group } from './scenes/scene2';

const stateManager = new StateManager();
new State(intro);
new State(intro_scroll);
new State(transactions);
// new State(mining);


stateManager.switchState("transactions");

const engine = new Engine();
engine.scene.add(intro_group);
engine.scene.add(transactions_group);
// engine.scene.add(mining_group);


function animate(time){
		requestAnimationFrame(animate);
		stateManager.animate(time)
		engine.renderer.render(engine.scene, engine.camera);
}

animate();

window.addEventListener('resize', () => {
    engine.resize()
	stateManager.resize();
});

window.addEventListener('keydown', (event)=>{
	console.log("in main key down")
	stateManager.keydown(event);
})

//SCROLL
// let lastScrollY = window.scrollY;
// let currentTween = null;
// const originalCamY = engine.camera.position.y;
// const scrollThreshold = 50;
// const camMoveAmount = 0.01;

// let directionLock = null; // "up" or "down" — only switch once per direction

// window.addEventListener('scroll', () => {
//   const newScrollY = window.scrollY;
//   const delta = newScrollY - lastScrollY;

//   const isScrollingDown = delta > 0;
//   const isScrollingUp = delta < 0;

//   const t = Math.min(newScrollY, scrollThreshold) / scrollThreshold;
//   const targetY = originalCamY + t * camMoveAmount;

//   // Animate camera position
//   if (currentTween) currentTween.kill();
//   currentTween = gsap.to(engine.camera.position, {
//     y: targetY,
//     duration: 0.3,
//     ease: 'power2.out',
//   });

//   // Only switch state if not already locked for this direction
//   if (isScrollingDown && directionLock !== "down") {
//     console.log("next state");
//     stateManager.switchState(null, 1);
//     directionLock = "down";
//   } else if (isScrollingUp && directionLock !== "up") {
//     stateManager.switchState(null, -1);
//     directionLock = "up";
//   }

//   lastScrollY = newScrollY;
// });
