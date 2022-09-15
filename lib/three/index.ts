import { transform } from 'lodash'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { App } from 'vue'
import { lineGenerator, pointGenerator, onMouseClick } from '../tools'

const Three = (app: App) => {
  app.directive('three', {
    created() {},
    mounted(el: HTMLElement, binding: any) {
      //render function
      const render = () => {
        //draw by frame
        requestAnimationFrame(render)
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
      const controls = new OrbitControls(camera, renderer.domElement)
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
        { start: 'M', end: 'E' },
        { start: 'C', end: 'F' },
        { start: 'A', end: 'G' },
        { start: 'N', end: 'H' },
        { start: 'E', end: 'I' },
        { start: 'O', end: 'J' },
        { start: 'A', end: 'K' },
        { start: 'C', end: 'K' },
        { start: 'L', end: 'D' },
        { start: 'R', end: 'A' },
        { start: 'E', end: 'T' },
        { start: 'A', end: 'Q' },
        { start: 'Q', end: 'S' },
        { start: 'O', end: 'N' },
        { start: 'P', end: 'O' },
      ]
      const pointMapAndRelation = { pointsMap, relation }
      //创建小球
      pointGenerator(pointMapAndRelation.pointsMap, scene)
      //创建线
      lineGenerator(pointMapAndRelation, scene)
      //鼠标点击事件
      const onMouseClickListener = (event: MouseEvent) => {
        onMouseClick(event, camera, scene)
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
