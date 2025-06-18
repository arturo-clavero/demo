import * as THREE from 'three';
import ObjectMovement from '../../core/ObjectMovement';

//THEMES
const themes = [
	{
	  name: "Bubblegum Glow",
	  blockColor: 0xff99cc,
	  edgeColor: 0xff44bb,
	  glowColor: 0xff66bb,
	  chainMaterial: new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 1.0,
		roughness: 0.15,
		clearcoat: 1.0,
		clearcoatRoughness: 0.05,
		reflectivity: 1.0,
		side: THREE.DoubleSide
	  })
	},
	{
	  name: "Electric Sky",
	  blockColor: 0x99ccff,
	  edgeColor: 0x66bbff,
	  glowColor: 0x3399ff,
	  chainMaterial: new THREE.MeshPhysicalMaterial({
		color: 0xbbeeff,
		metalness: 1.0,
		roughness: 0.2,
		clearcoat: 0.8,
		reflectivity: 1.0,
		side: THREE.DoubleSide
	  })
	},
	{
	  name: "Lime Cream",
	  blockColor: 0xccffcc,
	  edgeColor: 0xaaffaa,
	  glowColor: 0x88ff88,
	  chainMaterial: new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 0.95,
		roughness: 0.1,
		clearcoat: 1.0,
		side: THREE.DoubleSide
	  })
	},
	{
	  name: "Peach Neon",
	  blockColor: 0xffccaa,
	  edgeColor: 0xff9966,
	  glowColor: 0xff8844,
	  chainMaterial: new THREE.MeshPhysicalMaterial({
		color: 0xfbeee0,
		metalness: 1.0,
		roughness: 0.12,
		reflectivity: 1.0,
		side: THREE.DoubleSide
	  })
	},
	{
	  name: "Mint Core",
	  blockColor: 0xccffee,
	  edgeColor: 0x66ffe0,
	  glowColor: 0x33ffcc,
	  chainMaterial: new THREE.MeshPhysicalMaterial({
		color: 0xeeeeee,
		metalness: 0.9,
		roughness: 0.05,
		clearcoat: 1.0,
		reflectivity: 1.0,
		side: THREE.DoubleSide
	  })
	}
  ];

let chainMaterial, edgeBlockMat, glowColor, transparentBlockFace, blockMaterial;
export function set_materials(themeNum){
	const theme = themes[themeNum];
	chainMaterial = theme.chainMaterial;
	edgeBlockMat = new THREE.LineBasicMaterial({
		color: theme.edgeColor,
	  });
	glowColor = theme.glowColor,
	transparentBlockFace = new THREE.MeshStandardMaterial({
		color: theme.blockColor,
		transparent: true,
		opacity: 0.25,
		depthWrite: true,
		side: THREE.DoubleSide
	  });
	blockMaterial = new THREE.MeshStandardMaterial({
		color: theme.blockColor,
		emissive: theme.glowColor,
	  emissiveIntensity: 1.2,
	  roughness: 0.5,        // more matte for better shading
	  metalness: 0.2,
	  side: THREE.DoubleSide,
	});
}

export function create_block(size){
	const obj = new ObjectMovement(new THREE.Group());
	const blockGroup = obj.mesh;
	
	const blockGeometry = new THREE.BoxGeometry(size, size, size);
	const block = new THREE.Mesh(
		blockGeometry,
		[
			blockMaterial,
			blockMaterial,
			blockMaterial,
			blockMaterial,
			transparentBlockFace,
			blockMaterial,
		],
	);
	const edges = new THREE.EdgesGeometry(blockGeometry);
	const wireframe = new THREE.LineSegments(edges, edgeBlockMat);
	block.add(wireframe);
	blockGroup.add(block);
	let max = 5
	for (let i = 1; i <= max; i++) {
		const opacity = 0.15 * Math.exp(-0.5 * i);
		const glowMat = new THREE.MeshBasicMaterial({
			color: glowColor,
			transparent: true,
			opacity:opacity, // e.g. 0.3, 0.2, 0.1
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			side: THREE.DoubleSide
		});
		const glow = new THREE.Mesh(blockGeometry, glowMat);
		glow.scale.multiplyScalar(1 + i * 0.15); // slightly bigger
		blockGroup.add(glow);
	}
	return obj;
}
//CONSTANTS
const rad = 0.5;
const thick = 0.1;

//CHAIN FTS
function createRing(type = 0) {
	const geometry = type == 0? new THREE.TorusGeometry(rad, thick, 16, 100) : new THREE.TorusGeometry(rad, thick, 16, 100, Math.PI * 1);
	const material = chainMaterial;
	const link = new THREE.Mesh(geometry, material);
	if (type != 0 ) link.rotation.z = Math.PI * type;
	return link;
}
  
export function createChainLink(numLinks = 3, chainLen) {
	let total = 0;
	const chainGroup = new THREE.Group();
	const spacing = (rad + (thick * 0.5));
  
	const startCap = createRing(-0.5);
	total += 1.5;
	chainGroup.add(startCap);
  
	for (let i = 0; i < numLinks; i++) {
	  const link = createRing();
	  if (i % 2 === 0) link.rotation.x = Math.PI * 0.5;
	  else link.rotation.x = Math.PI * 0.75;
	  link.position.x += spacing * total;
	  total += 1.5;
	  chainGroup.add(link);
	}

	const endCap = createRing(0.5);
	endCap.position.x += spacing * (total );
	chainGroup.add(endCap);
  
	const box = new THREE.Box3().setFromObject(chainGroup);
	const size = new THREE.Vector3();
	box.getSize(size);

	const totalLength = size.x; 
	const reduce = chainLen / totalLength;
	chainGroup.scale.set(reduce, reduce, reduce);

	return chainGroup;
  }
  