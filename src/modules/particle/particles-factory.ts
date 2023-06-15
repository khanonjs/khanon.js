import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import * as Misc from '../../misc'
import { DisplayObject } from '../../models/display-object'
import { AssetsManager } from '../assets-manager/assets-manager'
import { Particle } from './particle'

export class ParticlesFactory {
  private readonly particles: Misc.KeyValue<Particle, void> = new Misc.KeyValue<Particle, void>()

  constructor(private readonly babylonJsScene: BabylonJsScene, private readonly assetsManager: AssetsManager, private readonly parent?: DisplayObject) {}

  new(particle: Particle): void {
    this.particles.add(particle)
    particle.initialize(this.babylonJsScene, this.assetsManager, () => this.del(particle), this.parent)
    particle.start()
  }

  del(particle: Particle): void {
    this.particles.del(particle)
  }

  release(): void {
    const particles = [...this.particles.getKeys()]
    particles.forEach((particle) => {
      particle.end()
    })
    this.particles.reset()
  }
}
