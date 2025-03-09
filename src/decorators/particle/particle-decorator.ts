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
        constructor(readonly scene: SceneInterface, props: ParticleProps, readonly attachmentInfo: ParticleAttachmentInfo) {
          super()
          this.props = props
          this.metadata.applyProps(this)
        }

        getClassName(): string {
          return this.className ?? className
        }

        props: ParticleProps
        className: string
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'> = { scene: null as any, particleSystem: null as any }
        _loopUpdate = true
        loopUpdate$: BABYLON.Observer<number>
        _canvasResize$: BABYLON.Observer<Rect>
        attachmentUpdate$: BABYLON.Observer<number> | undefined
        animations: SpriteAnimation[] | null = null
        spriteProps: SpriteProps
        offset: BABYLON.Vector3

        set loopUpdate(value: boolean) {
          this._loopUpdate = value
          switchLoopUpdate(this._loopUpdate, this)
        }

        get loopUpdate(): boolean { return this._loopUpdate }

        create(): void {
          if (this.scene) {
            if (this.attachmentInfo.offset) {
              this.offset = this.props.offset.add(this.attachmentInfo.offset)
            } else {
              this.offset = this.props.offset.clone()
            }
            this.babylon.particleSystem = new BABYLON.ParticleSystem(this.getClassName(), this.props.capacity, this.scene.babylon.scene)
            if (this.onInitialize) {
              this.onInitialize(this)
            }
            if (this.attachmentInfo.attachment) {
              this.updatePosition()
            } else {
              this.babylon.particleSystem.emitter = (this.babylon.particleSystem.emitter as BABYLON.Vector3).add(this.offset)
            }
            this.babylon.particleSystem.onStoppedObservable.add(() => {
              switchLoopUpdate(false, this)
              invokeCallback(this.onStop, this)
            })
            switchLoopUpdate(this._loopUpdate, this)
            attachCanvasResize(this)
          }
        }

        updatePosition(): void {
          this.babylon.particleSystem.emitter = (this.attachmentInfo.attachment as any).position.add(this.offset)
        }

        start(): void {
          invokeCallback(this.onStart, this)
          if (this.attachmentInfo.attachment && !this.attachmentUpdate$) {
            this.attachmentUpdate$ = Core.loopUpdateAddObserver(() => this.updatePosition())
          }
          this.babylon.particleSystem.start()
          switchLoopUpdate(this._loopUpdate, this)
        }

        stop(): void {
          this.babylon.particleSystem.stop()
          if (this.attachmentUpdate$) {
            this.attachmentUpdate$.remove()
            this.attachmentUpdate$ = undefined
          }
        }

        release(): void {
          if (!this.babylon.particleSystem) { Logger.debugError('Trying to remove a Particle that has been already removed.', this.getClassName()); return }
          this.stop()
          invokeCallback(this.onRemove, this)
          this.babylon.particleSystem.dispose()
          this.babylon.particleSystem = null as any
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        setSprite(sprite: SpriteConstructor): void {
          const spriteParticleInfo = SpritesController.get(sprite).getParticleInfo(this.scene)
          if (!spriteParticleInfo.props.url) { Logger.debugError('Cannot use a particle texture from a blank sprite. The sprite \'url\' must be defined.'); return }
          this.spriteProps = spriteParticleInfo.props
          this.babylon.particleSystem.particleTexture = spriteParticleInfo.spriteMesh.babylon.texture
          if (this.spriteProps.width === this.spriteProps.height) {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else if (this.spriteProps.width > this.spriteProps.height) {
            this.babylon.particleSystem.minScaleX = this.spriteProps.width / this.spriteProps.height
            this.babylon.particleSystem.maxScaleX = this.spriteProps.width / this.spriteProps.height
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = this.spriteProps.width / this.spriteProps.height
            this.babylon.particleSystem.maxScaleY = this.spriteProps.width / this.spriteProps.height
          }
          this.animations = this.spriteProps.animations ?? null
          if (this.animations) {
            this.babylon.particleSystem.isAnimationSheetEnabled = true
            this.babylon.particleSystem.spriteCellWidth = this.spriteProps.width
            this.babylon.particleSystem.spriteCellHeight = this.spriteProps.height
          }
        }

        setAnimation(id: FlexId, cellChangeSpeed?: number, randomStartCell?: boolean): void {
          const animation = this.animations?.find(animation => animation.id === id)
          if (!animation) { Logger.debugError(`Animation Id '${id}' doesn't exist in particle sprite '${this.spriteProps.url}'.`); return }
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
          const definition = this.metadata.notifiers.get(message)
          if (definition) {
            this[definition.methodName](...args)
          }
        }
      }
      const _classCore = class implements ParticleCore {
        props = applyDefaults(props, particlePropsDefault)
        Instance: ParticleInterface = new _classInterface(null as any, null as any, null as any)

        load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().fromNodes([
            SpritesController.load(this.props.sprites, scene),
            SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
          ])
        }

        unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        }

        spawn(scene: SceneInterface, attachmentInfo: ParticleAttachmentInfo, create = true): ParticleInterface {
          const particle = new _classInterface(scene, this.props, attachmentInfo)
          if (create) {
            particle.create()
          }
          return particle
        }

        getClassName(): string {
          return className
        }
      }
      ParticlesController.register(new _classCore())
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
        className = contextOrProperty as any
        onInitialize = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.particles.add({
        propertyName: contextOrProperty as string,
        classDefinition: _particleInterface as any,
        methodName: contextOrProperty as string
      })
    } else {
      Logger.debugError('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
