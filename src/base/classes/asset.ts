import { AssetDefinition } from '../../models'
import { Logger } from '../../modules'
import { LoadingProgress } from './loading-progress'

export class Asset<S> {
  progress: LoadingProgress<ArrayBuffer> = new LoadingProgress<ArrayBuffer>()

  private sources: Set<S> = new Set<S>()
  private _buffer: ArrayBuffer
  private _objectURL: string

  constructor(readonly definition: AssetDefinition, readonly source: S) {}

  get buffer(): ArrayBuffer {
    Logger.debugError(`Asset Error: No Buffer for asset '${this.definition.url}', did you mean objectURL?`)
    return this._buffer
  }

  get objectURL(): string {
    Logger.debugError(`Asset Error: No objectURL for asset '${this.definition.url}', did you mean Buffer?`)
    return this._objectURL
  }

  addSource(source: S, cached: boolean) {
    this.sources.add(source)
    if (cached) {
      this.definition.cached = true
    }
  }

  removeSource(source: S) {
    this.sources.delete(source)
  }

  setBuffer(buffer: ArrayBuffer) {
    this._buffer = buffer
  }

  setObjectURL(buffer: ArrayBuffer) {
    this._objectURL = URL.createObjectURL(new Blob([buffer]))
  }
}
