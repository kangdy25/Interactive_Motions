import * as THREE from 'three'

import {
  WEBGL
} from './webgl'

if (WEBGL.isWebGLAvailable()) {

  // 장면 추가
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // 카메라 추가
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.x = 0;
  camera.position.y = 2.5;
  camera.position.z = 3;
  camera.lookAt(new THREE.Vector3(0, 0, 0));


  // 렌더러 추가
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 도형 추가
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.rotation.y = 0.5;
  scene.add(cube);

  //바닥 추가
  const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -0.2;
  scene.add(plane);

  // 전역으로 빛 비춰줌
  const ambientLight = new THREE.AmbientLight(0xFFA500, 0.5);
    // scene.add(ambientLight);

  // 특정 방향으로 빛 방출
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(-1, 1, 1);
  const dlhelper = new THREE.DirectionalLightHelper(directionalLight, 0.2, 0x0000ff);
  // scene.add(dlhelper);
  // scene.add(directionalLight);

  // 하늘과 땅 컬러 지정
  const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.3);
  // scene.add(hemisphereLight);

  // 한 방향으로 빛 방출 (예. 전구)
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(1, 1, 1);
  scene.add(pointLight);
  const plhelper = new THREE.PointLightHelper(pointLight, 0.5);
  scene.add(plhelper);

  // 직사각형 빛 방출
  const rectLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
  rectLight.position.set(0.5, 0.5, 1);
  rectLight.lookAt(0, 0, 0);
//   scene.add(rectLight);

  // 직사각형 빛 방출
  const spotLight = new THREE.SpotLight(0xffffff, .5);
  spotLight.position.set(0.5, 0.5, 1);
//   scene.add(spotLight);
//   const slhelper = new THREE.SpotLightHelper(spotLight, 0.5);
//   scene.add(slhelper);


  function render(time) {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);

  // 반응형 처리
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onWindowResize);

} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}