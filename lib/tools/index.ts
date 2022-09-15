import _ from 'lodash'
import { TOOLS } from '../tools/tools'
import * as THREE from 'three'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
function myTypeof(data: any) {
  var toString = Object.prototype.toString
  var dataType =
    data instanceof Element
      ? 'element'
      : toString
          .call(data)
          .replace(/\[object\s(.+)\]/, '$1')
          .toLowerCase()
  return dataType
}

const myDebounce = (func: (...arg: any) => any, waitConfig?: number | string | null) => {
  if (myTypeof(waitConfig) === 'string') {
    waitConfig = parseInt(waitConfig as string)
  }
  return _.debounce(func, waitConfig ? (waitConfig as number) : 300, { leading: true, trailing: false })
}

//检查两点是否会重合，retrun boolean
const isSame = (
  point1: { x: number; y: number; z: number },
  point2: { x: number; y: number; z: number },
  radius: number,
) => {
  return (
    Math.sqrt(
      Math.pow(Math.abs(point1.x - point2.x), 2) +
        Math.pow(Math.abs(point1.y - point2.y), 2) +
        Math.pow(Math.abs(point1.z - point2.z), 2),
    ) >
    radius * 3
  )
}

//画球
const pointGenerator = (pointsMap: TOOLS.pointMap, scene: THREE.Scene) => {
  const isNumber = (data: any) => {
    return myTypeof(data) === 'number'
  }
  const isXYZ = pointsMap.every((item) => {
    return isNumber(item.x) && isNumber(item.y) && isNumber(item.z)
  })
  const randomPlusOrSubtraction = (num: number) => {
    return Math.random() > 0.5 ? (num += 8) : (num -= 8)
  }
  if (!isXYZ) {
    const geometry = new THREE.SphereGeometry(30, 100, 100)
    random(geometry.attributes.position.array, pointsMap)
  } else {
    //遍历循环pointMap，检查是否有重合的点，有则使用算法避免
    for (let i = 0; i < pointsMap.length; i++) {
      for (let j = i + 1; j < pointsMap.length; j++) {
        if (!isSame(pointsMap[i] as Required<TOOLS.pointMapItem>, pointsMap[j] as Required<TOOLS.pointMapItem>, 2)) {
          ;((pointsMap[j].x as number) = randomPlusOrSubtraction(pointsMap[j].x as number)),
            ((pointsMap[j].y as number) = randomPlusOrSubtraction(pointsMap[j].y as number)),
            ((pointsMap[j].z as number) = randomPlusOrSubtraction(pointsMap[j].z as number))
        }
      }
    }
  }

  pointsMap.forEach((item) => {
    const sphereGeometry = new THREE.SphereGeometry(2, 20, 20)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: '#2A0944',
    })
    const ball = new THREE.Mesh(sphereGeometry, sphereMaterial)
    ball.position.set(item.x as number, item.y as number, item.z as number)
    scene.add(ball)
  })
}

//画线
const lineGenerator = (
  pointMapAndRelation: {
    pointsMap: TOOLS.pointMap
    relation: { start: string; end: string }[]
  },
  scene: THREE.Scene,
) => {
  pointMapAndRelation.relation.forEach((item) => {
    let pointArr: number[] = []
    const startPoint = pointMapAndRelation.pointsMap.find((point) => point.name === item.start)
    pointArr.push(startPoint?.x as number, startPoint?.y as number, startPoint?.z as number)
    const endPoint = pointMapAndRelation.pointsMap.find((point) => point.name === item.end)
    pointArr.push(endPoint?.x as number, endPoint?.y as number, endPoint?.z as number)
    const geometry = new LineGeometry()
    geometry.setPositions(pointArr)
    const material1 = new LineMaterial({
      color: 0x554994,
      linewidth: 3,
    })
    material1.resolution.set(window.innerWidth, window.innerHeight)
    const line = new Line2(geometry, material1)
    line.computeLineDistances()
    scene.add(line)
  })
}

//传入父球根据父球顶点随机发布小球
const random = (array: ArrayLike<number>, pointsMap: TOOLS.pointMap) => {
  pointsMap.forEach((item) => {
    const num = Math.floor(Math.random() * 10201)
    const arr = Array.from(array)
    const point = arr.slice(num, num + 3)
    ;(item.x = point[0]), (item.y = point[1]), (item.z = point[2])
  })
  //遍历循环pointMap，检查是否有重合的点，有则重新生成,直到没有重合的点
  for (let i = 0; i < pointsMap.length; i++) {
    for (let j = i + 1; j < pointsMap.length; j++) {
      if (!isSame(pointsMap[i] as Required<TOOLS.pointMapItem>, pointsMap[j] as Required<TOOLS.pointMapItem>, 2)) {
        random(array, pointsMap)
      }
    }
  }
}

//点击事件
function onMouseClick(event: MouseEvent, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
  raycaster.setFromCamera(mouse, camera)
  // 获取raycaster直线和所有模型相交的数组集合
  const intersects = raycaster.intersectObjects(scene.children)
  //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
  if (intersects.length > 0) {
    // @ts-ignore
    intersects[0].object.material.color.set(0xf675a8)
  }
}
export { myTypeof, myDebounce, pointGenerator, lineGenerator, onMouseClick }
