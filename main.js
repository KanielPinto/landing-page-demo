import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

var scene,
  sceneLight,
  portalLight,
  cam,
  renderer,
  portalLightDistance = 900,
  portalParticles = [];
   
const canvas = document.getElementById("main-container");
function getWidth() {
  return parseInt(window.getComputedStyle(canvas).width);
}

function getHeight() {
  if (getWidth() < 770) {
    return parseInt(window.getComputedStyle(canvas).height) - 20;
  } else {
    return parseInt(window.getComputedStyle(canvas).height);
  }
}

function getPixelFactor() {
  if (getWidth() < 770) {
    return 1.7;
  } else {
    return 0.69;
  }
}

function initScene() {
  scene = new THREE.Scene();

  sceneLight = new THREE.DirectionalLight(0x241b50, 0.5);
  sceneLight.position.set(0, 0, 1);
  scene.add(sceneLight);

  //#30D5C8

  portalLight = new THREE.PointLight(0x61479c, 35, portalLightDistance, 4);
  portalLight.position.set(0, 0, 250);
  scene.add(portalLight);

  cam = new THREE.PerspectiveCamera(160, getWidth() / getHeight(), 1, 1000);
  cam.position.z = 117;
  cam.position.x = -35;
  cam.aspect = getWidth() / getHeight();
  scene.add(cam);

  renderer = new THREE.WebGLRenderer("high-performance");
  renderer.setClearColor(0x0e0b1e, 1);
  renderer.setSize(getWidth(), getHeight());
  renderer.setPixelRatio(window.devicePixelRatio - getPixelFactor());
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

    for (let p = 618; p > 250; p--) {
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
    window.addEventListener("orientationchange", onWindowResize, false);

    update();
  });
}

function onWindowResize() {
  cam.aspect = getWidth() / getHeight();
  cam.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio - getPixelFactor());

  renderer.setSize(getWidth(), getHeight());
}

let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval1 = 1 / 30;

function update() {
  requestAnimationFrame(update);
  delta += clock.getDelta();

  if (delta > interval1) {
    // The draw or time dependent code are here
    portalParticles.forEach((p) => {
      p.rotation.z -= 0.003 * 2;
    });

    renderer.render(scene, cam);

    delta = delta % interval1;
  }
}

initScene();
