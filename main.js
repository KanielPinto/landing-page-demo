import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

var scene,
  sceneLight,
  portalLight,
  cam,
  renderer,
  portalParticles = [],
  smokeParticles = [];

function initScene() {
  scene = new THREE.Scene();

  sceneLight = new THREE.DirectionalLight(0xF6DDEB, 0.5);
  sceneLight.position.set(0, 0, 1);
  scene.add(sceneLight);

  portalLight = new THREE.PointLight(0x93CCF8, 10, 800, 3);
  portalLight.position.set(0, 0, 250);
  scene.add(portalLight);

  cam = new THREE.PerspectiveCamera(
    160,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  cam.position.z = 107;
  scene.add(cam);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x0e0b1e, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  particleSetup();
}
function particleSetup() {
  let loader = new THREE.TextureLoader();

  loader.load("./assets/smoke5.png", function (texture) {
    let portalGeo = new THREE.PlaneGeometry(350, 350);
    let portalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
    });
    let smokeGeo = new THREE.PlaneGeometry(1000, 1000);
    let smokeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 620; p > 250; p--) {
      let particle = new THREE.Mesh(portalGeo, portalMaterial);
      particle.position.set(
        p * Math.cos((4 * p * Math.PI) / 180),
        p * Math.sin((4 * p * Math.PI) / 180),
        0.1 * p
      );
      particle.rotation.z = Math.random() * 360;
      portalParticles.push(particle);
      scene.add(particle);
    }

    for (let p = 0; p < 10; p++) {
      let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 400 - 200,
        25
      );
      particle.rotation.z = Math.random() * 360;
      particle.material.opacity = 0.6;
      portalParticles.push(particle);
      scene.add(particle);
    }

    window.addEventListener("resize", onWindowResize, false);

    update();
  });
}

function onWindowResize() {
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval = 1 / 30;

function update() {
  requestAnimationFrame(update);
  delta += clock.getDelta();

  if (delta > interval) {
    // The draw or time dependent code are here
    portalParticles.forEach((p) => {
      p.rotation.z -= 0.003 * 1.5;
      p = null;
    });

    renderer.render(scene, cam);

    delta = delta % interval;
  }
}

initScene();
