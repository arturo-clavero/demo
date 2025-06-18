import * as THREE from 'three';
import gsap from 'gsap';
import { material, neonColor, attach_number } from './utils/token_utils';
import ObjectMovement from '../core/ObjectMovement'

export default class Token extends ObjectMovement {
	constructor(scene_group, theme = 3, rad =1, pos = [0, 0,0]) {
	  super(new THREE.Group())

	  this.theme = theme;
		const geometry = new THREE.CylinderGeometry(rad, rad, rad * 0.2, 32);
		const mat = material(theme);
		const tokenMesh = new THREE.Mesh(geometry, mat);
	  
		const edges = new THREE.EdgesGeometry(geometry);
		const edgeMaterial = new THREE.LineBasicMaterial({
		  color: neonColor(theme),
		  linewidth: 2,
		});
		const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
	  
		this.mesh.add(tokenMesh);
		this.mesh.add(edgeLines);
	  
		this.radius = rad * 0.8;
		const segments = 64;
		const circleGeometry = new THREE.CircleGeometry(this.radius, segments);
		const edgesGeometry = new THREE.EdgesGeometry(circleGeometry);
		const outlineMaterial = new THREE.LineBasicMaterial({
		  color: neonColor(theme), 
		  linewidth: 2,
		  transparent: true,
		  opacity: 0.7,
		});
	  const outlines = new THREE.Group();
		const frontOutline = new THREE.LineSegments(edgesGeometry, outlineMaterial);
		frontOutline.position.z = 0.11 * rad;
		outlines.add(frontOutline);
		const backOutline = new THREE.LineSegments(edgesGeometry, outlineMaterial);
		backOutline.position.z = -0.11 * rad;
		outlines.add(backOutline);
		outlines.rotation.x = Math.PI * 0.5;
		this.mesh.add(outlines)
	  
		this.tokenMesh = tokenMesh;
this.edgeLines = edgeLines;
this.frontOutline = frontOutline;
this.backOutline = backOutline;

		this.toFlat();
		// this.mesh.rotation.x = Math.PI/2
		// this.toUp();
		this.toRight();
	  
		this.amplitude = [0, 0.2, 0];
		this.frequency = 4;
		this.speed = 0.1;
		this.startTime = 0;
	  this.id = Date.now();
		// this.jump();
		this.partOf = null;
		if (scene_group)
			scene_group.add(this.mesh)
		this.mesh.position.set(pos[0], pos[1], pos[2])
	  }
	  
	  
  toFlat(){
	this.mesh.rotation.x = Math.PI * 0.5;
	this.mesh.rotation.z = 0;
  }
  toUp(){
	this.mesh.rotation.x = Math.PI * 0.4;
  }
  toDown(){
	this.mesh.rotation.x = Math.PI * 0.6;
  }
  toRight(){
	this.mesh.rotation.z = Math.PI * 0.85;
  }
  toLeft(){
	this.mesh.rotation.z = Math.PI * 0.15;
  }
  changeColor(theme) {
	if (this.theme == theme)
		return;
	this.theme = theme;
	const newMat = material(theme);
	const newNeon = neonColor(theme);

	// Update main mesh material
	this.tokenMesh.material.dispose(); // cleanup old material
	this.tokenMesh.material = newMat;

	// Update edge lines
	this.edgeLines.material.dispose();
	this.edgeLines.material = new THREE.LineBasicMaterial({
		color: newNeon,
		linewidth: 2,
	});

	// Update outlines
	const newOutlineMat = new THREE.LineBasicMaterial({
		color: newNeon,
		linewidth: 2,
		transparent: true,
		opacity: 0.7,
	});

	this.frontOutline.material.dispose();
	this.backOutline.material.dispose();
	this.frontOutline.material = newOutlineMat.clone();
	this.backOutline.material = newOutlineMat.clone();
}
async verify(color = 4)
{
	await this.spin(1, 2, ()=>{this.changeColor(color)});
}
add_number(num){
	this.num = num;
	this.text_mesh = attach_number(String(num), this.radius)
	this.mesh.add(this.text_mesh)

}
update_number(num){
	this.num = num;
		const ctx = this.textMesh.material.map.image.getContext('2d');
		const size = this.textMesh.material.map.image.width;
		ctx.clearRect(0, 0, size, size);
		ctx.font = 'bold 64px Arial';
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(String(num), size / 2, size / 2);
		this.textMesh.material.map.needsUpdate = true;
	}

async disappear(pulses = 1){
	await this.pulse(0.8, 1.2, 0.4, pulses, true);
	await this.vanish(1);
	this.delete();
}
	
}