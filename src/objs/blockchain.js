import * as THREE from 'three';
import { set_materials, create_block, createChainLink} from './blockchain_utils';

export default class BlockChain{
	constructor(blocks = 4, theme = 0, blockSize = 1, chainLen = 1){
		set_materials(theme);
		this.mesh = new THREE.Group();
		this.container = new THREE.Group();
		this.mesh.add(this.container);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		directionalLight.position.set(6, 10, 0);
		this.container.add(directionalLight);
		this.totalBlocks = 0;
		this.totalChains = 0;
		this.blockSize = blockSize;
		this.chainLen = chainLen;
		this.blocks = [];
		this.innerObjs = [];
		this.moveX = 0;
		for(let i = 0; i < blocks; i++)
			this.addBlock();
	}
	addBlock(blockGroup = null, transition = false) {
		if (this.totalBlocks >= 1) {
			this.addChain();
		}
		if (blockGroup == null) 
			blockGroup = create_block(this.blockSize);
		else
			console.log("blockgroup already give..")
		console.log("its -> ", blockGroup)
		const offsetX = this.totalBlocks * this.blockSize + this.totalChains * this.chainLen;

		this.blocks.push(blockGroup);
		blockGroup.position.set(offsetX, 0, 0);
		this.container.add(blockGroup);
		this.totalBlocks++;
		this.innerObjs[this.totalBlocks] = [];
		if (this.totalBlocks > 1) this.moveX -= this.blockSize / 2; 
		if (!transition) this.center();
		// this.addInnerObj(this.blocks.length - 1, new THREE.Mesh(new THREE.SphereGeometry(this.blockSize * 0.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff44ff})));
	}
	addChain() {
		const chain = createChainLink(5);
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