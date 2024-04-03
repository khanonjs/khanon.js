import { ControllerLoader } from '../base'
import { SpriteConstructor } from '../constructors'
import { SceneType } from '../decorators/scene/scene-type'
import { SpriteType } from '../decorators/sprite/sprite-type'

export class SpritesController extends ControllerLoader<SpriteConstructor, SpriteType, SceneType>() {
}
