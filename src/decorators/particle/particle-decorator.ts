import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ParticlesController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  applyDefaults,
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorActionInterface } from '../actor/actor-action/actor-action-interface'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { SceneActionInterface } from '../scene/scene-action/scene-action-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteParticleInfo } from '../sprite/sprite-particle-data'
import { SpriteProps } from '../sprite/sprite-props'
import { ParticleAttachmentInfo } from './particle-attachment-info'
import { ParticleCore } from './particle-core'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'
import { particlePropsDefault } from './particle.props.deafult'

export function Particle(props: ParticleProps): any {
  return function <T extends { new (...args: any[]): ParticleInterface }>(constructorOrTarget: (T & ParticleInterface), contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.name
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements ParticleInterface {
        constructor(readonly scene: SceneInterface, props: ParticleProps, readonly _attachmentInfo: ParticleAttachmentInfo) {
          super()
          this._props = props
          if (this.scene) {
            this.babylon.scene = this.scene.babylon.scene
            this._metadata.applyProps(this, this.scene)
          }
        }

        getClassName(): string { return this._className ?? className }

        setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
        setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
        clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
        clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
        clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

        _props: ParticleProps
        _className: string
        _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'> = { scene: null as any, particleSystem: null as any }
        setup: any
        _loopUpdate = true
        _loopUpdate$: BABYLON.Observer<number>
        _canvasResize$: BABYLON.Observer<Rect>
        _attachmentUpdate$: BABYLON.Observer<number> | undefined
        _animations: SpriteAnimation[] | null = null
        _spriteClassName: string
        _spriteProps: SpriteProps
        _spriteParticleInfo: SpriteParticleInfo
        _position: BABYLON.Vector3

        set loopUpdate(value: boolean) {
          this._loopUpdate = value
          switchLoopUpdate(this._loopUpdate, this)
        }

        get loopUpdate(): boolean { return this._loopUpdate }

        _create(setup: any): void {
          if (this.scene) {
            this.setup = setup
            if (this._attachmentInfo.offset) {
              this._position = this._props.position.add(this._attachmentInfo.offset)
            } else {
              this._position = this._props.position.clone()
            }
            this.babylon.particleSystem = new BABYLON.ParticleSystem(this.getClassName(), this._props.capacity, this.scene.babylon.scene)
            if (this._props.renderingGroupId) {
              if (this._props.renderingGroupId >= BABYLON.RenderingManager.MAX_RENDERINGGROUPS) { Logger.debugError(`Using a renderingGroupId higher than maximum value ${BABYLON.RenderingManager.MAX_RENDERINGGROUPS - 1}`, this.getClassName()) }
              this.babylon.particleSystem.renderingGroupId = this._props.renderingGroupId
            } else if (this._props.renderOverScene) {
              this.babylon.particleSystem.renderingGroupId = BABYLON.RenderingManager.MAX_RENDERINGGROUPS - 1
            }
            if (this.onInitialize) {
              this.onInitialize(this, setup)
            }
            if (this._attachmentInfo.attachment) {
              this._updatePosition()
            } else {
              this.babylon.particleSystem.emitter = (this.babylon.particleSystem.emitter as BABYLON.Vector3).add(this._position)
            }
            this.babylon.particleSystem.onStoppedObservable.add(() => {
              switchLoopUpdate(false, this)
              invokeCallback(this.onStop, this)
            })
            switchLoopUpdate(this._loopUpdate, this)
            attachCanvasResize(this)
          }
        }

        _updatePosition(): void {
          this.babylon.particleSystem.emitter = (this._attachmentInfo.attachment as any).position.add(this._position)
        }

        start(): void {
          invokeCallback(this.onStart, this)
          if (this._attachmentInfo.attachment && !this._attachmentUpdate$) {
            this._attachmentUpdate$ = Core.loopUpdateAddObserver(() => this._updatePosition())
          }
          this.babylon.particleSystem.start()
          switchLoopUpdate(this._loopUpdate, this)
        }

        stop(): void {
          this.babylon.particleSystem.stop()
          if (this._attachmentUpdate$) {
            this._attachmentUpdate$.remove()
            this._attachmentUpdate$ = undefined
          }
        }

        _release(): void {
          if (!this.babylon.particleSystem) { Logger.debugError('Trying to remove a Particle that has been already removed.', this.getClassName()); return }
          this.stop()
          invokeCallback(this.onRemove, this)
          this.clearAllTimeouts()
          this.babylon.particleSystem.dispose()
          this.babylon.particleSystem = null as any
          this._spriteParticleInfo?.texture.dispose()
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        setSprite(sprite: SpriteConstructor): void {
          const spriteCore = SpritesController.get(sprite)
          if (!this.scene._availableElements.hasSprite(sprite)) { Logger.debugError('Trying to spawn a sprite that doesn\'t belong to the scene. Please check the scene props.', this.scene.getClassName(), spriteCore.getClassName()); return null as any }
          this._spriteParticleInfo?.texture.dispose()
          this._spriteClassName = spriteCore.getClassName()
          this._spriteParticleInfo = spriteCore.getParticleInfo(this.scene)
          this._spriteProps = this._spriteParticleInfo.props
          this.babylon.particleSystem.particleTexture = this._spriteParticleInfo.texture
          if (this._spriteProps.width === this._spriteProps.height) {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else if (this._spriteParticleInfo.width > this._spriteParticleInfo.height) {
            this.babylon.particleSystem.minScaleX = this._spriteParticleInfo.width / this._spriteParticleInfo.height
            this.babylon.particleSystem.maxScaleX = this._spriteParticleInfo.width / this._spriteParticleInfo.height
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = this._spriteParticleInfo.width / this._spriteParticleInfo.height
            this.babylon.particleSystem.maxScaleY = this._spriteParticleInfo.width / this._spriteParticleInfo.height
          }
          this._animations = this._spriteProps.animations ?? null
          if (this._animations) {
            this.babylon.particleSystem.isAnimationSheetEnabled = true
            this.babylon.particleSystem.spriteCellWidth = this._spriteParticleInfo.width
            this.babylon.particleSystem.spriteCellHeight = this._spriteParticleInfo.height
          }
        }

        setAnimation(id: FlexId, cellChangeSpeed?: number, randomStartCell?: boolean): void {
          const animation = this._animations?.find(animation => animation.id === id)
          if (!animation) { Logger.debugError(`Animation Id '${id}' doesn't exist in particle sprite '${this._spriteClassName}'.`); return }
          this.babylon.particleSystem.startSpriteCellID = animation.frameStart
          this.babylon.particleSystem.endSpriteCellID = animation.frameEnd
          if (cellChangeSpeed) {
            this.babylon.particleSystem.spriteCellChangeSpeed
          }
          if (randomStartCell) {
            this.babylon.particleSystem.spriteRandomStartCell
          }
        }

        notify(message: FlexId, ...args: any[]): void {
          const definition = this._metadata.notifiers.get(message)
          if (definition) {
            this[definition.methodName](...args)
          }
        }
      }
      const _classCore = class implements ParticleCore {
        props = applyDefaults(props, particlePropsDefault)
        Instance: ParticleInterface = new _classInterface(null as any, null as any, null as any)

        _load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().fromNodes([
            SpritesController.load(this.props.sprites, scene),
            SpritesController.load(this.Instance._metadata.getProps().sprites, scene)
          ])
        }

        _unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
        }

        spawn(scene: SceneInterface, attachmentInfo: ParticleAttachmentInfo, create = true, setup?: any): ParticleInterface {
          const particle = new _classInterface(scene, this.props, attachmentInfo)
          if (create) {
            particle._create(setup)
          }
          return particle
        }

        getClassName(): string {
          return className
        }
      }
      ParticlesController.register(_classInterface, new _classCore())
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorInterface ||
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof ActorActionInterface ||
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneStateInterface ||
      constructorOrTarget instanceof SceneActionInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      @Particle(props)
      abstract class _particleInterface extends ParticleInterface {
        _className = contextOrProperty as any
        onInitialize = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.particles.add({
        propertyName: contextOrProperty as string,
        classDefinition: _particleInterface as any,
        method: constructorOrTarget[contextOrProperty as string]
      })
    } else {
      Logger.debugError('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
