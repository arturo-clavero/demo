import * as THREE from 'three';

const scene = new THREE.Group();
  // Create star particles
const starCount = 1500;
const geometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

  // Colors from purple to blue
const colorPurple = new THREE.Color(0x8a2be2); // blueviolet
const colorBlue = new THREE.Color(0x0077ff);

for (let i = 0; i < starCount; i++) {
	// Random position in a cube of size 400 centered at 0
	const x = (Math.random() - 0.5) * 400;
	const y = (Math.random() - 0.5) * 400;
	const z = (Math.random() - 0.5) * 400;
	positions.push(x, y, z);

	// Interpolate color between purple and blue randomly
	const color = colorPurple.clone().lerp(colorBlue, Math.random());
	colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
// Create a circular star texture
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
  
  const circleTexture = createCircleTexture();
  
  // Points material with vertex colors
  const material = new THREE.PointsMaterial({
	size: 1.5,
	vertexColors: true,
	transparent: true,
	opacity: 0.9,
	sizeAttenuation: true,
	map: circleTexture,      // <- NEW
	alphaTest: 0.01          // <- Optional but helps remove edge artifacts
  });
  

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // Background gradient using a large sphere with gradient shader-like material
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

  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // Animate: slowly rotate stars
function animate(time=0) {
	console.log("heyyy")
	stars.rotation.y = time * 0.00001;
}

export const galaxy = {
	name : "galaxy",
	enter: ()=>{
		scene.visible = true;
	},
	exit: ()=>{
		scene.visible = false;
	},
	animate: (time)=>{animate(time)},
}

galaxy.exit()

export const galaxy_group = scene;