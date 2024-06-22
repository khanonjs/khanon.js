import { LoadingProgress } from '../../base'
import { MeshesController } from '../../controllers/meshes-controller'
import { invokeCallback } from '../../helpers/utils'
import { BabylonAccessor } from '../../models'
import { SceneType } from '../scene/scene-type'
import { MeshCore } from './mesh-core'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructor: T & MeshInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements MeshInterface {
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }

      constructor(private readonly scene: SceneType) {
        super()
      }

      onSpawn?(): void {}
    }
    const _classCore = class implements MeshCore {
      props = props
      Instance: MeshInterface = new _classInterface(null)

      load(scene: SceneType): LoadingProgress {
        return new LoadingProgress().complete()
      }

      unload(scene: SceneType): void {

      }

      spawn(scene: SceneType): MeshInterface {
        const mesh = new _classInterface(scene)
        invokeCallback(mesh.onSpawn, mesh)
        return mesh
      }
    }
    MeshesController.register(new _classCore())
    return _classInterface
  }
}
