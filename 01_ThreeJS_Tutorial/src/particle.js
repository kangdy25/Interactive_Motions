import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111111)
  scene.fog = new THREE.Fog(0x111111, 1, 8)
  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 2
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
  controls.update()

  // 빛
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // instantiate a loader
  const GLTFloader = new GLTFLoader()
  const GLTFObjGroup = new THREE.Object3D()

  // load a resource
  GLTFloader.load(
    // 경로
    '../static/3d_model/scene.gltf',
    // 소스 불러와지고 나서 실행되는 함수
    function (gltf) {
      const GLTFObj = gltf.scene
      GLTFObj.scale.set(0.02, 0.02, 0.02)
      GLTFObj.position.y = -0.4

      GLTFObjGroup.add(GLTFObj)
      scene.add(GLTFObjGroup)
    },
    // 불러와지는 과정
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // 에러시
    function (error) {
      console.log('An error happened')
    }
  )


  // 파티클
  let particleContainer = new THREE.Object3D()

  for( var i = 1; i< 400; i++ ){

    var particular = new THREE.Mesh(
      new THREE.CircleGeometry(0.01, 3),
      new THREE.MeshToonMaterial({
        color: 0x0066ff,
        side: THREE.DoubleSide
      })
    )
    particular.position.set(mathRandom(3), mathRandom(3), mathRandom(3))
    particular.rotation.set(mathRandom(1), mathRandom(1), mathRandom(1))
    particleContainer.add(particular)

  }
  scene.add(particleContainer)


  // 랜덤 값을 반환하는 함수 정의
  function mathRandom(num = 1) {
    var numValue = -Math.random() * num + Math.random() * num
    return numValue
  }

  // 마우스의 위치 정보를 저장할 벡터 생성
  let mouse = new THREE.Vector2()
  
  // 마우스 이벤트 핸들러
  function onMouseMove(event) {
    event.preventDefault()
    // 마우스의 위치 정보를 -1 ~ 1 범위로 변환하여 mouse 벡터에 저장
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

    console.log(mouse)
  }

  // 마우스 이벤트 리스너 등록
  window.addEventListener('mousemove', onMouseMove, false)


  // 애니메이션 함수
  function animate(currentTime) {
    requestAnimationFrame(animate)
  
    scene.rotation.y += (mouse.x - camera.rotation.y) * 0.05

    // const rotationDelta = (mouse.x - camera.rotation.y) * 0.01

    // if( Math.abs(scene.rotation.y + rotationDelta) < 1.5){
    //   scene.rotation.y += rotationDelta
    // }
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