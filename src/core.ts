import '@babylonjs/core/Loading/loadingScreen'
import '@babylonjs/core/Loading/Plugins/babylonFileLoader'
import '@babylonjs/core/Materials/PBR/pbrMaterial'

import * as Misc from './misc'
import { CoreGlobals } from './models/core-globals'
import { CoreProperties } from './models/core-properties'
import { DimensionsWH } from './models/dimensions-wh'
import { Engine } from './modules/engine/engine'
import { Logger } from './modules/logger/logger'
import { Scene } from './modules/scene/scene'

type SceneFunctionArg = (scene: Scene) => void

export class Core {
  private static properties: CoreProperties

  // Loop update
  private static loopUpdateLastMs: number
  private static loopUpdateFPS: number
  private static loopUpdateLag: number

  // Engine
  private static engine: Engine

  // Scene
  private static loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, SceneFunctionArg>()

  static start(properties: CoreProperties, onReady: () => void) {
    Core.properties = properties
    Core.loopUpdateFPS = 1000 / Core.properties.fps
    CoreGlobals.isDevelopmentMode = !!Core.properties.isDevelopmentMode
    if (Core.properties.onAppError) {
      CoreGlobals.onError$.subscribe({ next: (errorMsg: string) => Core.properties.onAppError(errorMsg) })
    }
    this.createCanvasOnDivElement(Core.properties.canvasParentHTMLElement)

    // Avoid babylonJs canvas scale error with setTimeout(0)
    setTimeout(
      () => {
        Core.engine = new Engine({ fpsContainer: Core.properties.fpsContainer })

        // Start loop update
        Core.loopUpdate()

        // Log info on startup
        // 8a8f mrar esto, las variables de entorno no van así en HTML,
        // ver cómo hacer seteo de esta variable desde la app nodriza
        // eliminar @types/node de packages
        Logger.info('Environment mode:', process.env.NODE_ENV)
        Core.logCanvasSize()

        // Manage resize
        window.addEventListener('resize', () => {
          const canvasDimensions = Core.getCanvasDimensions()
          Core.engine.babylonjs.resize()
          CoreGlobals.canvasDimensions = canvasDimensions
          CoreGlobals.canvasResize$.next(canvasDimensions)
        })

        onReady()
      }, 0
    )
  }

  /**
     * Load scene // 8a8f agregar onProgress
     */
  static loadScene(scene: Scene, onLoaded?: (scene: Scene) => void): Scene {
    Core.engine.registerScene(scene)
    Core.loadSceneQueue.add(scene, onLoaded)
    if (Core.loadSceneQueue.getKeys().length === 1) {
      setTimeout(
        () =>
          scene.load(() => {
            Core.loadSceneQueueNext(scene, onLoaded)
          }),
        1
      )
    }
    return scene
  }

  /**
     * Creates and append canvas to a div element.
     * One canvas per application.
     */
  private static createCanvasOnDivElement(htmlElement: HTMLElement): HTMLCanvasElement {
    if (CoreGlobals.canvas) {
      Logger.error('Not allowed more than one canvas.')
      return
    }
    CoreGlobals.canvas = document.createElement('canvas')
    CoreGlobals.canvas.id = 'canvas'
    htmlElement.appendChild(CoreGlobals.canvas)
    CoreGlobals.canvasDimensions = Core.getCanvasDimensions()
    return CoreGlobals.canvas
  }

  /**
     * Log canvas size { width, height }
     */
  private static logCanvasSize(): void {
    const canvasDimensions = Core.getCanvasDimensions()
    Logger.info('Canvas size:', canvasDimensions.width, canvasDimensions.height)
  }

  /**
     * Canvas width
     * @returns
     */
  private static getCanvasDimensions(): DimensionsWH {
    return { width: Math.floor(CoreGlobals.canvas.getBoundingClientRect().width), height: Math.floor(CoreGlobals.canvas.getBoundingClientRect().height) }
  }

  /**
     * Proccess load scene queue.
     * Queue is needeed since BabylonJs mess up on loading more than one scene simultaneously.
     */
  private static loadSceneQueueNext(sceneLoaded: Scene, onLoaded?: (scene: Scene) => void): void {
    Core.loadSceneQueue.del(sceneLoaded)
    if (onLoaded) {
      onLoaded(sceneLoaded)
    }
    if (Core.loadSceneQueue.getKeys().length > 0) {
      const nextScene = Core.loadSceneQueue.getPairs()[0]
      setTimeout(() => nextScene.key.load(() => Core.loadSceneQueueNext(nextScene.key, nextScene.value)), 1)
    }
  }

  /**
     * Call loop update subscribers.
     * Avoid 'window.requestAnimationFrame' since it doesn't work on tab inactive.
     */
  private static loopUpdate(): void {
    Core.loopUpdateLastMs = performance.now()
    Core.loopUpdateLag = 0
    setInterval(
      () => {
        const currentMs = performance.now()
        Core.loopUpdateLag += currentMs - Core.loopUpdateLastMs
        while (Core.loopUpdateLag > Core.loopUpdateFPS) {
          Core.loopUpdateLastMs = currentMs
          CoreGlobals.loopUpdate$.next()
          CoreGlobals.physicsUpdate$.next()
          Core.loopUpdateLag -= Core.loopUpdateFPS
        }
      },
      0
    )
  }
}
