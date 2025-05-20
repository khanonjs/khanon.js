// KJS-39 on bundle optiomization. eliminar todos los .d de los archivos compilados que no se quieren al hacer build, mover los tipos e interfaces de ./models a KJS namespace

import * as BABYLON from '@babylonjs/core'

import { AppInterface } from '../../decorators/app/app-interface'
import { AppStateConstructor } from '../../decorators/app/app-state/app-state-constructor'
import { SceneInterface } from '../../decorators/scene/scene-interface'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger/logger'
import { LoggerLevels } from '../../modules/logger/logger-levels'
import { objectToString } from '../../utils/utils'
import { LoadingProgress } from '../loading-progress/loading-progress'

export class Core {
  static canvasRect: Rect
  static needAudioEngine = false

  private static app: AppInterface

  // HTML Layers
  private static htmlContainer: HTMLElement
  private static htmlCanvas: HTMLCanvasElement

  // Babylon
  private static babylon: Pick<BabylonAccessor, 'engine' | 'audioEngine'> = { engine: null as any, audioEngine: null as any }

  // Canvas
  private static onCanvasResize: BABYLON.Observable<Rect> = new BABYLON.Observable<Rect>(undefined, true)

  // Loop update
  private static loopUpdateLastMs: number
  private static loopUpdateMps: number // Number of logical steps per frame
  private static loopUpdateLag: number
  private static loopUpdateDeltaTime: number = 1.0 // Time velocity factor
  private static onLoopUpdate: BABYLON.Observable<number> = new BABYLON.Observable<number>()

  // Render scenes
  private static readonly renderScenes: Set<SceneInterface> = new Set<SceneInterface>()

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

  // Scene
  // private static loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, SceneFunctionArg>()

  static get canvas(): HTMLCanvasElement { return Core.htmlCanvas }
  static get engine(): BABYLON.Engine { return Core.babylon.engine }
  static get audioEngine(): BABYLON.AudioEngineV2 { return Core.babylon.audioEngine }

  /**
   * Called once, on app decorator
   * @param app
   */
  static initialize(app: AppInterface): void {
    if (Core.app) {
      Logger.error(`App decorator '${Core.app._props.name}' applied more than one time. Please use a single App decorator to generate de application.`)
      return
    }

    Core.app = app
    Logger.info('Environment mode:', process.env.NODE_ENV)
    Logger.level = (Core.app._props.debugLog || Core.isDevelopmentMode()) ? LoggerLevels.TRACE : LoggerLevels.INFO
    Logger.debug('App instance created:', Core.app._props)

    // esBuild hot realoading in dev mode
    if (process.env.NODE_ENV === 'development') {
      const eventSource = new EventSource('/esbuild')
      eventSource.addEventListener('change', () => location.reload())
    }

    Core.initializeHTMLLayers()
    Core.initializeBabylon()
      .then(() => {
        Core.loopUpdate()
        Core.updateCanvasSize()
        Logger.debug('Initial canvas size:', Core.canvasRect.width, Core.canvasRect.height)

        // Manage canvas resize
        window.addEventListener('resize', () => {
          Core.updateCanvasSize()
          Core.babylon.engine.resize()
        })

        if (Core.app.onStart) {
          Core.app.onStart()
        }
      })
      .catch((error) => {
        Core.throw(`Error initializing Babylon: ${objectToString(error)}`)
      })
  }

  private static initializeHTMLLayers(): void {
    const parentId = Core.app._props.htmlCanvasContainerId
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

  private static initializeBabylon(): Promise<void> {
    return new Promise((resolve, reject) => {
      BABYLON.SceneLoaderFlags.ShowLoadingScreen = false
      Core.babylon.engine = new BABYLON.Engine(
        Core.htmlCanvas,
        Core.app._props.engineConfiguration.antialias,
        Core.app._props.engineConfiguration.options,
        Core.app._props.engineConfiguration.adaptToDeviceRatio
      )
      Core.babylon.engine.runRenderLoop(() => {
        Core.renderScenes.forEach((scene) => scene.babylon.scene.render())
      })
      if (Core.needAudioEngine) {
        Core.needAudioEngine = true
        Logger.debug('Creating audio engine...')
        BABYLON.CreateAudioEngineAsync({
          disableDefaultUI: Core.app._props.audioEngine.disableDefaultUI,
          resumeOnInteraction: Core.app._props.audioEngine.resumeOnInteraction,
          resumeOnPause: Core.app._props.audioEngine.resumeOnPause,
          resumeOnPauseRetryInterval: Core.app._props.audioEngine.resumeOnPauseRetryInterval
        })
          .then((audioEngine) => {
            this.babylon.audioEngine = audioEngine
            Logger.debug('Audio engine created. Tap the screen to start the scene!')
            this.babylon.audioEngine.unlockAsync()
              .then(() => {
                Logger.debug('Audio engine unlocked.')
                resolve()
              })
              .catch((error) => {
                Logger.error('Unlocking audio engine error.')
                reject(error)
              })
          })
          .catch((error) => {
            Logger.error('Creating audio engine error.')
            reject(error)
          })
      } else {
        resolve()
      }
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
    this.clearAllTimeouts()
    this.renderScenes.forEach((scene) => {
      scene.stop()
    })
    Core.engine.onBeginFrameObservable.clear()
    if (Core.babylon.engine) {
      Core.babylon.engine.stopRenderLoop()
    }
    if (Core.app.onClose) {
      Core.app.onClose()
    }
    Logger.error('App closed.')
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

  static setTimeout(func: () => void, ms: number, context: any): Timeout {
    const timeout = { func, oms: ms, ms, context }
    Core.timeouts.add(timeout)
    return timeout
  }

  static setInterval(func: () => void, ms: number, context: any): Timeout {
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

  static clearAllTimeoutsByContext(context: any): void {
    Core.timeouts.forEach(timeout => {
      if (timeout.context === context) {
        Core.clearTimeout(timeout)
      }
    })
    Core.intervals.forEach(interval => {
      if (interval.context === context) {
        Core.clearInterval(interval)
      }
    })
  }

  static getLoopUpdateLastMs() {
    return Core.loopUpdateLastMs
  }

  private static loopUpdate(): void {
    Core.loopUpdateMps = 1000 / Core.app._props.loopUpdate.fps
    Core.loopUpdateLastMs = performance.now()
    Core.loopUpdateLag = 0
    Core.engine.onBeginFrameObservable.add(
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
                interval.func.bind(interval.context)()
              } else {
                interval.func()
              }
              interval.ms = interval.oms + interval.ms
            }
          })
          Core.loopUpdateLag -= Core.loopUpdateMps
        }
      })
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
