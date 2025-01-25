import * as BABYLON from '@babylonjs/core'

export interface MeshSource {
  instantiate: boolean
  parent: BABYLON.Mesh
  geometry?: BABYLON.Mesh
}
