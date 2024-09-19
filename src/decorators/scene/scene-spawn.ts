import * as BABYLON from '@babylonjs/core'

import {
  ActorsController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../controllers'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneInterface } from './scene-interface'

// TODO add support to inject a user defined SceneSpawn class into the scene?
// TODO Add lights here? That way scene would handle their release.
export class SceneSpawn {
  private readonly scene: SceneInterface
  private readonly scenePrototype: any

  constructor(scene: SceneInterface, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }

  actor<A extends ActorInterface, C extends number>(actor: new () => A, counter?: C, alternativeOnSpawn?: (actor: A, index: number) => void): undefined extends C ? A : A[] {
    if (!this.scene?.availableElements.hasActor(actor)) { Logger.debugError('Trying to spawn an actor that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, actor.prototype); return null as any }
    Logger.debug(`Actor spawn (${counter ?? 1}):`, actor.prototype)
    if (counter === undefined) {
      const instance = ActorsController.get(actor).spawn(this.scene)
      this.scene.actors.add(instance)
      return instance as any
    } else {
      const retInstances: ActorInterface[] = []
      const actorCore = ActorsController.get(actor)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        this.scene.actors.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as A, i)
        }
      }
      return retInstances as any
    }
  }

  particle<P extends ParticleInterface>(particle: new () => P, offset?: BABYLON.Vector3): P {
    Logger.debug('Particle spawn:', particle.prototype)
    const instance = ParticlesController.get(particle).spawn(this.scene, { offset })
    this.scene.particles.add(instance)
    return instance as P
  }

  mesh<M extends MeshInterface>(mesh: new () => M, counter?: number, alternativeOnSpawn?: (mesh: M, index: number) => void): M {
    if (!this.scene.availableElements.hasMesh(mesh)) { Logger.debugError('Trying to spawn a mesh that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, mesh.prototype); return null as any }
    Logger.debug(`Mesh spawn (${counter ?? 1}):`, mesh.prototype)
    if (counter === undefined) {
      const instance = MeshesController.get(mesh).spawn(this.scene)
      this.scene.meshes.add(instance)
      return instance as any
    } else {
      const retInstances: MeshInterface[] = []
      const actorCore = MeshesController.get(mesh)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        this.scene.meshes.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as M, i)
        }
      }
      return retInstances as any
    }
  }

  sprite<S extends SpriteInterface>(sprite: new () => S, counter?: number, alternativeOnSpawn?: (sprite: S, index: number) => void): S {
    if (!this.scene.availableElements.hasSprite(sprite)) { Logger.debugError('Trying to spawn a sprite that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, sprite.prototype); return null as any }
    Logger.debug(`Sprite spawn (${counter ?? 1}):`, sprite.prototype)
    if (counter === undefined) {
      const instance = SpritesController.get(sprite).spawn(this.scene)
      this.scene.sprites.add(instance)
      return instance as any
    } else {
      const retInstances: SpriteInterface[] = []
      const actorCore = SpritesController.get(sprite)
      for (let i = 0; i < counter; i++) {
        const instance = actorCore.spawn(this.scene)
        this.scene.sprites.add(instance)
        retInstances.push(instance)
        if (alternativeOnSpawn) {
          alternativeOnSpawn(instance as S, i)
        }
      }
      return retInstances as any
    }
  }
}
