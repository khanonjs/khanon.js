import {
  Asset,
  LoadingProgress
} from '../base'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { Actor2DCore } from '../decorators/actor/actor2d/actor2d-core'
import { SceneType } from '../decorators/scene/scene-type'
import { SpriteInterface } from '../decorators/sprite/sprite-interface'
import { SpriteType } from '../decorators/sprite/sprite-type'
import {
  isPrototypeOf,
  objectToString
} from '../helpers/utils'
import {
  AssetDefinition,
  AssetType
} from '../models'
import { Logger } from '../modules'
import { ActorsController } from './actors-controller'
import { SpritesController } from './sprites-controller'

export class AssetsController {
  private static contentTypes = {
    [AssetType.FONT]: ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', ''], // 8a8f
    [AssetType.IMAGE]: ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'], // 8a8f
    [AssetType.MESH]: [''], // 8a8f
    [AssetType.AUDIO]: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm'] // 8a8f
  }

  private static assets: Map<string, Asset> = new Map<string, Asset>()

  static getAsset(url: string): Asset | undefined {
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
              const actor = ActorsController.get<Actor2DCore>(value)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(actor.props, urls)]
            }
            if (isPrototypeOf(SpriteInterface, value)) {
              const sprite = SpritesController.get<SpriteType>(value, false)
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
    // 8a8f
    AssetsController.assets.clear()
  }

  /**
   * Loads all assets from a Scene
   */
  static sceneLoad(scene: SceneType): LoadingProgress {
    const progress = new LoadingProgress()
    if (scene.assets.length === 0) {
      progress.complete()
    } else {
      const progresses = []
      scene.assets.forEach(assetDef => {
        progresses.push(AssetsController.loadFileFromUrl(assetDef, scene))
      })
      progress.fromNodes(progresses)
    }
    return progress
  }

  /**
   * Purge loaded assets from a Scene.
   * Non cached and unnecessary assets will be removed.
   */
  static scenePurge(scene: SceneType) {
    // scene.assets.
    // 8a8f
  }

  /**
   * Unload all existing assets of a Scene that are not cached.
   */
  static sceneUnload(scene: SceneType) {
    // 8a8f
  }

  /**
   * Remove non cached assets with no sources
   */
  private purgeAssets() {
    // 8a8f
  }

  private static loadFileFromUrl(definition: AssetDefinition, source: SceneType): LoadingProgress<ArrayBuffer> {
    let asset: Asset = AssetsController.assets.get(definition.url)
    if (asset) {
      asset.addSource(source, definition.cached)
      return asset.progress
    } else {
      asset = new Asset(definition, source)
      AssetsController.assets.set(definition.url, asset)
      let reader: ReadableStreamDefaultReader
      const throwError = (errorMsg: string) => {
        Logger.error(errorMsg)
        asset.progress.error(errorMsg)
        reader?.cancel()
        asset.progress.onError.notifyObservers(errorMsg)
      }
      fetch(definition.url)
        .then((response) => {
          reader = response.body.getReader()
          const contentType = response.headers.get('Content-Type')
          const contentLength = +response.headers.get('Content-Length')
          const parts = []
          let receivedLength = 0

          if (!AssetsController.contentTypes[definition.type].find(type => type === contentType)) {
            throwError(`getFileFromUrl error: content type '${contentType}' doesn't satisfy the type '${[definition.type]}'`)
            return
          }

          const next = () => {
            reader.read()
              .then((result) => {
                if (result.done) {
                  const allParts = new Uint8Array(receivedLength)
                  let position = 0
                  for (const part of parts) {
                    allParts.set(part, position)
                    position += part.length
                  }
                  asset.setBuffer(allParts.buffer.slice(allParts.byteOffset, allParts.byteLength + allParts.byteOffset))
                  Logger.debug(`getFileFromUrl: '${definition.url}' loaded from url, cached: ${!!definition.cached}`)
                  asset.progress.complete(asset.buffer)
                } else if (result.value.length) {
                  parts.push(result.value)
                  receivedLength += result.value.length
                  asset.progress.setProgress(receivedLength / contentLength)
                  next()
                } else {
                  throwError(`getFileFromUrl error: undefined value reading url '${definition.url}'`)
                }
              })
              .catch(error => throwError(`getFileFromUrl error reading part: ${objectToString(error)}`))
          }
          next()
        })
        .catch(error => throwError(`getFileFromUrl error fetching: ${objectToString(error)}`))
      return asset.progress
    }
  }
}
