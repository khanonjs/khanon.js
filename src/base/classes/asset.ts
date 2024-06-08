import { SceneType } from '../../decorators/scene/scene-type'
import { AssetDefinition } from '../../models'
import { LoadingProgress } from './loading-progress'

type AssetSource = SceneType

export class Asset {
  progress: LoadingProgress<ArrayBuffer> = new LoadingProgress<ArrayBuffer>()

  private sources: Set<AssetSource> = new Set<AssetSource>()
  private _buffer: ArrayBuffer

  constructor(readonly defitinion: AssetDefinition, readonly source: AssetSource) {}

  get buffer(): ArrayBuffer { return this._buffer }

  addSource(source: AssetSource, cached: boolean) {
    this.sources.add(source)
    if (cached) {
      this.defitinion.cached = true
    }
  }

  removeSource(source: AssetSource) {
    this.sources.delete(source)
  }

  setBuffer(buffer: ArrayBuffer) {
    this._buffer = buffer
  }
}