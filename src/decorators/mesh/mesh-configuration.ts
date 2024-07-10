import * as BABYLON from '@babylonjs/core'

export abstract class MeshConfiguration {
  abstract apply(babylonMesh: BABYLON.Mesh): void
}
