import { objectToString } from '../helpers/utils'
import {
  AssetType,
  LoadingProgress
} from '../models'
import { Logger } from '../modules'

export class AssetsController {
  private static contentTypes = {
    [AssetType.FONT]: ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', ''], // 8a8f
    [AssetType.IMAGE]: ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'], // 8a8f
    [AssetType.MESH]: [''], // 8a8f
    [AssetType.AUDIO]: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm'] // 8a8f
  }

  private static cachedFiles: Map<string, ArrayBuffer> = new Map<string, ArrayBuffer>()

  static getFileFromUrl(url: string, cached?: boolean, enforceType?: AssetType): LoadingProgress<ArrayBuffer> {
    const progress = new LoadingProgress<ArrayBuffer>()
    let data: ArrayBuffer = AssetsController.cachedFiles.get(url)
    if (data) {
      Logger.debug(`getFileFromUrl: '${url}' loaded from cache.`)
      progress.complete(data)
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
                  data = allParts.buffer.slice(allParts.byteOffset, allParts.byteLength + allParts.byteOffset)
                  if (cached) {
                    AssetsController.cachedFiles.set(url, data)
                  }
                  Logger.debug(`getFileFromUrl: '${url}' loaded from url, cached: ${!!cached}`)
                  progress.complete(data)
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

  static clearCache() {
    AssetsController.cachedFiles.clear()
  }
}
