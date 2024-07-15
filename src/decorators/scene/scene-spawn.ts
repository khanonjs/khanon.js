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

export class SceneSpawn {
  private readonly scene?: SceneType
  private readonly scenePrototype?: any

  constructor(scene: SceneType, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }

  actor<A extends ActorInterface>(actor: new () => A): A {
    if (this.scene.props.actors.indexOf(actor) === -1) { Logger.debugError('Trying to spawn an actor that doesn\'t belong to the scene. Please check the scene props.', this.scenePrototype, actor.prototype); return }
    Logger.debug('Actor spawn:', actor.prototype)
    const instance = ActorsController.get(actor).spawn(this.scene)
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
    Logger.debug('Mesh spawned:', mesh.prototype)
    const instance = MeshesController.get(mesh).spawn(this.scene)
    return instance as M
  }

  sprite<S extends SpriteInterface>(sprite: new () => S): S {
    Logger.debug('Sprite spawned:', sprite.prototype)
    const instance = SpritesController.get(sprite).spawn(this.scene)
    return instance as S
  }
}
