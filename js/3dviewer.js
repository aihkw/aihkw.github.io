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
var keyboard = {};
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
var default_object_camera_position = {'x': 4, 'y': 8, 'z': 11};
var default_object_camera_target = {'x': 0, 'y': 1, 'z': 0}
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
spotLight.position.set(10, 25, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

var mesh;
var loader = new GLTFLoader().setPath('/3dassets/fumo/');
loader.load('scene.gltf', (gltf) => {
  mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
  }
});
  mesh.position.set(-1.4, 1.6, .7); // fumo
  mesh.rotation.set(0, 90, 0);
  mesh.scale.set(.1, .1, .1);
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
function update_reset() {
  let p = default_object_camera_position;
  let q = default_object_camera_target;
  camera.position.set(p.x, p.y, p.z);
  controls.target = new THREE.Vector3(q.x, q.y, q.z);
}

//
// Events
//
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
  if (_model_ === 'fumo') {
    mesh.position.set(-1.4, 1.7, .7); // fumo
    mesh.rotation.set(0, 90, 0);
    mesh.scale.set(.1, .1, .1);
  }
  if (_model_ === 'duck') {
    mesh.position.set(0, .5, 0);
    default_object_camera_position = {'x': 4, 'y': 8, 'z': 11};
    default_object_camera_target = {'x': 0, 'y': 1, 'z': 0};
  }
  if (_model_ === 'damaged_helmet') {
    mesh.position.set(0, 1.6, 0);
    default_object_camera_position = {'x': 4, 'y': 8, 'z': 11};
    default_object_camera_target = {'x': 0, 'y': 1, 'z': 0};
  }
  if (_model_ === 'millennium_falcon') {
    mesh.position.set(0, 1.05, -1);
    default_object_camera_position = {'x': 4, 'y': 8, 'z': 11};
    default_object_camera_target = {'x': 0, 'y': 1, 'z': 0};
  }
  if (_model_ === 'antique_camera') {
    mesh.position.set(0, 0, 0);
    default_object_camera_position = {'x': 4, 'y': 12, 'z': 11};
    default_object_camera_target = {'x': 0, 'y': 5, 'z': 0};
  }
  if (_model_ === 'wave') {
    mesh.position.set(0, 2, -.3);
    mesh.scale.set(.1, .1, .1);
    default_object_camera_position = {'x': 4, 'y': 8, 'z': 11};
    default_object_camera_target = {'x': 0, 'y': 1.8, 'z': 0};
  }
  update_reset();
  scene.add(mesh);

  }, (xhr) => {
    let loaded_progress = xhr.loaded / xhr.total * 100;
  }, (error) => {
    console.error(error);
  });
}
var controls_pan_checked = false;
document.querySelector('#controls_pan_reset').onclick = function () {
  update_reset();
}
var controls_auto_spin = true;
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
document.querySelector('#spotlight_color_reset').onclick = function () {
  spotLight.color = new THREE.Color(16777215);
  document.querySelector('#spotlight_color').value = '#ffffff';
}
document.querySelector('#spotlight_angle').oninput = function () {
  spotLight.angle = document.querySelector('#spotlight_angle').value/100;
}
document.querySelector('#spotlight_angle_reset').onclick = function () {
  spotLight.angle = .2;
  document.querySelector('#spotlight_angle').value = 20;
}
document.querySelector('#spotlight_intensity').oninput = function() {
  spotLight.intensity = document.querySelector('#spotlight_intensity').value/10
}
document.querySelector('#spotlight_intensity_reset').onclick = function() {
  spotLight.intensity = 3;
  document.querySelector('#spotlight_intensity').value = 30;
}
document.querySelector('#spotlight_position_x').oninput = function() {
  let x = document.querySelector('#spotlight_position_x').value;
  let z = document.querySelector('#spotlight_position_z').value;
  spotLight.position.set(x, 25, z);
}
document.querySelector('#spotlight_position_x_reset').onclick = function() {
  document.querySelector('#spotlight_position_x').value = 10;
  let x = document.querySelector('#spotlight_position_x').value;
  let z = document.querySelector('#spotlight_position_z').value;
  spotLight.position.set(x, 25, z);
}
document.querySelector('#spotlight_position_z').oninput = function() {
  let x = document.querySelector('#spotlight_position_x').value;
  let z = document.querySelector('#spotlight_position_z').value;
  spotLight.position.set(x, 25, z);
}
document.querySelector('#spotlight_position_z_reset').onclick = function() {
  document.querySelector('#spotlight_position_z').value = 10;
  let x = document.querySelector('#spotlight_position_x').value;
  let z = document.querySelector('#spotlight_position_z').value;
  spotLight.position.set(x, 25, z);
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
      window.addEventListener('keydown', function(event) {
        keyboard[event.key] = true;
      });
      window.addEventListener('keyup', function(event) {
        keyboard[event.key] = false;
      });
    
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
var cameraPosition = camera.position;
var cameraRotation = camera.rotation;
function handleKeyboardInput(delta) {
  if (keyboard['W']) {
    cameraPosition.z -= moveSpeed * delta;
  }
  if (keyboard['S']) {
    cameraPosition.z += moveSpeed * delta;
  }
  if (keyboard['A']) {
    cameraRotation.y += rotateSpeed * delta;
  }
  if (keyboard['D']) {
    cameraRotation.y -= rotateSpeed * delta;
  }
  camera.position.copy(cameraPosition);
  camera.rotation.setFromVector3(cameraRotation);
}

var settings_vis = true;
var spacing = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
document.querySelector('#settings').onclick = function () {
  if (settings_vis) {
    document.querySelector('.controller').classList.add('controller-hidden');
    document.querySelector('#settings').innerHTML = `Settings${spacing}>`;
    document.querySelector('#settings').classList.remove('controller-shown');
  } else {
    document.querySelector('.controller').classList.remove('controller-hidden');
    document.querySelector('#settings').innerHTML = `<`;
    document.querySelector('#settings').classList.add('controller-shown');
  }
  settings_vis = !settings_vis;
}

animate();