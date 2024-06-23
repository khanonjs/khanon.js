import { ControllerLoader } from '../base'
import { SpriteConstructor } from '../constructors'
import { SceneType } from '../decorators/scene/scene-type'
import { SpriteCore } from '../decorators/sprite/sprite-core'

export class SpritesController extends ControllerLoader<SpriteConstructor, SpriteCore, SceneType>(false) {
}
