import { ControllerLoadable } from '../base'
import { SpriteConstructor } from '../constructors'
import { SpriteType } from '../decorators/sprite/sprite-type'

export class SpritesController extends ControllerLoadable<SpriteConstructor, SpriteType>() {
}
