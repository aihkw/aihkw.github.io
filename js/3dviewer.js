import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 8, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);
var spotLight = new THREE.SpotLight(0xffffff, 3, 100, .2, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

var mesh;
var loader = new GLTFLoader().setPath('/3dassets/duck/');
loader.load('scene.gltf', (gltf) => {
  mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
  }
});
  mesh.position.set(0, .5, 0); // duck
  scene.add(mesh);
}, (xhr) => {
  let loaded_progress = xhr.loaded / xhr.total * 100;
}, (error) => {
  console.error(error);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Events
document.querySelector('#select_model').onchange = function (e) {
  let _model_ = document.querySelector('#select_model').value;
  scene.remove(mesh);
  loader = new GLTFLoader().setPath(`/3dassets/${_model_}/`);
  loader.load('scene.gltf', (gltf) => {
    mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

  if (_model_ === 'duck') {
    mesh.position.set(0, .5, 0);
  }
  if (_model_ === 'damaged_helmet') {
    mesh.position.set(0, 1.5, 0);
  }
  if (_model_ === 'millennium_falcon') {
    mesh.position.set(0, 1.05, -1);
  }
  scene.add(mesh);

  }, (xhr) => {
    let loaded_progress = xhr.loaded / xhr.total * 100;
  }, (error) => {
    console.error(error);
  });
}
var controls_pan_checked = false;
document.querySelector('#controls_pan_reset').onclick = function () {
  controls.target = new THREE.Vector3(0, 1, 0);
  camera.position.set(4, 8, 11);
}
var controls_auto_spin = false;
document.querySelector('#controls_auto_spin').onclick = function () {
  controls_auto_spin = !controls_auto_spin;
  controls.autoRotate = controls_auto_spin;
  if (controls_auto_spin) {
    document.querySelector('#controls_auto_spin').innerHTML = '🟢';
  } else {
    document.querySelector('#controls_auto_spin').innerHTML = '🔴';
  }
}
document.querySelector('#spotlight_color').oninput = function () {
  let hex = parseInt(document.querySelector('#spotlight_color').value.replace(/^#/, ''), 16);
  spotLight.color = new THREE.Color(hex);
}
document.querySelector('#spotlight_angle').oninput = function () {
  spotLight.angle = document.querySelector('#spotlight_angle').value/100
}
document.querySelector('#spotlight_intensity').oninput = function() {
  spotLight.intensity = document.querySelector('#spotlight_intensity').value/10
}

let init = setInterval(()=>{
  try {
    let canvas = document.querySelectorAll('canvas')[1];
      canvas.style.cursor = 'grab';
      canvas.addEventListener('mousedown', (a)=>{
        canvas.style.cursor = 'grabbing';
      })
      canvas.addEventListener('mouseup', (a)=>{
        canvas.style.cursor = 'grab';
      })
      document.querySelector('.controller').style.display = 'block';
      clearInterval(init);
  } catch {
    document.querySelector('.controller').style.display = 'none';
  }
}, 100)

document.addEventListener("keydown", function onEvent(event) {
  controls.enablePan = event.shiftKey;
  controls_pan_checked = event.shiftKey;
  if (event.shiftKey) {
    document.querySelector('#controls_pan_status').innerHTML = '✔️';
  }
  
});
document.addEventListener("keyup", function onEvent(event) {
  controls.enablePan = event.shiftKey;
  controls_pan_checked = event.shiftKey;
  if (!event.shiftKey) {
    document.querySelector('#controls_pan_status').innerHTML = '✖️'
  }
});
    
animate();