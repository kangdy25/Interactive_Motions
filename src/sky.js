import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)
  scene.add(new THREE.AxesHelper(5))

  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    4000
  )
  camera.position.set(0, 20, 100)
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
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // 배열
  const skyMaterialArray = []
  const texture_ft = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_ft.jpg'
    '../static/sky_img/star_ft.jpg'
  )
  const texture_bk = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_bk.jpg'
    '../static/sky_img/star_bk.jpg'

  )
  const texture_up = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_up.jpg'
    '../static/sky_img/star_up.jpg'

  )
  const texture_dn = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_dn.jpg'
    '../static/sky_img/star_dn.jpg'

  )
  const texture_rt = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_rt.jpg'
    '../static/sky_img/star_rt.jpg'

  )
  const texture_lf = new THREE.TextureLoader().load(
    // '../static/sky_img/bay_lf.jpg'
    '../static/sky_img/star_ft.jpg'

  )

  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_ft,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_bk,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_up,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_dn,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_rt,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture_lf,
    })
  )
  // 반복문
  for (let i = 0; i < 6; i++) {
    skyMaterialArray[i].side = THREE.BackSide
  }
  // 메쉬 추가
  const skyGeometry = new THREE.BoxGeometry(2400, 2400, 2400)
  const sky = new THREE.Mesh(skyGeometry, skyMaterialArray)
  scene.add(sky)

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