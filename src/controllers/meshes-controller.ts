import { ControllerLoader } from '../base'
import { MeshConstructor } from '../decorators/mesh/mesh-constructor'
import { MeshCore } from '../decorators/mesh/mesh-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class MeshesController extends ControllerLoader<MeshConstructor, MeshCore, SceneInterface>(true) {}
