import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면 추가
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111)

  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.y = 20
  camera.lookAt(0, 0, 0)

  // 렌더러 추가
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // 빛
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  // 값을 구하는 함수
  const radians = degrees => (degrees * Math.PI) / 180;
  const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  const map = (value, start1, stop1, start2, stop2) =>
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;


  // Geometries 클래스
  class Geometries {
    constructor() {
      this.geom = new THREE.BoxBufferGeometry(0.6, 0.6, 0.6)
      this.rotationX = 0
      this.rotationY = 0
      this.rotationZ = 0
    }
  }
  // Geometries 클래스를 상속한 Cube 클래스 정의
  class Cube extends Geometries {
    constructor() {
      super()
      // x축 회전값은 -45도, y축 회전값은 45도로 설정함
      this.rotationX = radians(-45)
      this.rotationY = radians(45)
    }
  }
  class Torus extends Geometries {
    constructor() {
      super()
      this.geom = new THREE.TorusBufferGeometry(0.3, 0.12, 30, 200)
      this.rotationX = radians(90)
    }
  }
  class Cone extends Geometries {
    constructor() {
      super()
      this.geom = new THREE.ConeBufferGeometry(0.4, 1, 30)
      this.rotationX = radians(90)
    }
  }
  class Icosahedron extends Geometries {
    constructor() {
      super()
      this.geom = new THREE.IcosahedronBufferGeometry(0.45)
    }
  }
  class Dodecahedron extends Geometries {
    constructor() {
      super()
      this.geom = new THREE.DodecahedronBufferGeometry(0.5, 0)
    }
  }

  // 레이아웃 정의
  // 도형들 간의 간격
  let gutter = {
    size: 4,
  }
  // 나중에 생성되는 모든 메쉬 오브젝트를 저장하는 배열
  let meshes = []
  // 행과 열의 개수를 지정하며, rows와 cols로 값이 지정
  let grid = {
    rows: 12,
    cols: 6,
  }
  // 다양한 도형 오브젝트를 생성하기 위해 미리 정의한 클래스들을 객체 배열로 저장
  let geometries = [
    new Cube(),
    new Torus(),
    new Icosahedron(),
    new Cone(),
    new Dodecahedron(),
  ]

  // geometries 배열에서 무작위로 하나의 geometry 객체를 선택하여 반환하는 함수
  const getRandomGeometry = () => {
    return geometries[Math.floor(Math.random() * Math.floor(geometries.length))]
  }

  // col이 짝수인지 홀수인지에 따라 해당 열이 가지는 총 행 수를 반환하는 함수
  const getTotalRows = (col) => {
    return col % 2 === 0 ? grid.cols : grid.cols - 1
  }

  // geometry와 material을 인수로 받아 새로운 THREE.Mesh 인스턴스를 생성하고, 그 인스턴스의 castShadow와 receiveShadow 속성을 모두 true로 설정한 뒤 반환하는 함수
  const getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  // 그룹
  const groupMesh = new THREE.Object3D()

  // 질감 관련 배열 : 여러개로 만들수록 다양해집니다.
  const materials = [
    new THREE.MeshPhysicalMaterial({
      color: '#aaa',
      metalness: 0,
      roughness: 0.6,
    }),
    new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0.8,
      roughness: 0.1,
    }),
  ]

  // 이중 반복문에서 첫 번째 루프는 행(row)을 순회합니다.
  for (let row = 0; row < grid.rows; row++) {
    meshes[row] = [] //2차원 배열 meshes에 새로운 빈 배열을 추가합니다. 이 배열은 각 행에 대한 mesh 객체를 저장합니다.

    // 두 번째 루프는 현재 행에 대한 반복 인덱스를 처리합니다.
    for (let index = 0; index < 1; index++) {
      const totalCol = getTotalRows(row) //현재 행의 열 수 반환

      // 3번째 루프는 현재 행의 열(col)을 순회합니다.
      for (let col = 0; col < totalCol; col++) {
        const geometry = getRandomGeometry() // 랜덤으로 지오메트리 가져오는 함수 실행
        const mesh = getMesh(
          geometry.geom,
          materials[Math.floor(Math.random() * materials.length)]
        )

        mesh.position.y = 0
        mesh.position.x = col + col * gutter.size + (totalCol === grid.cols ? 0 : 2.5)
        mesh.position.z = row + row * (index + 0.25)

        mesh.rotation.x = geometry.rotationX
        mesh.rotation.y = geometry.rotationY
        mesh.rotation.z = geometry.rotationZ

        mesh.initialRotation = {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z,
        }

        groupMesh.add(mesh)

        meshes[row][col] = mesh // 생성된 mesh 객체를 meshes 배열에 추가합니다. 이는 나중에 각 mesh의 위치와 회전값을 업데이트하는 데 사용됩니다.
      }
    }
  }

  // 각각의 요소들의 중심점을 구합니다.
  const centerX = -(grid.cols / 2) * gutter.size - 1  // 중심점 x축 계산식
  const centerZ = -(grid.rows / 2) - 0.8 // 중심점 z축 계산식

  // 모든 메쉬 요소들의 위치를 정렬하고, 중심점을 중심으로 이동합니다.
  groupMesh.position.set(centerX, 0, centerZ)

  scene.add(groupMesh)

  // 바닥
  const fgeometry = new THREE.PlaneGeometry(100, 100)
  const fmaterial = new THREE.ShadowMaterial()

  const floor = new THREE.Mesh(fgeometry, fmaterial)
  floor.position.y = -2
  floor.receiveShadow = true
  floor.rotateX(-Math.PI / 2)
  scene.add(floor)

  // 인터렉션
  const raycaster = new THREE.Raycaster()

  const draw = () => {
    raycaster.setFromCamera(mouse, camera) //기준 설정
    let intersects = raycaster.intersectObjects([floor]) // 교차하는지 확인 : 카메라에서 현재 마우스 위치로부터 광선을 쏴서 3D 공간상에 있는 모델들과 교차하는 지점을 찾기
    if (intersects.length) {
      const { x, z } = intersects[0].point //교차점이 있는지 확인

      // 반복문을 통해 각 위치에 있는 
      for (let row = 0; row < grid.rows; row++) {
        for (let index = 0; index < 1; index++) {
          const totalCols = getTotalRows(row)

          for (let col = 0; col < totalCols; col++) {
            const mesh = meshes[row][col]
            mesh.initialRotation.z += radians(0.4)
            mesh.initialRotation.y -= radians(0.1)

            // 마우스와의 거리
            const mouseDistance = distance(
              x,
              z,
              mesh.position.x + groupMesh.position.x,
              mesh.position.z + groupMesh.position.z
            )

            const y = map(mouseDistance, 5, 0, 0, 6)
            // 마우스의 거리에 따라 Y축 높이값 조절 
            TweenMax.to(mesh.position, 0.3, {
              y: y < 1 ? 1 : y,
            })

            const scaleFactor = mesh.position.y / 6
            const scale = scaleFactor < 1 ? 1 : scaleFactor

            // 크기 조절
            TweenMax.to(mesh.scale, 0.3, {
              ease: Expo.easeOut,
              x: scale,
              y: scale,
              z: scale,
            })

            // 회전 시키기
            TweenMax.to(mesh.rotation, 2, {
              ease: Quad.easeOut,
              x: map(
                mesh.position.y,
                -1,
                1,
                radians(45),
                mesh.initialRotation.x
              ),
              z: map(
                mesh.position.y,
                -1,
                1,
                radians(-90),
                mesh.initialRotation.z
              ),
              y: map(
                mesh.position.y,
                -1,
                1,
                radians(45),
                mesh.initialRotation.y
              ),
            })
          }
        }
      }
    }
  }

  // 기준
  let width = window.innerWidth
  let height = window.innerHeight

  // 마우스 3d
  let mouse = new THREE.Vector2()
  const onMouseMove = ({ clientX, clientY }) => {
    mouse.x = (clientX / width) * 2 - 1
    mouse.y = -(clientY / height) * 2 + 1
  }
  onMouseMove({
    clientX: 0,
    clientY: 0,
  })
  // 마우스 무브 함수
  window.addEventListener('mousemove', onMouseMove, false)

  function animate() {
    requestAnimationFrame(animate) 
    draw()
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