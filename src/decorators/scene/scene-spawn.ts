import * as BABYLON from '@babylonjs/core'

import { MetadataParticleDefinition } from '../../base/interfaces/metadata/metadata-particle-definition'
import {
  ActorsController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../controllers'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneInterface } from './scene-interface'

// TODO add support to inject a user defined SceneSpawn class into the scene?
// TODO Add lights here? That way scene would handle their release.
export class SceneSpawn {
  private readonly scene: SceneInterface

  constructor(scene: SceneInterface) {
    this.scene = scene
  }

  actor<A extends ActorInterface<any>, C extends undefined | number = undefined>(actor: new () => A, counter?: C, alternativeOnSpawn?: (actor: A, index: number) => void): undefined extends C ? A : A[] {
    if (!this.scene?._availableElements.hasActor(actor)) { Logger.debugError('Trying to spawn an actor that doesn\'t belong to the scene. Please check the scene props.', this.scene.getClassName(), actor.prototype); return null as any }
    if (counter === undefined) {
      const instance = ActorsController.get(actor).spawn(this.scene)
      Logger.debug(`Actor spawn (${counter ?? 1}):`, instance.getClassName())
      this.scene._actors.add(instance)
      return instance as any
    } else {
      const retInstances: ActorInterface[] = []
      const actorCore = ActorsController.get(actor)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        if (i === 0) { Logger.debug(`Actor spawn (${counter ?? 1}):`, instance.getClassName()) }
        this.scene._actors.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as A, i)
        }
      }
      return retInstances as any
    }
  }

  particle<P extends ParticleInterface>(particleConstructorOrMethod: ParticleConstructor | ((particle: P) => void), offset?: BABYLON.Vector3): P {
    let isMethod = false
    if (!particleConstructorOrMethod.prototype?.constructor) {
      isMethod = true
      this.scene._metadata.particles.forEach((value: MetadataParticleDefinition) => {
        particleConstructorOrMethod = value.classDefinition
      })
    }
    const instance = ParticlesController.get(particleConstructorOrMethod).spawn(this.scene, { offset }, !isMethod)
    Logger.debug('Particle spawn:', this.scene.getClassName(), instance.getClassName())
    if (isMethod) {
      // Applies context to 'onInitialize' as caller 'Actor' to preserve the 'this'
      // in case 'initialize' is equivalent to a decorated method of some of those both interfaces.
      instance.onInitialize = instance.onInitialize?.bind(this.scene)
      instance._create()
    }
    this.scene._particles.add(instance)
    return instance as P
  }

  mesh<M extends MeshInterface>(mesh: new () => M, counter?: number, alternativeOnSpawn?: (mesh: M, index: number) => void): M {
    if (!this.scene._availableElements.hasMesh(mesh)) { Logger.debugError('Trying to spawn a mesh that doesn\'t belong to the scene. Please check the scene props.', this.scene.getClassName(), mesh.prototype); return null as any }
    if (counter === undefined) {
      const instance = MeshesController.get(mesh).spawn(this.scene)
      Logger.debug(`Mesh spawn (${counter ?? 1}):`, instance.getClassName())
      this.scene._meshes.add(instance)
      return instance as any
    } else {
      const retInstances: MeshInterface[] = []
      const actorCore = MeshesController.get(mesh)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        if (i === 0) { Logger.debug(`Mesh spawn (${counter ?? 1}):`, instance.getClassName()) }
        this.scene._meshes.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as M, i)
        }
      }
      return retInstances as any
    }
  }

  sprite<S extends SpriteInterface>(sprite: new () => S, counter?: number, alternativeOnSpawn?: (sprite: S, index: number) => void): S {
    if (!this.scene._availableElements.hasSprite(sprite)) { Logger.debugError('Trying to spawn a sprite that doesn\'t belong to the scene. Please check the scene props.', this.scene.getClassName(), sprite.prototype); return null as any }
    if (counter === undefined) {
      const instance = SpritesController.get(sprite).spawn(this.scene)
      Logger.debug(`Sprite spawn (${counter ?? 1}):`, instance.getClassName())
      this.scene._sprites.add(instance)
      return instance as any
    } else {
      const retInstances: SpriteInterface[] = []
      const actorCore = SpritesController.get(sprite)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        if (i === 0) { Logger.debug(`Sprite spawn (${counter ?? 1}):`, instance.getClassName()) }
        this.scene._sprites.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as S, i)
        }
      }
      return retInstances as any
    }
  }
}
