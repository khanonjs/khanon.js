import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable
} from '../../base'
import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneStateConstructor
} from '../../constructors'
import { Rect } from '../../models'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { ActorInterface } from '../actor/actor-interface'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable {
  abstract babylon: Pick<BabylonAccessor, | 'scene'>
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract start(state: SceneStateConstructor): void
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor): void
  abstract spawnActor(actor: ActorConstructor, initialize?: (actor: ActorInterface) => void): void
  abstract spawnParticle(particle: ParticleConstructor, initialize?: (particle: ParticleConstructor) => void): void
  abstract spawnParticleSource(particleSource: ParticleSourceConstructor, initialize?: (particleSource: ParticleSourceConstructor) => void): void
  onStart?(): void
  onStop?(): void
  onLoaded?(): void
  onUnload?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(canvasSize: Rect): void
}
