import {
  ActorsController,
  MeshesController,
  SpritesController
} from '../../controllers'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneInterface } from './scene-interface'

// TODO add support to inject a user defined SceneSpawn class into the scene?
// TODO add counter argument in methods to spawn many elements in a single step. 'index' would be sent to 'onSpawn' methods.
// TODO add 'aggregateSpawnMethod' as argument to combine with 'onSpawn'.
export class SceneSpawn {
  private readonly scene?: SceneInterface
  private readonly scenePrototype?: any

  constructor(scene: SceneInterface, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }

  actor<A extends ActorInterface>(actor: new () => A): A {
    if (!this.scene.availableElements.hasActor(actor)) { Logger.debugError('Trying to spawn an actor that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, actor.prototype); return }
    Logger.debug('Actor spawn:', actor.prototype)
    const instance = ActorsController.get(actor).spawn(this.scene)
    this.scene.actors.add(instance)
    return instance as A
  }

  particle<P extends ParticleInterface>(particle: new () => P): P {
    Logger.debug('Particle spawn:', particle.prototype)
    // TODO
    return null
  }

  mesh<M extends MeshInterface>(mesh: new () => M): M {
    if (!this.scene.availableElements.hasMesh(mesh)) { Logger.debugError('Trying to spawn a mesh that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, mesh.prototype); return }
    Logger.debug('Mesh spawned:', mesh.prototype)
    const instance = MeshesController.get(mesh).spawn(this.scene)
    this.scene.meshes.add(instance)
    return instance as M
  }

  sprite<S extends SpriteInterface>(sprite: new () => S): S {
    if (!this.scene.availableElements.hasSprite(sprite)) { Logger.debugError('Trying to spawn a sprite that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, sprite.prototype); return }
    Logger.debug('Sprite spawned:', sprite.prototype)
    const instance = SpritesController.get(sprite).spawn(this.scene)
    this.scene.sprites.add(instance)
    return instance as S
  }

  // TODO Add lights here? That way scene would handle their release.
}
