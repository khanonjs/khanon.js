import { LoadingProgress } from '../../base'
import { MeshesController } from '../../controllers/meshes-controller'
import { cloneClass } from '../../helpers/utils'
import { BabylonAccessor } from '../../models'
import { SceneType } from '../scene/scene-type'
import { MeshInstance } from './mesh-instance'
import { MeshProps } from './mesh-props'
import { MeshType } from './mesh-type'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshType }>(constructor: T & MeshType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MeshType {
      props = props
      Instance: MeshInstance = new MeshInstance()
      babylon: Pick<BabylonAccessor, 'scene'>
      // textures: Map<SceneType, SpriteTexture> = new Map<SceneType, SpriteTexture>()

      onLoaded?(): () => void

      load(scene: SceneType): LoadingProgress {
        return new LoadingProgress().complete()
      }

      unload(scene: SceneType): void {

      }

      spawn(): MeshInstance {
        return cloneClass(this.Instance)
      }
    }
    MeshesController.register(new _class())
    return _class
  }
}
