import * as BABYLON from '@babylonjs/core'

import { Logger } from '../../modules/logger'
import { LoadingProgress } from '../loading-progress/loading-progress'
import { AssetDefinition } from './asset-definition'

export class Asset</* Source interface */ S = any, /* Definition data */ D = any> {
  progress: LoadingProgress = new LoadingProgress()

  private sources: Set<S> = new Set<S>()
  private _buffer: ArrayBuffer | undefined
  private _audioBuffer: BABYLON.StaticSoundBuffer | undefined
  private _objectURL: string | undefined
  private _serial: string | undefined
  private _file: File | undefined

  constructor(readonly definition: AssetDefinition<D, any>, readonly source: S) {}

  get buffer(): ArrayBuffer {
    if (!this._buffer) {
      Logger.error(`Asset Error: No Buffer for asset '${this.definition.url}', did you mean other type?`)
      return null as any
    } else {
      return this._buffer
    }
  }

  get audioBuffer(): BABYLON.StaticSoundBuffer {
    if (!this._audioBuffer) {
      Logger.error(`Asset Error: No Audio Buffer for asset '${this.definition.url}', did you mean other type?`)
      return null as any
    } else {
      return this._audioBuffer
    }
  }

  get objectURL(): string {
    if (!this._objectURL) {
      Logger.error(`Asset Error: No objectURL for asset '${this.definition.url}', did you mean other type?`)
      return null as any
    } else {
      return this._objectURL
    }
  }

  get serial(): string {
    if (!this._serial) {
      Logger.error(`Asset Error: No serial for asset '${this.definition.url}', did you mean other type?`)
      return null as any
    } else {
      return this._serial
    }
  }

  get file(): File {
    if (!this._file) {
      Logger.error(`Asset Error: No file for asset '${this.definition.url}', did you mean other type?`)
      return null as any
    } else {
      return this._file
    }
  }

  remove() {
    if (this._buffer) {
      this._buffer = undefined
    }
    if (this._audioBuffer) {
      this._audioBuffer = undefined
    }
    if (this._objectURL) {
      URL.revokeObjectURL(this._objectURL)
      this._objectURL = undefined
    }
    if (this._serial) {
      this._serial = undefined
    }
    if (this._file) {
      this._file = undefined
    }
  }

  addSource(source: S) {
    this.sources.add(source)
  }

  removeSource(source: S) {
    this.sources.delete(source)
  }

  hasSources(): boolean {
    return this.sources.size > 0
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
