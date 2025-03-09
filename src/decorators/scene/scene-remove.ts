import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneInterface } from './scene-interface'

// TODO add support to inject a user defined SceneRemove class into the scene?
export class SceneRemove {
  private readonly scene: SceneInterface

  constructor(scene: SceneInterface) {
    this.scene = scene
  }

  actor(actor: ActorInterface | ActorInterface[]): void {
    if (Array.isArray(actor)) {
      actor.forEach(_actor => {
        this.actor(_actor)
      })
    } else {
      actor._release()
      this.scene.actors.delete(actor)
    }
  }

  actorAll(): void {
    this.scene.actors.forEach(actor => {
      this.actor(actor)
    })
  }

  particle(particle: ParticleInterface | ParticleInterface[]): void {
    if (Array.isArray(particle)) {
      particle.forEach(_particle => {
        this.particle(_particle)
      })
    } else {
      particle.release()
      this.scene.particles.delete(particle)
    }
  }

  particleAll(): void {
    this.scene.particles.forEach(particle => {
      this.particle(particle)
    })
  }

  sprite(sprite: SpriteInterface | SpriteInterface[]): void {
    if (Array.isArray(sprite)) {
      sprite.forEach(_sprite => {
        this.sprite(_sprite)
      })
    } else {
      sprite.release()
      this.scene.sprites.delete(sprite)
    }
  }

  spriteAll(): void {
    this.scene.sprites.forEach(sprite => {
      this.sprite(sprite)
    })
  }

  mesh(mesh: MeshInterface | MeshInterface[]): void {
    if (Array.isArray(mesh)) {
      mesh.forEach(_mesh => {
        this.mesh(_mesh)
      })
    } else {
      mesh.release()
      this.scene.meshes.delete(mesh)
    }
  }

  meshAll(): void {
    this.scene.meshes.forEach(mesh => {
      this.mesh(mesh)
    })
  }

  all(): void {
    this.actorAll()
    this.particleAll()
    this.spriteAll()
    this.meshAll()
  }
}
