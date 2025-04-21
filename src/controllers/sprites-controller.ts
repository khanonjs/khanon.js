import { ControllerLoader } from '../base'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SpriteConstructor } from '../decorators/sprite/sprite-constructor'
import { SpriteCore } from '../decorators/sprite/sprite-core'

export class SpritesController extends ControllerLoader<SpriteConstructor, SpriteCore, SceneInterface>() {
}
