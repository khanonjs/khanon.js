import { objectToString } from '../helpers/utils'
import {
  AssetType,
  CachedUrlFile,
  LoadingProgress
} from '../models'
import { Logger } from '../modules'

export class AssetsController {
  private cachedFiles: CachedUrlFile[]

  static getUrl(url: string, cached?: boolean, enforceType?: AssetType): LoadingProgress {
    Logger.debug(`getUrl: '${url}', cached: ${!!cached}`)
    const progress = new LoadingProgress()
    let reader: ReadableStreamDefaultReader
    function throwError(errorMsg: string) {
      Logger.error(errorMsg)
      reader?.cancel()
      progress.onError.notifyObservers(errorMsg)
    }

    function done() {
      progress.complete()
    }
    // 8a8f Headers
    fetch(url)
      .then((response) => {
        reader = response.body.getReader()
        const contentType = response.headers.get('Content-Type')
        const contentLength = +response.headers.get('Content-Length')
        const parts = []
        let currentLength = 0

        if (!AssetsController.enforceType(enforceType, contentType)) {
          throwError(`getUrl error: content type '${contentType}' doesn't satisfy the enforced type '${[enforceType]}'`)
          return
        }

        function next() {
          reader.read()
            .then((result) => {
              if (result.done) {
                // 8a8f
                done()
              } else if (result.value.length) {
                parts.push(result.value)
                currentLength += result.value.length
                progress.setProgress(currentLength / contentLength)
                next()
              } else {
                throwError(`getUrl error: undefined value reading url '${url}'`)
              }
            })
            .catch(error => throwError(`getUrl error reading part: ${objectToString(error)}`))
        }
        next()
      })
      .catch(error => throwError(`getUrl error fetching: ${objectToString(error)}`))
    return progress
  }

  private static enforceType(enforceType: AssetType | undefined, contentType: string): boolean {
    return true
  }
}
