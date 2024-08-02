import { ControllerLoader } from '../base'
import { SceneActionConstructor } from '../decorators/scene/scene-action/scene-action-constructor'
import { SceneActionCore } from '../decorators/scene/scene-action/scene-action-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class SceneActionsController extends ControllerLoader<SceneActionConstructor, SceneActionCore, SceneInterface>() {}
