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

  // 빛
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 2, 12);
  scene.add(pointLight);

  // 메쉬 1
  const geomertry01 = new THREE.BoxGeometry(1, 1, 1);
  const material01 = new THREE.MeshStandardMaterial({
    color:0xffaa00,
    // wireframe : true,
    roughness: 0.4,
    // metalness: 1,
  })
  const obj01 = new THREE.Mesh(geomertry01, material01);
  obj01.position.x = -2
  scene.add(obj01);

  // 메쉬 2
  const geomertry02 = new THREE.ConeGeometry(0.4, 0.8, 7);
  const material02 = new THREE.MeshLambertMaterial({
    color:0xffaaff,
    shininess : 130,
    specular : 0x004fff
  })
  const obj02 = new THREE.Mesh(geomertry02, material02);
  scene.add(obj02);

  // 메쉬 3
  const geomertry03 = new THREE.IcosahedronGeometry(0.4, 0)
  const material03 = new THREE.MeshPhongMaterial({
    color:0x00aa00,
    shininess : 130,
    specular : 0xffe2ae,
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

