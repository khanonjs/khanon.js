import * as Misc from '../../misc'
import { Mesh } from './mesh'
import { AssetsManager } from '../assets-manager/assets-manager'

export class MeshesManager {
  private readonly meshes: Misc.KeyValue<Mesh, Mesh> = new Misc.KeyValue<Mesh, Mesh>()

  constructor(private readonly assetsManager: AssetsManager) {}

  addMesh(mesh: Mesh): Mesh {
    this.meshes.add(mesh, mesh)
    return mesh
  }

  removeMesh(mesh: Mesh): void {
    mesh.release()
    this.meshes.del(mesh)
  }

  release(): void {
    this.meshes.getValues().forEach((mesh) => mesh.release())
    this.meshes.reset()
  }
}
