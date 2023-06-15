import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { Sprite } from '../sprite/sprite'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { Actor } from './actor'
import { ActorProperties } from './actor-properties'

export abstract class Actor2D extends Actor {
  private _sprite: Sprite

  constructor(readonly name: string, protected readonly properties?: ActorProperties) {
    super(name, properties)
  }

  get sprite(): Sprite {
    return this._sprite
  }

    abstract createDisplayObject(babylonJsScene: BabylonJsScene): Sprite

    protected setDisplayObject(displayObject: Sprite): void {
      this._sprite = displayObject
    }

    setAnimation(id: number, loopOverride?: boolean, completed?: () => void): void {
      const animation = this.getAnimation<SpriteAnimation>(id)
      this.sprite.play(animation, loopOverride, completed)
    }
}
