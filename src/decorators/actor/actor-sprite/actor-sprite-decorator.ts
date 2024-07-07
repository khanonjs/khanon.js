import 'reflect-metadata'

import {
  Sprite,
  SpriteInterface
} from '../../../'
import { Logger } from '../../../modules/logger'
import { SpriteProps } from '../../sprite/sprite-props'
import { ActorMetadata } from '../actor-metadata'

export function ActorSprite(props: SpriteProps) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    @Sprite(props)
    class _spriteInterface extends SpriteInterface {}

    if (!Reflect.hasMetadata('metadata', target)) {
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }
    const metadata = Reflect.getMetadata('metadata', target) as ActorMetadata
    metadata.sprites.push({
      propertyName: propertyKey,
      classDefinition: _spriteInterface
    })
  }
}
