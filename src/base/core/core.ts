import * as BABYLON from '@babylonjs/core'

import { AppInterface } from '../../decorators/app/app-interface'
import { AppStateConstructor } from '../../decorators/app/app-state/app-state-constructor'
import { SceneInterface } from '../../decorators/scene/scene-interface'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger/logger'
import { LoggerLevels } from '../../modules/logger/logger-levels'
import { LoadingProgress } from '../loading-progress/loading-progress'

export class Core {
  static canvasRect: Rect

  private static app: AppInterface

  // HTML Layers
  private static htmlContainer: HTMLElement
  private static htmlCanvas: HTMLCanvasElement
  private static htmlGui: HTMLDivElement // TODO

  // Babylon
  private static babylon: Pick<BabylonAccessor, 'engine'> = { engine: null as any }

  // Canvas
  private static onCanvasResize: BABYLON.Observable<Rect> = new BABYLON.Observable<Rect>(undefined, true)

  // Loop update
  private static loopUpdateInterval: ReturnType<typeof setInterval>
  private static loopUpdateLastMs: number
  private static loopUpdateMps: number // Number of logical steps per frame
  private static loopUpdateLag: number
  private static loopUpdateDeltaTime: number = 1.0 // Time velocity factor
  private static onLoopUpdate: BABYLON.Observable<number> = new BABYLON.Observable<number>()

  // Render scenes
  private static readonly renderScenes: Set<SceneInterface> = new Set<SceneInterface>()

  // Timeouts // TODO thread here?
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

  // Scene
  // private static loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, SceneFunctionArg>()

  static get canvas(): HTMLCanvasElement { return Core.htmlCanvas }
  static get engine(): BABYLON.Engine { return Core.babylon.engine }

  /**
   * Called once, on app decorator
   * @param app
   */
  static initialize(app: AppInterface) {
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

    if (Core.app.onStart) {
      Core.app.onStart()
    }
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
    BABYLON.SceneLoader.ShowLoadingScreen = false
    Core.babylon.engine = new BABYLON.Engine(
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

  static getApp(): AppInterface {
    return this.app
  }

  static switchAppState(state: AppStateConstructor, setup: any): LoadingProgress {
    return this.app.switchState(state, setup)
  }

  static getActiveScenes(): Set<SceneInterface> {
    return this.renderScenes
  }

  static startRenderScene(scene: SceneInterface): void {
    Core.renderScenes.add(scene)
  }

  static stopRenderScene(scene: SceneInterface): void {
    Core.renderScenes.delete(scene)
  }

  static loopUpdateAddObserver(func: (delta: number) => void): BABYLON.Observer<number> {
    return Core.onLoopUpdate.add(func)
  }

  static loopUpdateRemoveObserver(observer: BABYLON.Observer<number>): void {
    Core.onLoopUpdate.remove(observer)
  }

  static canvasResizeAddObserver(func: (size: Rect) => void): BABYLON.Observer<Rect> {
    return Core.onCanvasResize.add(func)
  }

  static canvasResizeRemoveObserver(observer: BABYLON.Observer<Rect>): void {
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

  static clearAllTimeouts(): void {
    Core.timeouts.clear()
    Core.intervals.clear()
  }

  static getLoopUpdateLastMs() {
    return Core.loopUpdateLastMs
  }

  private static loopUpdate(): void {
    Core.loopUpdateMps = 1000 / Core.app.props.loopUpdate.fps
    Core.loopUpdateLastMs = performance.now()
    Core.loopUpdateLag = 0
    Core.loopUpdateInterval = setInterval(
    // Core.engine.onEndFrameObservable.add(
      () => {
        const currentMs = performance.now()
        Core.loopUpdateLag += currentMs - Core.loopUpdateLastMs
        Core.loopUpdateLastMs = currentMs
        while (Core.loopUpdateLag > Core.loopUpdateMps) {
          Core.onLoopUpdate.notifyObservers(Core.loopUpdateDeltaTime)
          Core.timeouts.forEach(timeout => {
            timeout.ms -= Core.loopUpdateMps
            if (timeout.ms < 0) {
              if (timeout.context) {
                timeout.func.bind(timeout.context)()
              } else {
                timeout.func()
              }
              Core.timeouts.delete(timeout)
            }
          })
          Core.intervals.forEach(interval => {
            interval.ms -= Core.loopUpdateMps
            if (interval.ms < 0) {
              if (interval.context) {
                interval.func.bind(interval.context)
              } else {
                interval.func()
              }
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
