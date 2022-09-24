import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { App, DirectiveBinding } from 'vue'
import { controlCamera, get2DPosition, lineGenerator, nodeInfo, onMouseClick, pointGenerator } from '../tools/relythree'
import { TOOLS } from '../tools/tools'

const Three = (app: App) => {
  app.directive('three', {
    created() {},
    mounted(el: HTMLElement, binding: DirectiveBinding<TOOLS.pointMapAndRelation>) {
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

      //创建小球
      //更新经过处理的小球信息
      let { pointMapAndRelation: newPointMapAndRelation, moveBallArr } = pointGenerator(
        binding.value,
        scene,
        camera,
        renderer,
        controls,
      )
      //创建线
      let lineArr = lineGenerator(newPointMapAndRelation, scene)
      let name: string
      let nodeTip: Node | null = null
      let nodeTipStyle: CSSStyleDeclaration | null = null
      //拖动小球的事件将在这里处理
      const dragControls = new DragControls(moveBallArr, camera, renderer.domElement)
      dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false
      })
      //鼠标拖动小球移动时
      dragControls.addEventListener('drag', function (event) {
        //处理小球移动时的线
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
        //处理小球移动时的提示信息要追随小球移动
        if (nodeTip && nodeTipStyle) {
          const { x, y } = get2DPosition(el, event, camera, scene)
          nodeTipStyle.left = x + 'px'
          nodeTipStyle.top = y + 20 + 'px'
        }
      })
      dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true
      })
      //鼠标移入节点时获取节点
      dragControls.addEventListener('hoveron', function (event) {
        const { div, style } = nodeInfo(
          get2DPosition(el, event, camera, scene),
          newPointMapAndRelation.pointsMap.filter((item) => item.name === event.object.name)[0].message as string,
        )
        nodeTipStyle = style
        nodeTip = el.appendChild(div)
      })
      //鼠标移出节点时删除节点
      dragControls.addEventListener('hoveroff', function (event) {
        Array.from(el.getElementsByClassName('nodeInfo')).forEach((item) => {
          el.removeChild(item)
        })
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
