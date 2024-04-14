import '@babylonjs/core/Loading/loadingScreen'
import '@babylonjs/core/Loading/Plugins/babylonFileLoader'
import '@babylonjs/core/Materials/PBR/pbrMaterial'

import { Engine } from '@babylonjs/core/Engines/engine'

import { AppConstructor } from './constructors'
// import { CoreGlobals } from './_OLD-models/core-globals'
// import { CoreProperties } from './_OLD-models/core-properties'
// import { DimensionsWH } from './_OLD-models/dimensions-wh'
// import * as Misc from './misc'
// import { Engine } from './modules/engine/engine'
// import { Scene } from './modules/scene/scene'
import { AppCore } from './decorators/app/app-core'
import { AppInterface } from './decorators/app/app-interface'
import { SceneType } from './decorators/scene/scene-type'
import {
  BabylonAccessor,
  Rect
} from './models'
import { Logger } from './modules/logger/logger'
import { LoggerLevels } from './modules/logger/logger-levels'
import { Timeout } from './types'

// type SceneFunctionArg = (scene: Scene) => void

export class Core {
  private static app: AppInterface & AppCore

  // HTML Layers
  private static htmlContainer: HTMLElement
  private static htmlCanvas: HTMLCanvasElement
  private static htmlGui: HTMLDivElement // 8a8f

  // Babylon
  private static babylon: Pick<BabylonAccessor, 'engine'> = { engine: null }

  // Canvas
  private static canvasRect: Rect

  // Loop update
  private static loopUpdateInterval: Timeout
  private static loopUpdateLastMs: number
  private static loopUpdateMps: number // Number of logical steps per frame
  private static loopUpdateLag: number
  private static loopUpdateDeltaTime: number // Time acceleration factor

  // Render scenes
  private static readonly renderScenes: Set<SceneType> = new Set<SceneType>()

  // ********************************************************

  // Properties
  /** Canvas HTML parent element */
  // static canvasParentHTMLElement?: HTMLElement
  /** FPS container HTML element */
  // static fpsContainer?: string
  /** Loop Update target FPS of the application */
  // static fps: number
  /** Critical error app callback */
  // static onAppError?: (errorMsg: string) => void
  /** Development mode */
  // static isDevelopmentMode?: boolean

  // Engine
  // private static engine: Engine

  // Scene
  // private static loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, SceneFunctionArg>()

  static get canvas(): HTMLCanvasElement { return this.htmlCanvas }
  static get engine(): Engine { return this.babylon.engine }

  /**
   * Called once, on app decorator
   * @param app
   */
  static initialize(app: AppInterface & AppCore) {
    if (Core.app) {
      Logger.error(`App decorator '${Core.app.props.name}' applied more than one time. Please use a single App decorator to generate de application.`)
      return
    }

    Core.app = app
    Logger.info('Environment mode:', process.env.NODE_ENV)
    Logger.level = (Core.app.props.debugLog || this.isDevelopmentMode()) ? LoggerLevels.TRACE : LoggerLevels.INFO
    Logger.debug('App instance created:', Core.app.props)

    // Avoid canvas scale error 8a8f TODO??
    /* setTimeout(
      () => {
      }, 0
    ) */

    this.initializeHTMLLayers()
    this.initializeBabylon()
    this.initializeLoopUpdate()

    Core.updateCanvasRect()

    // Manage resize
    window.addEventListener('resize', () => {
      Core.updateCanvasRect()
      Core.babylon.engine.resize() // TODO: Test this besides 'Core.app.props.engineConfiguration.adaptToDeviceRatio = true'
      // CoreGlobals.canvasResize$.next(canvasDimensions) // 8a8f
    })

    Core.app.onStart()
  }

  static throw(error?: any) {
    const response = error ?? 'Uncaught error'
    Logger.error('Fatal error:', response)
    if (Core.app.onError) {
      Core.app.onError(response)
    }
    Core.close()
  }

  static close(): void {
    if (Core.loopUpdateInterval) {
      clearInterval(Core.loopUpdateInterval)
    }
    if (Core.babylon.engine) {
      Core.babylon.engine.stopRenderLoop()
    }
    if (Core.app.onClose) {
      Core.app.onClose()
    }
    Logger.error('App closed.')
    // TODO 8a8f:
    //  - Stop all listeners (Loop Update, etc)
    //  - Show error page
  }

  static isDevelopmentMode(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  static startRenderScene(scene: SceneType): void {
    Core.renderScenes.add(scene)
  }

  static stopRenderScene(scene: SceneType): void {
    Core.renderScenes.delete(scene)
  }

  private static initializeHTMLLayers(): void {
    const parentId = Core.app.props.htmlCanvasContainerId
    const parentElement = document.getElementById(parentId)
    if (parentElement) {
      Core.htmlContainer = parentElement
      Core.htmlCanvas = document.createElement('canvas')
      Core.htmlCanvas.id = 'khanonjs-canvas'
      Core.htmlContainer.appendChild(Core.htmlCanvas)
    } else {
      Core.throw(`Canvas container id '${parentId}' not found.`)
    }
  }

  private static initializeBabylon(): void {
    Core.babylon.engine = new Engine(
      Core.htmlCanvas,
      Core.app.props.engineConfiguration.antialias,
      Core.app.props.engineConfiguration.options,
      Core.app.props.engineConfiguration.adaptToDeviceRatio
    )
    Core.babylon.engine.runRenderLoop(() => {
      // TODO 8a8f: add render scenes here
      // TODO 8a8f: add FPS updater here

      Core.renderScenes.forEach((scene) => scene.babylon.scene.render())
      /* if (this.properties?.fpsContainer) {
        const divFps = document.getElementById(this.properties.fpsContainer)
        divFps.innerHTML = this.babylon.getFps().toFixed() + ' fps'
      } */
    })
  }

  private static initializeLoopUpdate(): void {
    Core.loopUpdateMps = 1000 / Core.app.props.loopUpdate.fps
    Core.loopUpdateLastMs = performance.now()
    Core.loopUpdateLag = 0
    Core.loopUpdateInterval = setInterval(
      () => {
        const currentMs = performance.now()
        Core.loopUpdateLag += currentMs - Core.loopUpdateLastMs
        while (Core.loopUpdateLag > Core.loopUpdateMps) {
          Core.loopUpdateLastMs = currentMs
          // CoreGlobals.loopUpdate$.next(Core.loopUpdateDeltaTime) // 8a8f
          // CoreGlobals.physicsUpdate$.next(Core.loopUpdateDeltaTime) // 8a8f
          Core.loopUpdateLag -= Core.loopUpdateMps
        }
      },
      0
    )
  }

  private static updateCanvasRect(): void {
    Core.canvasRect = Core.htmlCanvas.getBoundingClientRect() // 8a8f not updating for some reason
    Logger.debug('Canvas size:', Math.floor(Core.canvasRect.width), Math.floor(Core.canvasRect.height))
  }

  /* private static loadSceneQueueNext(sceneLoaded: Scene, onLoaded?: ( scene: Scene) => void): void {
    Core.loadSceneQueue.del(sceneLoaded)
    if (onLoaded) {
      onLoaded(sceneLoaded)
    }
    if (Core.loadSceneQueue.getKeys().length > 0) {
      const nextScene = Core.loadSceneQueue.getPairs()[0]
      setTimeout(() => nextScene.key.load(() => Core.loadSceneQueueNext(nextScene.key, nextScene.value)), 1)
    }
  } */
}
