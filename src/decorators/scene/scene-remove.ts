import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneType } from './scene-type'

// TODO add support to inject a user defined SceneRemove class into the scene?
export class SceneRemove {
  private readonly scene?: SceneType
  private readonly scenePrototype?: any

  constructor(scene: SceneType, scenePrototype: any) {
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

  particle(particle: ParticleInterface | ParticleSourceInterface): void {
    // TODO
    // particle.release()
    // this.scene.particles.delete(particle)
  }

  particleAll(): void {
    // TODO
    // this.scene.particles.forEach(particle => {
    //   this.particle(particle)
    // })
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
