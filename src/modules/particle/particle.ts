import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { DisplayObject } from '../../base/display-object'
import { LoopUpdateable } from '../../models/loop-updateable'
import { AssetsManager } from '../assets-manager/assets-manager'
import { MeshesManager } from '../mesh/meshes-manager'
import { ParticleEndCriteria } from '../particle/particle-end-criteria'
import { ParticleProperties } from './particle-properties'

export abstract class Particle extends LoopUpdateable {
    abstract id: string

    private removeCallback: () => void

    protected parent: DisplayObject

    protected babylonJsScene: BabylonJsScene
    protected displayObject: DisplayObject
    protected assetsManager: AssetsManager
    protected meshesManager: MeshesManager

    constructor(protected readonly properties: ParticleProperties) {
      super()
    }

    /**
     * Return DisplayObject from child particle
     */
    abstract createDisplayObject(): DisplayObject

    /**
     * Start child function
     */
    abstract onStart(): void

    initialize(babylonJsScene: BabylonJsScene, assetsManager: AssetsManager, removeCallback: () => void, parent?: DisplayObject): void {
      this.babylonJsScene = babylonJsScene
      this.assetsManager = assetsManager
      this.parent = parent

      this.displayObject = this.createDisplayObject()
      this.displayObject.setX(this.properties.x ?? 0)
      this.displayObject.setY(this.properties.y ?? 0)
      this.displayObject.setZ(this.properties.z ?? 0)
      this.displayObject.setScale(this.properties.scale ?? 1)
      this.displayObject.setAlpha(this.properties.alpha ?? 1)

      this.properties.motion?.initialize(this.displayObject, this.properties.endCriteria === ParticleEndCriteria.MOTION_END ? () => this.end() : undefined)

      if (this.properties.endCriteria === ParticleEndCriteria.TIMER) {
        setTimeout(() => this.end(), this.properties.endValue)
      }

      this.removeCallback = removeCallback
    }

    start(): void {
      this.properties.motion?.start()
      this.onStart()
    }

    end(): void {
      this.properties.motion?.end()
      this.displayObject.release()
      this.removeCallback()
    }
}
