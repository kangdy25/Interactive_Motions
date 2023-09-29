import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111111)
  scene.add(new THREE.AxesHelper(5)) // 중심점 표현

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
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // 각도 제한
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, -0.2)
  controls.update()

  // RGBE Loader
  var loader = new RGBELoader()
  loader.setDataType(THREE.UnsignedByteType)
  loader.load('../static/shanghai_bund_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping

    // scene.background = texture
    scene.environment = texture
  })

  // 텍스처 추가
  const textureLoader = new THREE.TextureLoader()
  const textureBaseColor = textureLoader.load(
    '../static/textures/rock_diff.jpg'
  )
  const textureNormalMap = textureLoader.load(
    '../static/textures/rock_nor_gl.jpg'
  )
  const textureHeightMap = textureLoader.load(
    '../static/textures/rock_disp.png'
  )
  const textureRoughnessMap = textureLoader.load(
    '../static/textures/rock_rough.jpg'
  )

  // 도형 추가
  const geometry = new THREE.IcosahedronGeometry(1, 0)
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textureBaseColor,
    normalMap: textureNormalMap,
    displacementMap: textureHeightMap,
    displacementScale: 0.002,
    roughnessMap: textureRoughnessMap,
    roughness: 0.9,
    metalness: 0.1,
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  // 빛
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(-1, 1, 0)
  scene.add(directionalLight)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight2.position.set(1, 0.5, 1)
  scene.add(directionalLight2)

  function animate() {
    requestAnimationFrame(animate) //인자로 받은 함수 animate를 반복 실행

    cube.rotation.y += 0.004
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