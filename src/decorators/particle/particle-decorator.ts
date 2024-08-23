import * as BABYLON from '@babylonjs/core'

import { ParticleInterface as UserParticleInterface } from '../../'
import { LoadingProgress } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ParticlesController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types'
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
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteProps } from '../sprite/sprite-props'
import { ParticleCore } from './particle-core'
import { ParticleInterface } from './particle-interface'
import { ParticleProps } from './particle-props'
import { particlePropsDefault } from './particle.props.deafult'

export function Particle(props: ParticleProps = {}): any {
  return function <T extends { new (...args: any[]): ParticleInterface }>(constructorOrTarget: (T & ParticleInterface) | any, contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.prototype.constructor.name
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements ParticleInterface {
        constructor(readonly scene: SceneInterface, props: ParticleProps) {
          super()
          this.props = props
          if (scene) {
            this.metadata.applyProps(this)
            this.babylon.particleSystem = new BABYLON.ParticleSystem(className, this.props.capacity, scene.babylon.scene)
            this.initialize(this.babylon.particleSystem)
            this.babylon.particleSystem.onStoppedObservable.add(() => {
              switchLoopUpdate(false, this)
              invokeCallback(this.onStop, this)
            })
            attachLoopUpdate(this)
            attachCanvasResize(this)
          }
        }

        props: ParticleProps
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'> = { scene: null, particleSystem: null }
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        animations: SpriteAnimation[]
        spriteProps: SpriteProps

        initialize?(particle: BABYLON.ParticleSystem): void
        onStart?(): void
        onStop?(): void
        onRelease?(): void
        onLoopUpdate?(delta: number): void
        onCanvasResize?(size: Rect): void

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        start(): void {
          invokeCallback(this.onStart, this)
          this.babylon.particleSystem.start()
          switchLoopUpdate(true, this)
        }

        stop(): void {
          this.babylon.particleSystem.stop()
        }

        release(): void {
          invokeCallback(this.onRelease, this)
          this.babylon.particleSystem.dispose()
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        setSprite(sprite: SpriteConstructor): void {
          const spriteParticleInfo = SpritesController.get(sprite).getParticleInfo(this.scene)
          if (!spriteParticleInfo.props.url) { Logger.debugError('Cannot use a particle texture from a blank sprite. The sprite \'url\' must be defined.'); return }
          this.spriteProps = spriteParticleInfo.props
          this.babylon.particleSystem.particleTexture = spriteParticleInfo.texture.babylon.spriteManager.texture
          if (spriteParticleInfo.props.width === spriteParticleInfo.props.height) {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else if (spriteParticleInfo.props.width > spriteParticleInfo.props.height) {
            this.babylon.particleSystem.minScaleX = spriteParticleInfo.props.width / spriteParticleInfo.props.height
            this.babylon.particleSystem.maxScaleX = spriteParticleInfo.props.width / spriteParticleInfo.props.height
            this.babylon.particleSystem.minScaleY = 1
            this.babylon.particleSystem.maxScaleY = 1
          } else {
            this.babylon.particleSystem.minScaleX = 1
            this.babylon.particleSystem.maxScaleX = 1
            this.babylon.particleSystem.minScaleY = spriteParticleInfo.props.width / spriteParticleInfo.props.height
            this.babylon.particleSystem.maxScaleY = spriteParticleInfo.props.width / spriteParticleInfo.props.height
          }
          if (spriteParticleInfo.props.animations) {
            this.animations = spriteParticleInfo.props.animations
            this.babylon.particleSystem.isAnimationSheetEnabled = true
            this.babylon.particleSystem.spriteCellWidth = spriteParticleInfo.props.width
            this.babylon.particleSystem.spriteCellHeight = spriteParticleInfo.props.height
          }
        }

        setAnimation(id: FlexId, cellChangeSpeed?: number, randomStartCell?: boolean): void {
          const animation = this.animations.find(animation => animation.id === id)
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
        Instance: ParticleInterface = new _classInterface(null, null)

        load(scene: SceneInterface): LoadingProgress {
          SpritesController.load(this.props.sprites, scene)
          SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
          return new LoadingProgress().complete()
        }

        unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        }

        spawn(scene: SceneInterface): ParticleInterface {
          const particle = new _classInterface(scene, this.props)
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
      constructorOrTarget instanceof ActorInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      @Particle(props)
      class _particleInterface extends UserParticleInterface {
        initialize = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.particles.push({
        propertyName: contextOrProperty as string,
        classDefinition: _particleInterface
      })
    } else {
      Logger.debugError('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
