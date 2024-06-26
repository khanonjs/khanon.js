import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor
} from '../../constructors'
import { ActorsController } from '../../controllers'
import { Logger } from '../../modules'
import { invokeCallback } from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { SceneType } from './scene-type'

export class SceneSpawn {
  constructor(private readonly scene: SceneType) {}

  actor(actor: ActorConstructor, compositionId: string, onSpawn?: (actor: ActorInterface) => void): void {
    const instance = ActorsController.get(actor).spawn(this.scene)
    invokeCallback(onSpawn, this.scene, instance)
  }

  particle(particle: ParticleConstructor, onSpawn?: (actor: ActorInterface) => void): void {}

  particleSource(particleSource: ParticleSourceConstructor, onSpawn?: (actor: ActorInterface) => void): void {}
}
