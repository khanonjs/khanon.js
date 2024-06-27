import {
  ActorsController,
  SpritesController
} from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import { Logger } from '../../modules'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneType } from './scene-type'

export class SceneSpawn {
  private readonly scene?: SceneType

  constructor(scene: SceneType) {
    this.scene = scene
  }

  actor<A extends ActorInterface>(actor: new () => A): A {
    Logger.debug('Actor spawned:', actor.prototype)
    const instance = ActorsController.get(actor).spawn(this.scene)
    return instance as A
  }

  particle<P extends ParticleInterface>(particle: new () => P): P {
    Logger.debug('Particle spawned:', particle.prototype)
    // 8a8f
    return null
  }

  particleSource<S extends ParticleSourceInterface>(particleSource: new () => S): S {
    Logger.debug('Particle Source spawned:', particleSource.prototype)
    // 8a8f
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
