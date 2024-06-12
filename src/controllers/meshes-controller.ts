import { ControllerLoader } from '../base'
import { MeshConstructor } from '../constructors'
import { MeshType } from '../decorators/mesh/mesh-type'
import { SceneType } from '../decorators/scene/scene-type'

export class MeshesController extends ControllerLoader<MeshConstructor, MeshType, SceneType>(false) {
}
