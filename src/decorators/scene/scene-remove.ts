import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneInterface } from './scene-interface'

// TODO add support to inject a user defined SceneRemove class into the scene?
export class SceneRemove {
  private readonly scene?: SceneInterface
  private readonly scenePrototype?: any

  constructor(scene: SceneInterface, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }

  actor(actor: ActorInterface): void {
    actor.release()
    this.scene.actors.delete(actor)
  }

  actorAll(): void {
    this.scene.actors.forEach(actor => {
      this.actor(actor)
    })
  }

  particle(particle: ParticleInterface): void {
    particle.release()
    this.scene.particles.delete(particle)
  }

  particleAll(): void {
    this.scene.particles.forEach(particle => {
      this.particle(particle)
    })
  }

  sprite(sprite: SpriteInterface): void {
    sprite.release()
    this.scene.sprites.delete(sprite)
  }

  spriteAll(): void {
    this.scene.sprites.forEach(sprite => {
      this.sprite(sprite)
    })
  }

  mesh(mesh: MeshInterface): void {
    mesh.release()
    this.scene.meshes.delete(mesh)
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
