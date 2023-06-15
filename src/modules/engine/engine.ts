import { Engine as BabylonJsEngine } from '@babylonjs/core/Engines/engine'

import * as Misc from '../../misc'
import { CoreGlobals } from '../../models/core-globals'
import { Scene } from '../scene/scene'
import { EngineProperties } from './engine-properties'

export class Engine {
  readonly babylonjs: BabylonJsEngine

  private readonly scenes: Misc.KeyValue<string, Scene> = new Misc.KeyValue<string, Scene>()
  private readonly renderScenes: Misc.KeyValue<string, Scene> = new Misc.KeyValue<string, Scene>()

  constructor(private readonly properties?: EngineProperties) {
    this.babylonjs = new BabylonJsEngine(CoreGlobals.canvas, true)
    this.renderLoop()
  }

  registerScene(scene: Scene): void {
    scene.setEngineParams(
      this.babylonjs,
      (id: string) => this.startRenderScene(id),
      (id: string) => this.stopRenderScene(id)
    )
    this.scenes.add(scene.id, scene)
  }

  startRenderScene(sceneId: string): void {
    const scene = this.scenes.get(sceneId)
    this.renderScenes.add(scene.id, scene)
  }

  stopRenderScene(sceneId: string): void {
    this.renderScenes.del(sceneId)
  }

  renderLoop(): void {
    this.babylonjs.runRenderLoop(() => {
      this.renderScenes.getValues().forEach((scene) => scene.babylonjs.render())
      if (this.properties?.fpsContainer) {
        const divFps = document.getElementById(this.properties.fpsContainer)
        divFps.innerHTML = this.babylonjs.getFps().toFixed() + ' fps'
      }
    })
  }
}
