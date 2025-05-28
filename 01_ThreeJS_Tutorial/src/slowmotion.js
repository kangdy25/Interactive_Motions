import * as THREE from 'three'

import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)
  scene.fog = new THREE.Fog(0x333333, 0, 4)
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0.02, 1);
  camera.lookAt(0, 0, 0)

  // 렌더러 추가
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // 빛
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // 바닥 그리드
  const gridHelper = new THREE.GridHelper(5, 120, 0x004fff, 0x004fff)
  scene.add(gridHelper)

  let lines = []
  // 라인 생성
  function createLines() {

    const tl = new TimelineMax()
    const lineMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.005, 0.005),
      new THREE.MeshToonMaterial({
        color: 0x00afff,
      })
    )
    lineMesh.position.x = mathRandom(3) // x축 랜덤
    lineMesh.position.z = -4
    lineMesh.position.y = Math.abs(mathRandom(2)) // 높이값 랜덤
    lineMesh.rotation.y = (90 * Math.PI) / 180 // 회전


    scene.add(lineMesh)

    tl.add(
      TweenMax.to(lineMesh.position, 2, {
        z: 4,
        repeat: -1,
        delay: mathRandom(5),
        ease: Power1.easeInOut,
      })
    )

    // 새로운 라인에 대한 Timeline 객체와 라인 메시의 변수를 저장
    lines.push({
      tl: tl,
      lineMesh: lineMesh
    })

  }
  // 라인 여러개 추가
  for (let i = 0; i < 150; i++) {
    createLines()
  }

  // 랜덤 함수
  function mathRandom(num = 1) {
    var numValue = -Math.random() * num + Math.random() * num
    return numValue
  }


  // 마우스 다운 이벤트
  addEventListener('mousedown', (event) => {
    TweenMax.to(camera.position, 1, {
      x: 2,
      y: 0.2,
      z: 0,
      ease: Power1.easeInOut,
    })
    TweenMax.to(camera.rotation, 1, {
      y: Math.PI / 2,
      ease: Power1.easeInOut,
    })

    // line 속도 줄이기
    lines.forEach((line) => {
      line.tl.timeScale(0.1)
    })
  })
  // 마우스 업 이벤트
  addEventListener('mouseup', (event) => {
    TweenMax.to(camera.position, 1, {
      x: 0,
      y: 0.02,
      z: 1,
      ease: Power1.easeInOut,
    })
    TweenMax.to(camera.rotation, 1, {
      y: 0,
      ease: Power1.easeInOut,
    })
     // 새로운 라인에 대한 Timeline 객체와 라인 메시의 변수를 참조하여 속도를 줄임
     lines.forEach((line) => {
      line.tl.timeScale(1)
    })
  })



  // 마우스 위치에 따라 회전
  let mouse = new THREE.Vector2()
  function onMouseMove(event) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
  window.addEventListener('mousemove', onMouseMove, false)

  // 애니메이션
  function animate() {
    requestAnimationFrame(animate)
    scene.rotation.x -= (-mouse.y - camera.rotation.x) * 0.002
    scene.rotation.y -= (mouse.x - camera.rotation.y) * 0.002

    // 위아래 회전 제한
    if (scene.rotation.x < -0.4) {
      scene.rotation.x = -0.4
    } else if (scene.rotation.x > 0.8) {
      scene.rotation.x = 0.8
    }

    // 좌우 회전 제한
    if (scene.rotation.y < -0.8) {
      scene.rotation.y = -0.8 //우측
    } else if (scene.rotation.y > 0.8) {
      scene.rotation.y = 0.8 //좌측
    }
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