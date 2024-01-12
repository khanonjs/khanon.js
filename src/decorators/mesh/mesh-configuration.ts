import { Mesh as BabylonJsMesh } from '@babylonjs/core/Meshes/mesh'

export abstract class MeshConfiguration {
  abstract apply(babylonJsMesh: BabylonJsMesh): void
}
