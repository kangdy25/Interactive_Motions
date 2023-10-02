import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 3
  camera.lookAt(0, 0, 0)

  // 렌더러 추가
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // 카메라 이후에 등장필요
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.update()

 // 직사각형 빛 방출
 const rectLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
 rectLight.position.set(0.5, 0.5, 1);
 rectLight.lookAt(0, 0, 0);
 scene.add(rectLight);
  // 빛
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight2.position.set(0.5, 2, 1)
  scene.add(directionalLight2)

  // 전역으로 빛 비춰줌
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);


  const OBJloader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  const ObjGroup = new THREE.Group()
  mtlLoader.load('../static/3d_model/Passport.mtl', (mtl) => {
    mtl.preload()
    OBJloader.setMaterials(mtl)

    // obj 파일 로드
    OBJloader.load('../static/3d_model/Passport.obj', (object) =>{
      ObjGroup.add(object)
      ObjGroup.position.y = -0.8;
      scene.add(ObjGroup)
      },
      function (xhr) {
        const progress = (xhr.loaded / xhr.total) * 100 + '%'
        console.log(progress)
      },
      function (error) {
        console.log('An error happened')
      }
    )
  })

  const raycaster = new THREE.Raycaster();

  renderer.domElement.addEventListener('mousemove', onMouseMove)

  function onMouseMove(e){
    const mouse = {
      x : (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y : -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
    }
    // console.log(mouse.x, mouse.y);

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true);

    if(intersects.length > 0){
      console.log('마우스 인');
      // 마우스 인

      TweenMax.to(ObjGroup.rotation, 1, {
        y: Math.PI * 2,
      })

      TweenMax.to(ObjGroup.scale, 1, {
        x: 1.5,
        y: 1.5,
        z: 1.5
      })

    } else {
      console.log('마우스 아웃');
      // 마우스 아웃
      TweenMax.to(ObjGroup.rotation, 1, {
        y: 0
      })

      TweenMax.to(ObjGroup.scale, 1, {
        x: 1,
        y: 1,
        z: 1
      })
    }
  }

  function animate() {
    requestAnimationFrame(animate) //인자로 받은 함수 animate를 반복 실행
    renderer.render(scene, camera)
  }
  animate()

  // 반응형 처리
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}