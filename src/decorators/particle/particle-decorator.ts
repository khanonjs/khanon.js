import 'reflect-metadata'

import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ParticlesController,
  SpritesController
} from '../../controllers'
import { Core } from '../../core'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  applyDefaults,
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
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
  return function <T extends { new (...args: any[]): ParticleInterface }>(constructorOrTarget: (T & ParticleInterface) | any, contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const className = constructorOrTarget.prototype.constructor.name
      const _classInterface = class extends constructorOrTarget implements ParticleInterface {
        constructor(readonly scene: SceneInterface, props: ParticleProps, readonly attachmentInfo: ParticleAttachmentInfo) {
          super()
          this.props = props
          this.metadata.applyProps(this)
        }

        props: ParticleProps
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'> = { scene: null as any, particleSystem: null as any }
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        attachmentUpdate$: BABYLON.Observer<number>
        animations: SpriteAnimation[] | null = null
        spriteProps: SpriteProps
        offset: BABYLON.Vector3

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        create(): void {
          if (this.scene) {
            if (this.attachmentInfo.offset) {
              this.offset = this.props.offset.add(this.attachmentInfo.offset)
            } else {
              this.offset = this.props.offset.clone()
            }
            this.babylon.particleSystem = new BABYLON.ParticleSystem(className, this.props.capacity, this.scene.babylon.scene)
            this.initialize(this)
            if (this.attachmentInfo.attachment) {
              this.updatePosition()
            } else {
              this.babylon.particleSystem.emitter = (this.babylon.particleSystem.emitter as BABYLON.Vector3).add(this.offset)
            }
            this.babylon.particleSystem.onStoppedObservable.add(() => {
              switchLoopUpdate(false, this)
              invokeCallback(this.onStop, this)
            })
            attachLoopUpdate(this)
            attachCanvasResize(this)
          }
        }

        updatePosition(): void {
          this.babylon.particleSystem.emitter = (this.attachmentInfo.attachment as any).transform.position.add(this.offset)
        }

        start(): void {
          invokeCallback(this.onStart, this)
          if (this.attachmentInfo.attachment) {
            this.attachmentUpdate$ = Core.loopUpdateAddObserver(() => this.updatePosition())
          }
          this.babylon.particleSystem.start()
          switchLoopUpdate(true, this)
        }

        stop(): void {
          this.babylon.particleSystem.stop()
          if (this.attachmentUpdate$) {
            this.attachmentUpdate$.remove()
          }
        }

        release(): void {
          if (!this.babylon.particleSystem) { Logger.debugError('Trying to remove a Particle that has been already removed.', _classInterface.prototype); return }
          this.stop()
          invokeCallback(this.onRelease, this)
          this.babylon.particleSystem.dispose()
          this.babylon.particleSystem = null as any
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        setSprite(sprite: SpriteConstructor): void {
          const spriteParticleInfo = SpritesController.get(sprite).getParticleInfo(this.scene)
          if (!spriteParticleInfo.props.url) { Logger.debugError('Cannot use a particle texture from a blank sprite. The sprite \'url\' must be defined.'); return }
          this.spriteProps = spriteParticleInfo.props
          this.babylon.particleSystem.particleTexture = spriteParticleInfo.texture.babylon.spriteManager.texture
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
          SpritesController.load(this.props.sprites, scene)
          SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
          return new LoadingProgress().complete()
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
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneStateInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      @Particle(props)
      abstract class _particleInterface extends ParticleInterface {
        initialize = descriptor.value
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
