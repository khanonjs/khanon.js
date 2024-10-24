import * as BABYLON from '@babylonjs/core'

import { Asset } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Logger } from '../../modules/logger'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteProps } from './sprite-props'

export class SpriteMesh {
  babylon: Pick<BabylonAccessor<any, BABYLON.Mesh, BABYLON.StandardMaterial>, 'texture' | 'mesh' | 'material' | 'scene'> = { texture: null as any, mesh: null as any, material: null as any, scene: null as any }
  asset: Asset<SceneInterface>
  width: number
  height: number

  constructor(scene: SceneInterface, private readonly spriteProps: SpriteProps) {
    this.babylon.scene = scene.babylon.scene
    this.width = this.spriteProps.width
    this.height = this.spriteProps.height
  }

  setFromAsset(asset: Asset<SceneInterface>): Promise<void> {
    return new Promise((resolve) => {
      this.asset = asset
      this.babylon.texture = new BABYLON.Texture(asset.objectURL, this.babylon.scene, this.spriteProps.noMipmap, this.spriteProps.invertY, this.spriteProps.samplingMode)
      this.babylon.texture.name = asset.definition.url
      this.babylon.texture.onLoadObservable.add(() => {
        this.buildMesh()
        resolve()
      })
    })
  }

  // TODO is this okay being sync? We need it sync because the texture is created on real-time execution (one exclusive texture per sprite spwan).
  setFromBlank(): void {
    this.babylon.texture = new BABYLON.DynamicTexture('blank-texture', { width: this.spriteProps.width, height: this.spriteProps.height }, this.babylon.scene, !this.spriteProps.noMipmap, this.spriteProps.samplingMode, this.spriteProps.format, this.spriteProps.invertY)
    this.buildMesh()
  }

  buildMesh(): void {
    const quadVertexData = new BABYLON.VertexData()

    const w = this.width / 2
    const h = this.height / 2

    // Logger.trace('aki w, h', w, h)
    // The 4 vertices, clockwise starting from bottom left
    const positions = [
      -w, -h, 0,
      -w, h, 0,
      w, h, 0,
      w, -h, 0
    ]
    // 2 triangles making a quad
    const indices = [
      0, 2, 1,
      0, 3, 2
    ]
    // Default unfolding showing the entire spritesheet. UVs will be updated in the update loop.
    const uvs = [
      0, 0,
      0, 1,
      1, 1,
      1, 0
    ]
    quadVertexData.positions = positions
    quadVertexData.indices = indices
    quadVertexData.uvs = uvs

    this.babylon.mesh = new BABYLON.Mesh(this.asset?.definition.url, this.babylon.scene)
    this.babylon.mesh.visibility = 0
    quadVertexData.applyToMesh(this.babylon.mesh, true)
    this.babylon.material = new BABYLON.StandardMaterial(this.asset?.definition.url)
    this.babylon.mesh.material = this.babylon.material
  }

  spawn(): BABYLON.Mesh {
    const mesh = this.babylon.mesh.clone(`Sprite - ${this.asset?.definition.url}`)
    mesh.material = this.babylon.material.clone(`Sprite Material - ${this.asset?.definition.url}`);
    (mesh.material as BABYLON.StandardMaterial).emissiveTexture = this.babylon.texture
    mesh.visibility = 1
    mesh.billboardMode = 7

    return mesh
  }

  // setFromTexture(texture: BABYLON.Texture | BABYLON.DynamicTexture, name: string, width?: number, height?: number): void {
  //   this.width = width ?? texture.getSize().width
  //   this.height = height ?? texture.getSize().height
  //   if (this.width === 0 || this.height === 0) { Logger.debugError('Width and Height must be higher than 0:', this.spriteProps) }
  //   this.babylon.spriteManager = new BABYLON.SpriteManager(
  //     name,
  //     '',
  //     this.spriteProps.maxAllowedSprites,
  //     { width: this.width, height: this.height },
  //     this.babylon.scene
  //   )
  //   this.babylon.spriteManager.texture = texture
  // }

  release(): void {
    this.babylon.material?.dispose()
    this.babylon.texture?.dispose()
    this.babylon.mesh?.dispose()
    // this.babylon.spriteManager = null as any
  }
}
