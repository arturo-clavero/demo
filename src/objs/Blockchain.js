import * as THREE from 'three';
import { set_materials, create_block, createChainLink} from './utils/blockchain_utils';
import ObjectMovement from '../core/ObjectMovement';

export default class BlockChain extends ObjectMovement{
	constructor(scene_group = null, theme = 0, blocks = 4, blockSize = 1, pos = [0, 0, 0]){
		super(new THREE.Group())
		set_materials(theme);
		this.container = new THREE.Group();
		this.mesh.add(this.container);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		directionalLight.position.set(6, 10, 0);
		this.container.add(directionalLight);
		this.totalBlocks = 0;
		this.totalChains = 0;
		this.blockSize = blockSize;
		this.chainLen = blockSize;
		this.blocks = [];
		this.innerObjs = [];
		this.moveX = 0;
		for (let i = 0; i < blocks; i++)
			this.addBlock();
		if (scene_group)
			scene_group.add(this.mesh);
		this.mesh.position.set(pos[0], pos[1], pos[2])
	}
	async attachBlock(blockGroup, transition, scale = -1)
	{
		const offsetX = (this.totalBlocks + 1) * this.blockSize + (this.totalChains + 1) * this.chainLen;
		await this.move(this.addPos([- this.blockSize * 2, 0, 0], 1));
// Step 1: Create a temp object inside the container to compute world position
const temp = new THREE.Object3D();
temp.position.set(offsetX, 0, 0); // offsetX is local inside container
this.container.add(temp);

// Step 2: Get world position of that point
temp.updateMatrixWorld();
const worldTarget = new THREE.Vector3();
temp.getWorldPosition(worldTarget);

// Step 3: Clean up temp object (optional)
this.container.remove(temp);

// Step 4: Move block to that world position
await blockGroup.move(worldTarget.toArray(), transition, scale);
		this.addBlock(blockGroup, false);
	}
	addBlock(blockGroup = null, should_center = true) {
		if (blockGroup == null) 
		{
			blockGroup = create_block(this.blockSize);
			blockGroup.show();
		}
		blockGroup = blockGroup.mesh;
		if (this.totalBlocks >= 1) {
			this.addChain();
		}
		const offsetX = this.totalBlocks * this.blockSize + (this.totalChains) * this.chainLen;
		console.log("its -> ", blockGroup)
		this.blocks.push(blockGroup);
		blockGroup.position.set(offsetX, 0, 0);
		if (blockGroup.parent) {
			blockGroup.parent.remove(blockGroup);
		}
		this.container.add(blockGroup);
		this.totalBlocks++;
		this.innerObjs[this.totalBlocks] = [];
		if (this.totalBlocks > 1) this.moveX -= this.blockSize / 2; 
		if (should_center) this.center();
		// this.addInnerObj(this.blocks.length - 1, new THREE.Mesh(new THREE.SphereGeometry(this.blockSize * 0.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff44ff})));
	}
	addChain() {
		const chain = createChainLink(5, this.chainLen);
		chain.rotation.x += Math.PI / 8;
		const offsetX = (this.totalBlocks - 0.5) * this.blockSize + this.totalChains * this.chainLen ;
		chain.position.x = offsetX;
		
		this.container.add(chain);
		this.totalChains++;
		this.moveX -= this.chainLen / 2;
	}
	addInnerObj(block_index, mesh, pos = [0, 0, 0]){
		if (block_index < 0 || block_index >= this.blocks.length){
			console.log("wrong block index!")
			return;
		}
		mesh.position.set(0, 0, 0);
		this.blocks[block_index].add(mesh);
		this.innerObjs[block_index].push(mesh);
	}
	center() {
		console.log("this move-> ", this.moveX)
		console.log("before: ", this.container.position.x)
		this.container.position.x += this.moveX;
		console.log("after: ", this.container.position.x)
		this.moveX = 0;
	}

}