import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import * as Misc from '../../misc'
import { DisplayObject } from '../../models/display-object'
import { ObservablesContainer } from '../../models/observables-container'
import { AssetsManager } from '../assets-manager/assets-manager'
import { Logger } from '../logger/logger'
import { Mesh } from '../mesh/mesh'
import { MeshesManager } from '../mesh/meshes-manager'
import { Sprite } from '../sprite/sprite'
import { SpritesManager } from '../sprite/sprites-manager'
import { Actor } from './actor'

/**
 * Actors Manager module.
 * This is a container of actors that allows other modules to work with a set of actors.
 *
 * @param babylonJsScene
 * @param assetsManager
 * @param spritesManager
 * @param meshesManager
 * @param sceneObservables
 */
export class ActorsManager {
  private readonly _actors: Misc.KeyValue<Actor, void> = new Misc.KeyValue<Actor, void>()

  constructor(
        private readonly babylonJsScene: BabylonJsScene,
        private readonly assetsManager: AssetsManager,
        private readonly spritesManager: SpritesManager,
        private readonly meshesManager: MeshesManager,
        private readonly sceneObservables: ObservablesContainer
  ) {}

  get actors(): Actor[] {
    return this._actors.getKeys()
  }

  /**
     * Add an actor to the Actors Manager
     * @param actor
     * @returns
     */
  addActor(actor: Actor): any {
    // Create display objects for any actor added to the scene
    const displayObject: DisplayObject = actor.getDisplayObject(this.babylonJsScene)
    if (displayObject instanceof Sprite) {
      this.spritesManager.addSprite(displayObject)
    } else if (displayObject instanceof Mesh) {
      this.meshesManager.addMesh(displayObject)
    } else {
      Logger.error('Unknown DisplayObject instance on actor -', actor.name)
      return undefined
    }
    actor.createParticlesManager(this.babylonJsScene, this.assetsManager)
    actor.setSceneObservables(this.sceneObservables)
    actor.initialize(this.assetsManager, () => this.delActor(actor))

    this._actors.add(actor)
    return actor
  }

  /**
     * Deletes an actor from the Actors Manager
     * @param actor
     */
  delActor(actor: Actor): void {
    this._actors.del(actor)
  }

  /**
     * Release memory and delete all actos from the Actors Manager
     */
  release(): void {
    const actors = [...this._actors.getKeys()]
    actors.forEach((actor) => {
      actor.release()
    })
    this.actors.slice(0, this.actors.length)
  }
}
