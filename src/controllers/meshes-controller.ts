import { ControllerLoader } from '../base'
import { MeshConstructor } from '../constructors'
import { MeshCore } from '../decorators/mesh/mesh-core'
import { SceneType } from '../decorators/scene/scene-type'

export class MeshesController extends ControllerLoader<MeshConstructor, MeshCore, SceneType>(false) {}
