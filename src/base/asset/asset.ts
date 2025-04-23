import * as BABYLON from '@babylonjs/core'

import { Logger } from '../../modules/logger'
import { LoadingProgress } from '../loading-progress/loading-progress'
import { AssetDefinition } from './asset-definition'

export class Asset</* Source interface */ S = any, /* Definition data */ D = any> {
  progress: LoadingProgress = new LoadingProgress()

  private sources: Set<S> = new Set<S>()
  private _buffer: ArrayBuffer
  private _audioBuffer: BABYLON.StaticSoundBuffer
  private _objectURL: string
  private _serial: string
  private _file: File

  constructor(readonly definition: AssetDefinition<D, any>, readonly source: S) {}

  get buffer(): ArrayBuffer {
    if (!this._buffer) { Logger.debugError(`Asset Error: No Buffer for asset '${this.definition.url}', did you mean other type?`) }
    return this._buffer
  }

  get audioBuffer(): BABYLON.StaticSoundBuffer {
    if (!this._audioBuffer) { Logger.debugError(`Asset Error: No Audio Buffer for asset '${this.definition.url}', did you mean other type?`) }
    return this._audioBuffer
  }

  get objectURL(): string {
    if (!this._objectURL) { Logger.debugError(`Asset Error: No objectURL for asset '${this.definition.url}', did you mean other type?`) }
    return this._objectURL
  }

  get serial(): string {
    if (!this._serial) { Logger.debugError(`Asset Error: No serial for asset '${this.definition.url}', did you mean other type?`) }
    return this._serial
  }

  get file(): File {
    if (!this._file) { Logger.debugError(`Asset Error: No file for asset '${this.definition.url}', did you mean other type?`) }
    return this._file
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

  setAudioBuffer(audioBuffer: BABYLON.StaticSoundBuffer) {
    this._audioBuffer = audioBuffer
  }

  setObjectURL(buffer: ArrayBuffer) {
    this._objectURL = URL.createObjectURL(new Blob([buffer]))
  }

  setSerial(serial: string) {
    this._serial = serial
  }

  setFile(buffer: ArrayBuffer, fileName: string) {
    this._file = new File([buffer], fileName)
  }
}
