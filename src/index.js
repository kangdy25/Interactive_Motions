import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x004fff)

// 카메라 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// 렌더러 추가
const renderer = new THREE.WebGLRenderer({
  alpha : true,
  antialias : true
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// 메쉬 1
const geomertry01 = new THREE.BoxGeometry(1, 1, 1);
const material01 = new THREE.MeshStandardMaterial({
  color:0xffffff
})
const obj01 = new THREE.Mesh(geomertry01, material01);
obj01.position.x = -2
scene.add(obj01);

// 메쉬 2
const geomertry02 = new THREE.ConeGeometry(0.4, 0.8, 7);
const material02 = new THREE.MeshStandardMaterial({
  color:0xffffff
})
const obj02 = new THREE.Mesh(geomertry02, material02);
scene.add(obj02);

// 메쉬 3
const geomertry03 = new THREE.IcosahedronGeometry(0.4, 0)
const material03 = new THREE.MeshStandardMaterial({
  color:0xffffff
})
const obj03 = new THREE.Mesh(geomertry03, material03);
obj03.position.x = 2
scene.add(obj03);

function render(time) {
    time *= 0.0005; 
    // obj01.rotation.x = time;
    obj01.rotation.y = time;

    // obj02.rotation.x = time;
    obj02.rotation.y = time;

    // obj03.rotation.x = time;
    obj03.rotation.y = time;

    renderer.render( scene, camera );
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

// 반응형 처리
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize);

} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}

