import { Mesh } from '@babylonjs/core/Meshes/mesh'

export abstract class MeshConfiguration {
  abstract apply(babylonMesh: Mesh): void
}
