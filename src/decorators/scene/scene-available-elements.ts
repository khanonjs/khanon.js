import { ActorActionConstructor } from '../actor/actor-action/actor-action-constructor'
import { ActorConstructor } from '../actor/actor-constructor'
import { ActorStateConstructor } from '../actor/actor-state/actor-state-constructor'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'

export class SceneAvailableElements {
  sprites: Set<SpriteConstructor> = new Set<SpriteConstructor>()
  meshes: Set<MeshConstructor> = new Set<MeshConstructor>()
  actors: Set<ActorConstructor> = new Set<ActorConstructor>()
  actorActions: Set<ActorActionConstructor> = new Set<ActorActionConstructor>()
  actorStates: Set<ActorStateConstructor> = new Set<ActorStateConstructor>()
  particles: Set<ParticleConstructor> = new Set<ParticleConstructor>()
  sceneActions: Set<SceneActionConstructor> = new Set<SceneActionConstructor>()
  sceneStates: Set<SceneStateConstructor> = new Set<SceneStateConstructor>()

  hasSprite(constructor: SpriteConstructor): boolean { return this.sprites.has(constructor) }
  hasMesh(constructor: MeshConstructor): boolean { return this.meshes.has(constructor) }
  hasActor(constructor: ActorConstructor): boolean { return this.actors.has(constructor) }
  hasActorAction(constructor: ActorActionConstructor): boolean { return this.actorActions.has(constructor) }
  hasActorState(constructor: ActorStateConstructor): boolean { return this.actorStates.has(constructor) }
  hasParticle(constructor: ParticleConstructor): boolean { return this.particles.has(constructor) }
  hasSceneAction(constructor: SceneActionConstructor): boolean { return this.sceneActions.has(constructor) }
  hasSceneState(constructor: SceneStateConstructor): boolean { return this.sceneStates.has(constructor) }
}
