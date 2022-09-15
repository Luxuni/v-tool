import * as THREE from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { myTypeof } from '.'
import { TOOLS } from '../tools/tools'

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

//画球,在这里已经处理好了小球的位置信息，返回处理好的小球信息 return pointsMap
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
      color: 0x2a0944,
    })
    const ball = new THREE.Mesh(sphereGeometry, sphereMaterial)
    ball.name = item.name
    ball.position.set(item.x as number, item.y as number, item.z as number)
    scene.add(ball)
  })
  return pointsMap
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
      color: 0x80558c,
      linewidth: 3,
    })
    material1.resolution.set(window.innerWidth, window.innerHeight)
    const line = new Line2(geometry, material1)
    line.name = item.start + item.end
    line.computeLineDistances()
    scene.add(line)
  })
}

//传入父球根据父球顶点随机分配小球位置
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
const onMouseClick = (
  event: MouseEvent,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  el: HTMLElement,
  pointMapAndRelation: TOOLS.pointMapAndRelation,
) => {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
  mouse.x = (event.clientX / el.clientWidth) * 2 - 1
  mouse.y = -(event.clientY / el.clientHeight) * 2 + 1
  // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
  raycaster.setFromCamera(mouse, camera)
  // 获取raycaster直线和所有模型相交的数组集合
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0) {
    //@ts-ignore
    intersects[0].object.material.color.set(0xf675a8)
    //查找所有与点击球相连的球
    const relationMap = pointMapAndRelation.relation.filter((item) => {
      return item.start === intersects[0].object.name || item.end === intersects[0].object.name
    })
    scene.children.forEach((item) => {
      if (item instanceof THREE.Mesh) {
        if (pointMapAndRelation.pointsMap.find((point) => point.name === item.name)) {
          item.material.color.set(0x2a0944)
        } else if (pointMapAndRelation.relation.find((line) => line.start + line.end === item.name)) {
          item.material.color.set(0x80558c)
        }
      }
    })
    relationMap.forEach((relationMapItem) => {
      scene.children.forEach((sceneItem) => {
        if (
          sceneItem.name === relationMapItem.end ||
          sceneItem.name === relationMapItem.start + relationMapItem.end ||
          sceneItem.name === relationMapItem.start
        ) {
          //@ts-ignore
          sceneItem.material.color.set(0xf675a8)
        }
      })
    })
  }
}
export { isSame, pointGenerator, lineGenerator, onMouseClick }
