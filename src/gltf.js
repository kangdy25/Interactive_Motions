import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111111)
  // scene.add(new THREE.AxesHelper(5)) // 중심점 표현

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
  renderer.shadowMap.enabled = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  // 컨트롤
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // 각도 제한
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, -0.2)
  controls.update()

  // 텍스처 추가
  const textureLoader = new THREE.TextureLoader()
  const textureBaseColor = textureLoader.load(
    '../static/textures/rock_diff.jpg'
  )
  const textureNormalMap = textureLoader.load(
    '../static/textures/rock_nor_gl.exr'
  )
  const textureHeightMap = textureLoader.load(
    '../static/textures/rock_disp.png'
  )
  const textureRoughnessMap = textureLoader.load(
    '../static/textures/rock_rough.exr'
  )

  // RGBE Loader
  var loader = new RGBELoader()
  loader.setDataType(THREE.UnsignedByteType)
  loader.load('../static/shanghai_bund_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping

    scene.background = texture //배경
    scene.environment = texture //텍스처
  })

  //바닥 추가
  const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1)
  const planeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.y = -0.5
  scene.add(plane)
  plane.receiveShadow = true

  // 빛
  const ambientLight = new THREE.AmbientLight(0x004fff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(-1, 3, 0.5)
  scene.add(directionalLight)
  directionalLight.castShadow = true

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight2.position.set(0.5, 2.5, 1)
  scene.add(directionalLight2)
  directionalLight2.castShadow = true

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