import {
  Mesh as BabylonMesh,
  Vector3
} from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { MeshesController } from '../../controllers/meshes-controller'
import { invokeCallback } from '../../helpers/utils'
import { BabylonAccessor } from '../../models'
import { Logger } from '../../modules'
import { SceneType } from '../scene/scene-type'
import { MeshCore } from './mesh-core'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructor: T & MeshInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements MeshInterface {
      // ***************
      // MeshInterface
      // ***************
      babylon: Pick<BabylonAccessor, 'scene' | 'mesh'> = { scene: null, mesh: null }
      _visible: boolean

      setMesh(babylonMesh: BabylonMesh): void {
        if (this.babylon.mesh) {
          this.babylon.mesh.dispose()
        }
        this.babylon.mesh = babylonMesh
      }

      onSpawn?(scene: SceneType): void

      release(): void {

      }

      // ***************
      // DisplayObject
      // ***************
      set visible(value: boolean) {
        this._visible = value
      }

      get visible(): boolean {
        return this._visible
      }

      setPosition(position: Vector3): void {
        this.babylon.mesh.position = position
      }

      setPositionFromFloats(x: number, y: number, z: number): void {
        this.babylon.mesh.position.x = x
        this.babylon.mesh.position.y = y
        this.babylon.mesh.position.z = z
      }

      getPosition(): Vector3 {
        return this.babylon.mesh.position
      }

      setX(value: number): void {
        this.babylon.mesh.position.x = value
      }

      incX(value: number): void {
        this.babylon.mesh.position.x += value
      }

      getX(): number {
        return this.babylon.mesh.position.x
      }

      setY(value: number): void {
        this.babylon.mesh.position.y = value
      }

      incY(value: number): void {
        this.babylon.mesh.position.y += value
      }

      getY(): number {
        return this.babylon.mesh.position.y
      }

      setZ(value: number): void {
        this.babylon.mesh.position.z = value
      }

      incZ(value: number): void {
        this.babylon.mesh.position.z += value
      }

      getZ(): number {
        return this.babylon.mesh.position.z
      }

      setRotation(rotation: Vector3): void {

      }

      getRotation(): Vector3 {
        return null
      }

      setScale(scale: number): void {

      }

      getScale(): number {
        return null
      }

      setAlpha(alpha: number): void {

      }

      getAlpha(): number {
        return null
      }

      play(animation: any/* SpriteAnimation | MeshAnimation */, loopOverride?: boolean, completed?: () => void): void {

      }
    }
    const _classCore = class implements MeshCore {
      props = props
      Instance: MeshInterface = new _classInterface(null)

      load(scene: SceneType): LoadingProgress {
        return new LoadingProgress().complete()
      }

      unload(scene: SceneType): void {

      }

      spawn(scene: SceneType): MeshInterface { // 8a8f es necesaria la escena aquí
        Logger.trace('aki MeshCore spawn')
        const mesh = new _classInterface(/* scene */)
        invokeCallback(mesh.onSpawn, mesh, scene)
        mesh.visible = true
        return mesh
      }
    }
    MeshesController.register(new _classCore())
    return _classInterface
  }
}
