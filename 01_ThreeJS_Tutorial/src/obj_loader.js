import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111111)

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

  // 컨트롤
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.update()


  // OBJ Loader
  const OBJloader = new OBJLoader() // MTLLoader에서 로드한 materials 파일을 설정합니다.
  let ObjGroup = new THREE.Object3D()


  // MTL Loader
  const mtlLoader = new MTLLoader()

  mtlLoader.load('../static/3d_model/charizar-export.mtl', (mtl) => {
    mtl.preload()
    OBJloader.setMaterials(mtl)
    OBJloader.load(
      // 에셋 URL
      '../static/3d_model/charizar-export.obj',
      function (object) {
        ObjGroup.add(object)
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
  

  // 빛
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(-2, 2, 0)
  scene.add(directionalLight)

  function animate() {
    requestAnimationFrame(animate) //인자로 받은 함수 animate를 반복 실행

    const time = Date.now() * 0.0005
    directionalLight.position.x = Math.sin(time * 0.7) * 10
    directionalLight.position.z = Math.abs(Math.cos(time * 0.7)) * 10
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