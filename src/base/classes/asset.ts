import { AssetDefinition } from '../../models'
import { LoadingProgress } from './loading-progress'

export class Asset<S> {
  progress: LoadingProgress<ArrayBuffer> = new LoadingProgress<ArrayBuffer>()

  private sources: Set<S> = new Set<S>()
  private _buffer: ArrayBuffer

  constructor(readonly defitinion: AssetDefinition, readonly source: S) {}

  get buffer(): ArrayBuffer { return this._buffer }

  addSource(source: S, cached: boolean) {
    this.sources.add(source)
    if (cached) {
      this.defitinion.cached = true
    }
  }

  removeSource(source: S) {
    this.sources.delete(source)
  }

  setBuffer(buffer: ArrayBuffer) {
    this._buffer = buffer
  }
}
