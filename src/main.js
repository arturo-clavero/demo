import * as THREE from 'three';
import StateManager from './core/StateManager';
import Engine from './core/Engine';
import State from './core/State';
import { galaxy, galaxy_group } from './backgrounds/galaxy';
import { mountains, mountains_group } from './backgrounds/mountaiins';

const stateManager = new StateManager();
new State(galaxy);
new State(mountains);

stateManager.switchState("galaxy");

const engine = new Engine();
engine.scene.add(galaxy_group);
engine.scene.add(mountains_group);

engine.animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    stateManager.resize();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', (event)=>{
	stateManager.keydown(event);
})