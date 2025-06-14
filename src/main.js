import * as THREE from 'three';
import StateManager from './core/StateManager';
import Engine from './core/Engine';
import State from './core/State';
import { galaxy, galaxy_group } from './backgrounds/galaxy';

const stateManager = new StateManager();
new State(galaxy);

stateManager.switchState("galaxy");

const engine = new Engine();
engine.scene.add(galaxy_group);

engine.animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    stateManager.resize();
	renderer.setSize(window.innerWidth, window.innerHeight);
});