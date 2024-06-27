import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor
} from '../../constructors'
import { ActorsController } from '../../controllers'
import { Logger } from '../../modules'
import { invokeCallback } from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneType } from './scene-type'

export class SceneSpawn {
  constructor(private readonly scene: SceneType) {}

  /**
   * Adds an actor to the scene.
   * @param actor
   * @param compositionId
   * @returns
   */
  actor<A extends ActorInterface>(actor: new () => A): A {
    const instance = ActorsController.get(actor).spawn(this.scene)
    return instance as A
  }

  particle(particle: ParticleConstructor, onSpawn?: (actor: ActorInterface) => void): void {}

  particleSource(particleSource: ParticleSourceConstructor, onSpawn?: (actor: ActorInterface) => void): void {}
}
