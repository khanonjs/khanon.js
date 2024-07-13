import '@babylonjs/core/Loading/loadingScreen'
import '@babylonjs/core/Loading/Plugins/babylonFileLoader'
import '@babylonjs/core/Materials/PBR/pbrMaterial'

import {
  Observable,
  Observer
} from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine'

import { AppCore } from './decorators/app/app-core'
import { AppInterface } from './decorators/app/app-interface'
import { SceneType } from './decorators/scene/scene-type'
import {
  BabylonAccessor,
  Rect
} from './models'
import { Timeout } from './models/timeout'
import { Arrays } from './modules/helper/arrays'
import { Helper } from './modules/helper/helper'
import { Logger } from './modules/logger/logger'
import { LoggerLevels } from './modules/logger/logger-levels'
import { TimeoutType } from './types'

// type SceneFunctionArg = (scene: Scene) => void

export class Core {
  static canvasRect: Rect

  private static app: AppInterface & AppCore

  // HTML Layers
  private static htmlContainer: HTMLElement
  private static htmlCanvas: HTMLCanvasElement
  private static htmlGui: HTMLDivElement // TODO

  // Babylon
  private static babylon: Pick<BabylonAccessor, 'engine'> = { engine: null }

  // Canvas
  private static onCanvasResize: Observable<Rect> = new Observable<Rect>(undefined, true)

  // Loop update
  private static loopUpdateInterval: TimeoutType
  private static loopUpdateLastMs: number
  private static loopUpdateMps: number // Number of logical steps per frame
  private static loopUpdateLag: number
  private static loopUpdateDeltaTime: number = 1.0 // Time acceleration factor
  private static onLoopUpdate: Observable<number> = new Observable<number>()

  // Render scenes
  private static readonly renderScenes: Set<SceneType> = new Set<SceneType>()

  // Timeouts
  private static timeouts: Set<Timeout> = new Set<Timeout>()
  private static intervals: Set<Timeout> = new Set<Timeout>()

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

  static get canvas(): HTMLCanvasElement { return Core.htmlCanvas }
  static get engine(): Engine { return Core.babylon.engine }

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
    Logger.level = (Core.app.props.debugLog || Core.isDevelopmentMode()) ? LoggerLevels.TRACE : LoggerLevels.INFO
    Logger.debug('App instance created:', Core.app.props)

    // Avoid canvas scale error TODO??
    /* setTimeout(
      () => {
      }, 0
    ) */

    Core.initializeHTMLLayers()
    Core.initializeBabylon()
    Core.loopUpdate()

    Core.updateCanvasSize()
    Logger.debug('Initial canvas size:', Core.canvasRect.width, Core.canvasRect.height)

    // Manage canvas resize
    window.addEventListener('resize', () => {
      Core.updateCanvasSize()
      Core.babylon.engine.resize() // TODO: Test this besides 'Core.app.props.engineConfiguration.adaptToDeviceRatio = true'
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
    // TODO:
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

  static addLoopUpdateObserver(func: (delta: number) => void): Observer<number> {
    return Core.onLoopUpdate.add(func)
  }

  static removeLoopUpdateObserver(observer: Observer<number>): void {
    Core.onLoopUpdate.remove(observer)
  }

  static addCanvasResizeObserver(func: (size: Rect) => void): Observer<Rect> {
    return Core.onCanvasResize.add(func)
  }

  static removeCanvasResizeObserver(observer: Observer<Rect>): void {
    Core.onCanvasResize.remove(observer)
  }

  static setTimeout(func: () => void, ms: number, context?: any): Timeout {
    const timeout = { func, oms: ms, ms, context }
    Core.timeouts.add(timeout)
    return timeout
  }

  static setInterval(func: () => void, ms: number, context?: any): Timeout {
    const timeout = { func, oms: ms, ms, context }
    Core.intervals.add(timeout)
    return timeout
  }

  static clearTimeout(timeout: Timeout): void {
    Core.timeouts.delete(timeout)
  }

  static clearInterval(timeout: Timeout): void {
    Core.intervals.delete(timeout)
  }

  private static initializeHTMLLayers(): void {
    const parentId = Core.app.props.htmlCanvasContainerId
    const parentElement = document.getElementById(parentId)
    if (parentElement) {
      Core.htmlContainer = parentElement
      Core.htmlCanvas = document.createElement('canvas')
      Core.htmlCanvas.id = 'khanonjs-canvas'
      Core.htmlCanvas.style.width = '100%'
      Core.htmlCanvas.style.height = '100%'
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
      Core.renderScenes.forEach((scene) => scene.babylon.scene.render())

      // TODO: add FPS updater here
      /* if (Core.properties?.fpsContainer) {
        const divFps = document.getElementById(Core.properties.fpsContainer)
        divFps.innerHTML = Core.babylon.getFps().toFixed() + ' fps'
      } */
    })
  }

  private static loopUpdate(): void {
    Core.loopUpdateMps = 1000 / Core.app.props.loopUpdate.fps
    Core.loopUpdateLastMs = performance.now()
    Core.loopUpdateLag = 0
    Core.loopUpdateInterval = setInterval(
      () => {
        const currentMs = performance.now()
        Core.loopUpdateLag += currentMs - Core.loopUpdateLastMs
        Core.loopUpdateLastMs = currentMs
        while (Core.loopUpdateLag > Core.loopUpdateMps) {
          Core.onLoopUpdate.notifyObservers(Core.loopUpdateDeltaTime)
          Core.timeouts.forEach(timeout => {
            timeout.ms -= Core.loopUpdateMps
            if (timeout.ms < 0) {
              timeout.func.bind(timeout.context)
              Core.timeouts.delete(timeout)
            }
          })
          Core.intervals.forEach(interval => {
            interval.ms -= Core.loopUpdateMps
            if (interval.ms < 0) {
              interval.func.bind(interval.context)
              interval.ms = interval.oms + interval.ms
            }
          })
          Core.loopUpdateLag -= Core.loopUpdateMps
        }
      },
      0
    )
  }

  private static updateCanvasSize(): void {
    const boundingRect = Core.htmlCanvas.getBoundingClientRect()
    Core.canvasRect = {
      x: 0,
      y: 0,
      width: Math.floor(boundingRect.width),
      height: Math.floor(boundingRect.height)
    }
    Core.onCanvasResize.notifyObservers(Core.canvasRect)
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
