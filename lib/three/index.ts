import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { App } from 'vue'
import { controlCamera, get2DPosition, lineGenerator, onMouseClick, pointGenerator } from '../tools/relythree'
import { TOOLS } from '../tools/tools'

const Three = (app: App) => {
  app.directive('three', {
    created() {},
    mounted(el: HTMLElement, binding: any) {
      //render function
      const render = () => {
        //draw by frame
        requestAnimationFrame(render)
        controls.update()
        renderer.render(scene, camera)
      }
      //scene
      const scene = new THREE.Scene()
      //camera
      const camera = new THREE.PerspectiveCamera(1000, 1, 0.1, 1000)
      camera.position.set(0, 0, 0)
      //renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(el.offsetWidth, el.offsetHeight)
      el.appendChild(renderer.domElement)
      //coordinate
      const coordinate = new THREE.AxesHelper(100)
      //add coordinate
      scene.add(coordinate)
      //create controls

      const controls = controlCamera(camera, renderer)
      controls.target.set(0, 0, 0)

      const ambientLight = new THREE.AmbientLight(0xffffff)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(2, 2, -3)
      directionalLight.position.normalize()
      scene.add(directionalLight)
      const pointsMap = [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' },
        { name: 'G' },
        { name: 'H' },
        { name: 'I' },
        { name: 'J' },
        { name: 'K' },
        { name: 'L' },
        { name: 'M' },
        { name: 'N' },
        { name: 'O' },
        { name: 'P' },
        { name: 'Q' },
        { name: 'R' },
        { name: 'S' },
        { name: 'T' },
      ]

      const relation = [
        { start: 'A', end: 'B' },
        { start: 'A', end: 'C' },
        { start: 'A', end: 'D' },
        { start: 'A', end: 'E' },
        { start: 'A', end: 'F' },
        { start: 'A', end: 'G' },
        { start: 'A', end: 'H' },
        { start: 'A', end: 'I' },
        { start: 'A', end: 'J' },
        { start: 'A', end: 'K' },
        { start: 'Q', end: 'L' },
        { start: 'Q', end: 'M' },
        { start: 'Q', end: 'N' },
        { start: 'Q', end: 'O' },
        { start: 'Q', end: 'P' },
        { start: 'Q', end: 'R' },
        { start: 'O', end: 'S' },
        { start: 'Q', end: 'T' },
      ]
      let pointMapAndRelation: TOOLS.pointMapAndRelation = { pointsMap, relation }
      //创建小球
      //更新经过处理的小球信息
      let { pointMapAndRelation: newPointMapAndRelation, moveBallArr } = pointGenerator(
        pointMapAndRelation,
        scene,
        camera,
        renderer,
        controls,
      )
      //创建线
      let lineArr = lineGenerator(newPointMapAndRelation, scene)
      let name: string
      //拖动小球的事件将在这里处理
      const dragControls = new DragControls(moveBallArr, camera, renderer.domElement)
      dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false
      })
      dragControls.addEventListener('drag', function (event) {
        newPointMapAndRelation.pointsMap.forEach((newPointMapAndRelationItem) => {
          if (newPointMapAndRelationItem.name === event.object.name) {
            newPointMapAndRelationItem.x = event.object.position.x
            newPointMapAndRelationItem.y = event.object.position.y
            newPointMapAndRelationItem.z = event.object.position.z
            name = newPointMapAndRelationItem.name
            lineArr.forEach((lineItem) => {
              lineItem.geometry.dispose()
            })
            scene.remove(...lineArr)
          }
        })
        lineArr = lineGenerator(newPointMapAndRelation, scene)
      })
      dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true
      })
      //鼠标移入节点时获取节点的2D坐标
      dragControls.addEventListener('hoveron', function (event) {
        const positionTwoD = get2DPosition(event.object.position, renderer, camera)
        console.log(positionTwoD)
      })

      //鼠标点击事件
      const onMouseClickListener = (event: MouseEvent) => {
        onMouseClick(event, camera, scene, el, newPointMapAndRelation)
      }
      //向el添加鼠标点击事件
      el.addEventListener('click', onMouseClickListener, false)

      render()
    },
  })
}
export default {
  install: Three,
}
