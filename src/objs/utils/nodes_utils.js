import * as THREE from 'three';

export const nodeThemes = {
	0: { // Sunset
	  lineColor: 0xff9933,
	  glowColor: 0xffcc66,
	  sphereColor: 0xff9966,
	},
	1: { // Ocean
	  lineColor: 0x0099cc,
	  glowColor: 0x66ccff,
	  sphereColor: 0x00bbee,
	},
	2: { // Mystic
	  lineColor: 0xaa66ff,
	  glowColor: 0xddbbff,
	  sphereColor: 0x9933ff,
	},
	3: { // LimeTech
	  lineColor: 0x99ff33,
	  glowColor: 0xccff99,
	  sphereColor: 0x66ff66,
	},
	4: { // CyberBlue
	  lineColor: 0x00ffff,
	  glowColor: 0x66ffff,
	  sphereColor: 0x33ccff,
	},
  };
  
export function createDecentralizedGroup({
  count = 20,
  width = 5,
  height = 2,
  z = 0,
  minRadius = 0.06,
  maxRadius = 0.1,
  maxAttempts = 100,
  theme = 0,

} = {}) {
  const group = new THREE.Group();
  const colors = nodeThemes[theme] || nodeThemes[0];

  const lineColor = new THREE.Color(colors.lineColor);
  const glowColor = new THREE.Color(colors.glowColor);
  const sphereColor = new THREE.Color(colors.sphereColor);

  const sphereMat = new THREE.MeshStandardMaterial({
    color: sphereColor,
    roughness: 0.5,
    metalness: 0.3,
  });
  const glowMat = new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lineMat = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.8,
  });

  const spheres = [];

  function isOverlapping(pos, radius) {
    for (const s of spheres) {
      const dist = pos.distanceTo(s.pos);
      if (dist < (radius + s.radius) * 1.05) return true; // small margin
    }
    return false;
  }

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let radius = THREE.MathUtils.lerp(minRadius, maxRadius, Math.random());
    let pos;
    do {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      pos = new THREE.Vector3(x, y, z);
      attempts++;
      if (attempts > maxAttempts) {
        console.warn('Could not place sphere without overlap, skipping.');
        break;
      }
    } while (isOverlapping(pos, radius));

    if (attempts > maxAttempts) continue; // skip if failed

    const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
	const sphere = new THREE.Mesh(sphereGeo, sphereMat.clone());
	sphere.userData.type ="node"
    sphere.position.copy(pos);
	sphere.scale.set(1, 1, 1);
    group.add(sphere);

    const glowGeo = new THREE.SphereGeometry(radius * 1.3, 32, 32);
    const glowSphere = new THREE.Mesh(glowGeo, glowMat.clone());
    glowSphere.position.copy(pos);
    group.add(glowSphere);

    spheres.push({ pos, radius });
  }

  const points = spheres.map(s => s.pos);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(lineGeo, lineMat);
  group.add(line);

  return group;
}
  
export function createCentralizedGroup({
	count = 12,
	radius = 0.08,
	centerRadiusMultiplier = 2,
	circleRadius = 1.5,
	theme = 0,
  } = {}) {
	const group = new THREE.Group();
	const colors = nodeThemes[theme] || nodeThemes[0];
  
	const lineColor = new THREE.Color(colors.lineColor);
	const glowColor = new THREE.Color(colors.glowColor);
	const sphereColor = new THREE.Color(colors.sphereColor);
  
	const sphereMat = new THREE.MeshStandardMaterial({
	  color: sphereColor,
	  roughness: 0.5,
	  metalness: 0.3,
	});
  
	const glowMat = new THREE.MeshBasicMaterial({
	  color: glowColor,
	  transparent: true,
	  opacity: 0.6,
	  blending: THREE.AdditiveBlending,
	  depthWrite: false,
	});
  
	const lineMat = new THREE.LineBasicMaterial({
	  color: lineColor,
	  transparent: true,
	  opacity: 0.8,
	});
  
	// Create central node
	const centerRadius = radius * centerRadiusMultiplier;
	const centerPos = new THREE.Vector3(0, 0, 0);
  
	const centerGeo = new THREE.SphereGeometry(centerRadius, 32, 32);
	const centerSphere = new THREE.Mesh(centerGeo, sphereMat.clone());
	centerSphere.position.copy(centerPos);
	group.add(centerSphere);
  
	const centerGlowGeo = new THREE.SphereGeometry(centerRadius * 1.3, 32, 32);
	const centerGlow = new THREE.Mesh(centerGlowGeo, glowMat);
	centerGlow.position.copy(centerPos);
	group.add(centerGlow);
  
	// Create outer nodes in a circle
	const angleStep = (Math.PI * 2) / count;
	for (let i = 0; i < count; i++) {
	  const angle = i * angleStep;
	  const x = Math.cos(angle) * circleRadius;
	  const y = Math.sin(angle) * circleRadius;
	  const pos = new THREE.Vector3(x, y, 0);
  
	  const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
	  const sphere = new THREE.Mesh(sphereGeo, sphereMat.clone());
	  sphere.position.copy(pos);
	  group.add(sphere);
  
	  const glowGeo = new THREE.SphereGeometry(radius * 1.3, 32, 32);
	  const glow = new THREE.Mesh(glowGeo, glowMat);
	  glow.position.copy(pos);
	  group.add(glow);
  
	  // Line to center
	  const lineGeo = new THREE.BufferGeometry().setFromPoints([centerPos, pos]);
	  const line = new THREE.Line(lineGeo, lineMat);
	  group.add(line);
	}
  
	return group;
  }
  