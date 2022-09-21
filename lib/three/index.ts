import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { App } from 'vue'
import { addMove, controlCamera, lineGenerator, onMouseClick, pointGenerator } from '../tools/relythree'
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
      camera.position.set(0, 50, 0)
      //renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(el.offsetWidth, el.offsetHeight)
      el.appendChild(renderer.domElement)
      //coordinate
      // const coordinate = new THREE.AxesHelper(100)
      //add coordinate
      // scene.add(coordinate)
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
        { start: 'E', end: 'I' },
        { start: 'E', end: 'J' },
        { start: 'E', end: 'K' },
        { start: 'E', end: 'L' },
        { start: 'A', end: 'M' },
        { start: 'E', end: 'N' },
        { start: 'A', end: 'O' },
        { start: 'E', end: 'P' },
        { start: 'E', end: 'Q' },
        { start: 'E', end: 'R' },
        { start: 'E', end: 'S' },
        { start: 'E', end: 'T' },
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
      //拖动小球
      addMove(
        moveBallArr,
        camera,
        renderer,
        controls,
        newPointMapAndRelation as {
          pointsMap: Required<TOOLS.pointMapItem>[]
          relation: { start: string; end: string }[]
        },
        lineArr,
        scene,
      )

      //鼠标点击事件
      const onMouseClickListener = (event: MouseEvent) => {
        onMouseClick(event, camera, scene, el, newPointMapAndRelation)
      }
      //向window添加鼠标点击事件
      window.addEventListener('click', onMouseClickListener, false)

      render()
    },
  })
}
export default {
  install: Three,
}
