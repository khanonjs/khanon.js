import * as BABYLON from '@babylonjs/core'

import {
  Asset,
  LoadingProgress
} from '../base'
import { ActorCore } from '../decorators/actor/actor-core'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SpriteCore } from '../decorators/sprite/sprite-core'
import { SpriteInterface } from '../decorators/sprite/sprite-interface'
import { AssetDefinition } from '../models/asset-definition'
import { AssetType } from '../models/asset-type'
import { Logger } from '../modules/logger'
import {
  isPrototypeOf,
  objectToString
} from '../utils/utils'
import { ActorsController } from './actors-controller'
import { SpritesController } from './sprites-controller'

export class AssetsController {
  private static contentTypes = { // TODO is this worth?
    [AssetType.FONT]: ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', ''],
    [AssetType.IMAGE]: ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'],
    [AssetType.MESH]: [''],
    [AssetType.AUDIO]: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm']
  }

  private static assets: Map<string, Asset<SceneInterface>> = new Map<string, Asset<SceneInterface>>()

  static getAsset(url: string): Asset<SceneInterface> | undefined {
    return this.assets.get(url)
  }

  /**
   * Get all assets definitions within a class (Scene, GUI, Actor, Particle, etc..)
   */
  static findAssetsDefinitions(source: any, urls: object = {}): AssetDefinition[] {
    let definitions: AssetDefinition[] = []
    if (typeof source === 'object') {
      for (const property of Object.values(source)) {
        if (Array.isArray(property)) {
          property.forEach(value => {
            if (isPrototypeOf(ActorInterface, value)) {
              const actor = ActorsController.get<ActorCore>(value)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(actor.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(actor.Instance.metadata.getProps(), urls)]
            }
            if (isPrototypeOf(SpriteInterface, value)) {
              const sprite = SpritesController.get<SpriteCore>(value)
              if (sprite.props.url && !urls[sprite.props.url]) {
                urls[sprite.props.url] = true
                definitions = [...definitions, {
                  url: sprite.props.url,
                  type: AssetType.IMAGE,
                  cached: sprite.props.cached
                }]
              }
            }
          })
        }
      }
    }
    return definitions
  }

  static clearCache() {
    // TODO
    AssetsController.assets.clear()
  }

  /**
   * Loads all assets of a Scene
   */
  static sceneLoad(scene: SceneInterface): LoadingProgress {
    const progress = new LoadingProgress()
    if (scene.assets.length === 0) {
      progress.complete()
    } else {
      const progresses = []
      scene.assets.forEach(assetDef => {
        const asset: Asset<SceneInterface> = AssetsController.assets.get(assetDef.url)
        if (asset) {
          asset.addSource(scene, assetDef.cached)
          progresses.push(asset.progress)
        } else {
          progresses.push(AssetsController.loadFileFromUrl(assetDef, scene))
        }
      })
      progress.fromNodes(progresses)
    }
    return progress
  }

  /**
   * Purge loaded assets from a Scene.
   * Non cached and unnecessary assets will be removed.
   */
  static scenePurge(scene: SceneInterface) {
    // scene.assets.
    // TODO
  }

  /**
   * Unload all existing assets of a Scene that are not cached.
   */
  static sceneUnload(scene: SceneInterface) {
    // TODO
  }

  /**
   * Remove non cached assets with no sources
   */
  private purgeAssets() {
    // TODO
  }

  private static loadFileFromUrl(definition: AssetDefinition, source: SceneInterface): LoadingProgress<ArrayBuffer> {
    const asset = new Asset(definition, source)
    AssetsController.assets.set(definition.url, asset)
    let reader: ReadableStreamDefaultReader
    const throwError = (errorMsg: string) => {
      Logger.error(errorMsg)
      asset.progress.error(errorMsg)
      reader?.cancel()
      asset.progress.onError.notifyObservers(errorMsg)
    }
    BABYLON.LoadFile(definition.url,
      (data) => {
        Logger.debug(`LoadFileFromUrl: Loaded '${definition.url}', cached: ${!!definition.cached}`)
        const buffer = data as ArrayBuffer
        if (definition.type === AssetType.IMAGE) {
          asset.setObjectURL(buffer)
        } else {
          asset.setBuffer(buffer)
        }
        asset.progress.complete(buffer)
      },
      (progress) => {
        asset.progress.setProgress(progress.loaded / progress.total)
      },
      undefined,
      true,
      (error) => {
        throwError(`LoadFileFromUrl: Error loading file '${definition.url}': ${objectToString(error)}`)
      }
    )
    return asset.progress
  }
}
