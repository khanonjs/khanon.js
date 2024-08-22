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
  invokeCallback,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteConstructor } from '../sprite/sprite-constructor'
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
            Logger.trace('aki new particle', this.props.capacity)
            this.babylon.particleSystem = new BABYLON.ParticleSystem(className, this.props.capacity, scene.babylon.scene)
            this.initialize(this.babylon.particleSystem)
          }
        }

        props: ParticleProps
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'> = { scene: null, particleSystem: null }
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>

        initialize?(particle: BABYLON.ParticleSystem): void
        onStart?(): void
        onStop?(): void
        onRelease?(): void
        onLoopUpdate?(delta: number): void
        onCanvasResize?(size: Rect): void

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        start(): void {
          this.babylon.particleSystem.start()
        }

        stop(): void {
          this.babylon.particleSystem.stop()
        }

        release(): void {
          invokeCallback(this.onRelease, this)
          // 8a8f
        }

        setSprite(sprite: SpriteConstructor): void {
          // 8a8f
          const spriteParticle = SpritesController.get(sprite).spawnParticle(this.scene)
          // Setup de textura
          // ajusta ancho mediante scaleX / scaleY
          // agrega animaciones
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
