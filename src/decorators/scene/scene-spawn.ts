import {
  ActorsController,
  MeshesController,
  SpritesController
} from '../../controllers'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneType } from './scene-type'

// TODO add support to inject a user defined SceneSpawn class into the scene?
export class SceneSpawn {
  private readonly scene?: SceneType
  private readonly scenePrototype?: any

  constructor(scene: SceneType, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }

  actor<A extends ActorInterface>(actor: new () => A): A {
    if (!this.scene.props.actors || this.scene.props.actors.indexOf(actor) === -1) { Logger.debugError('Trying to spawn an actor that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, actor.prototype); return }
    Logger.debug('Actor spawn:', actor.prototype)
    const instance = ActorsController.get(actor).spawn(this.scene)
    this.scene.actors.push(instance)
    return instance as A
  }

  particle<P extends ParticleInterface>(particle: new () => P): P {
    Logger.debug('Particle spawn:', particle.prototype)
    // TODO
    return null
  }

  particleSource<S extends ParticleSourceInterface>(particleSource: new () => S): S {
    Logger.debug('ParticleSource spawn:', particleSource.prototype)
    // TODO
    return null
  }

  mesh<M extends MeshInterface>(mesh: new () => M): M {
    if ((!this.scene.props.meshes || this.scene.props.meshes?.indexOf(mesh) === -1) && (!this.scene.metadata?.getProps().meshes || this.scene.metadata.getProps().meshes.indexOf(mesh) === -1)) { Logger.debugError('Trying to spawn a mesh that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, mesh.prototype); return }
    Logger.debug('Mesh spawned:', mesh.prototype)
    const instance = MeshesController.get(mesh).spawn(this.scene)
    this.scene.meshes.push(instance)
    return instance as M
  }

  sprite<S extends SpriteInterface>(sprite: new () => S): S {
    if ((!this.scene.props.sprites || this.scene.props.sprites?.indexOf(sprite) === -1) && (!this.scene.metadata?.getProps().sprites || this.scene.metadata.getProps().sprites.indexOf(sprite) === -1)) { Logger.debugError('Trying to spawn a sprite that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, sprite.prototype); return }
    Logger.debug('Sprite spawned:', sprite.prototype)
    const instance = SpritesController.get(sprite).spawn(this.scene)
    this.scene.sprites.push(instance)
    return instance as S
  }
}
