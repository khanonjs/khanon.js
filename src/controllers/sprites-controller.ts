import { ControllerLoader } from '../base'
import { SpriteConstructor } from '../constructors/sprite-constructor'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SpriteCore } from '../decorators/sprite/sprite-core'

export class SpritesController extends ControllerLoader<SpriteConstructor, SpriteCore, SceneInterface>(true) {
}
