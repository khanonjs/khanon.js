import { LoadingProgress } from '../base'
import {
  ActorConstructor,
  SceneConstructor
} from '../constructors'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { ActorType } from '../decorators/actor/actor-type'
import { Actor2DInterface } from '../decorators/actor/actor2d/actor2d-interface'
import { Actor2DType } from '../decorators/actor/actor2d/actor2d-type'
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

interface CachedFileContent {
  assetDefinition: AssetDefinition
  sources: SceneType[]
  buffer: ArrayBuffer
}

export class AssetsController {
  private static contentTypes = {
    [AssetType.FONT]: ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', ''], // 8a8f
    [AssetType.IMAGE]: ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'], // 8a8f
    [AssetType.MESH]: [''], // 8a8f
    [AssetType.AUDIO]: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm'] // 8a8f
  }

  private static cachedFiles: Map<string, CachedFileContent> = new Map<string, CachedFileContent>()

  static getBuffer(url: string): ArrayBuffer {
    // 8a8f
    return new Uint8Array()
  }

  /**
   * Gets all asset definitions within a class (Scene, GUI, Actor, Particle, etc..)
   */
  static getAssetDefinitionsFromObject(item: any, urls: object = {}): AssetDefinition[] {
    let definitions: AssetDefinition[] = []
    if (typeof item === 'object') {
      for (const property of Object.values(item)) {
        if (Array.isArray(property)) {
          property.forEach(value => {
            if (isPrototypeOf(ActorInterface, value)) {
              const actor = ActorsController.get<Actor2DType>(value)
              definitions = [...definitions, ...AssetsController.getAssetDefinitionsFromObject(actor.props, urls)]
            }
            if (isPrototypeOf(SpriteInterface, value)) {
              const sprite = SpritesController.get<SpriteType>(value)
              if (sprite.props.url && !urls[sprite.props.url]) {
                urls[sprite.props.url] = true
                definitions = [...definitions, {
                  url: sprite.props.url,
                  type: AssetType.IMAGE
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
    AssetsController.cachedFiles.clear()
  }

  static sceneLoad(scene: SceneType): LoadingProgress<void> {
    // 8a8f
    // Load scene assets
    const assets = this.getAssetDefinitionsFromObject(scene.props)
    console.log('aki ASSETS DEFINITION', assets)

    return new LoadingProgress()
  }

  static scenePurge(scene: SceneType) {
    // 8a8f
    // Purge scene assets that are not needed after scene load
  }

  static sceneUnload(scene: SceneType) {
    // 8a8f
    // Remove scene assets that are not cached
  }

  // 8a8f varios actores diferentes pueden cargar el mismo sprite, el cual a su vez carga el mismo archivo.
  // Para eliminar un archivo tras hacer unload, es necesario conocer tu fuente (actor, etc)
  private static loadFileFromUrl(url: string, source: SceneType, cached?: boolean, enforceType?: AssetType): LoadingProgress<ArrayBuffer> {
    const progress = new LoadingProgress<ArrayBuffer>()
    const data: CachedFileContent = AssetsController.cachedFiles.get(url)
    if (data) {
      Logger.debug(`getFileFromUrl: '${url}' loaded from cache.`)
      progress.complete(data.buffer)
      return progress
    } else {
      let reader: ReadableStreamDefaultReader
      const throwError = (errorMsg: string) => {
        Logger.error(errorMsg)
        progress.error(errorMsg)
        reader?.cancel()
        progress.onError.notifyObservers(errorMsg)
      }
      fetch(url)
        .then((response) => {
          reader = response.body.getReader()
          const contentType = response.headers.get('Content-Type')
          const contentLength = +response.headers.get('Content-Length')
          const parts = []
          let receivedLength = 0

          if (enforceType && !AssetsController.contentTypes[enforceType].find(type => type === contentType)) {
            throwError(`getFileFromUrl error: content type '${contentType}' doesn't satisfy the enforced type '${[enforceType]}'`)
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
                  data.buffer = allParts.buffer.slice(allParts.byteOffset, allParts.byteLength + allParts.byteOffset)
                  if (cached) {
                    AssetsController.cachedFiles.set(url, data)
                  }
                  Logger.debug(`getFileFromUrl: '${url}' loaded from url, cached: ${!!cached}`)
                  progress.complete(data.buffer)
                } else if (result.value.length) {
                  parts.push(result.value)
                  receivedLength += result.value.length
                  progress.setProgress(receivedLength / contentLength)
                  next()
                } else {
                  throwError(`getFileFromUrl error: undefined value reading url '${url}'`)
                }
              })
              .catch(error => throwError(`getFileFromUrl error reading part: ${objectToString(error)}`))
          }
          next()
        })
        .catch(error => throwError(`getFileFromUrl error fetching: ${objectToString(error)}`))
      return progress
    }
  }
}
