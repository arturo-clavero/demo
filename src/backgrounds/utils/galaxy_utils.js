
import * as THREE from 'three';

function createCircleTexture() {
	const size = 64;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
  
	const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
	gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
  
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
	ctx.fill();
  
	return new THREE.CanvasTexture(canvas);
  }
  

export function create_stars(){
	const starCount = 1500;
	const geometry = new THREE.BufferGeometry();
	const positions = [];
	const colors = [];
	const colorPurple = new THREE.Color(0x8a2be2);
	const colorBlue = new THREE.Color(0x0077ff);
	for (let i = 0; i < starCount; i++) {
		const x = (Math.random() - 0.5) * 400;
		const y = (Math.random() - 0.5) * 400;
		const z = (Math.random() - 0.5) * 400;
		positions.push(x, y, z);
		const color = colorPurple.clone().lerp(colorBlue, Math.random());
		colors.push(color.r, color.g, color.b);
	  }
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	const circleTexture = createCircleTexture();
	const material = new THREE.PointsMaterial({
		size: 1.5,
		vertexColors: true,
		transparent: true,
		opacity: 0.9,
		sizeAttenuation: true,
		map: circleTexture,   
		alphaTest: 0.01   
	  });
	  return new THREE.Points(geometry, material);
}

export function create_sky(){
	const vertexShader = `
	varying vec3 vPosition;
	void main() {
	  vPosition = position;
	  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	}
  `;

  const fragmentShader = `
	varying vec3 vPosition;
	void main() {
	  float intensity = pow(1.0 - abs(vPosition.y) / 200.0, 2.0);
	  vec3 colorTop = vec3(0.1, 0.05, 0.3); // dark purple
	  vec3 colorBottom = vec3(0.0, 0.0, 0.1); // dark blue
	  vec3 color = mix(colorBottom, colorTop, intensity);
	  gl_FragColor = vec4(color, 1.0);
	}
  `;
  const skyGeo = new THREE.SphereGeometry(500, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	side: THREE.BackSide,
  });
  return new THREE.Mesh(skyGeo, skyMat);
}
