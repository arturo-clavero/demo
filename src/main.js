import StateManager from './core/StateManager';
import Engine from './core/Engine';
import State from './core/State';
import * as THREE from 'three';
import { intro, intro_group, intro_scroll } from './scenes/scene1';

const stateManager = new StateManager();
new State(intro);
new State(intro_scroll);
// new State(galaxy);
// new State(mountains);

stateManager.switchState("intro");

const engine = new Engine();
engine.scene.add(intro_group);
// engine.scene.add(galaxy_group);
// engine.scene.add(mountains_group);

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
	stateManager.keydown(event);
})
import gsap from 'gsap';

const originalCamY = engine.camera.position.y;
const scrollThreshold = 100;
const camMoveAmount = 0.05;
let windowStateChanged = false;
let currentTween = null;

window.addEventListener('scroll', () => {
  const newScroll = window.scrollY;

  if (newScroll <= scrollThreshold) {
    const t = newScroll / scrollThreshold;
    const targetY = originalCamY + t * camMoveAmount;

    if (currentTween) currentTween.kill(); // cancel previous tween

    currentTween = gsap.to(engine.camera.position, {
      y: targetY,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (windowStateChanged) {
      stateManager.switchState(null, -1);
      windowStateChanged = false;
    }
  } else {
    if (currentTween) currentTween.kill();

    currentTween = gsap.to(engine.camera.position, {
      y: originalCamY + camMoveAmount,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (!windowStateChanged) {
      stateManager.switchState(null, 1);
      windowStateChanged = true;
    }
  }
});
