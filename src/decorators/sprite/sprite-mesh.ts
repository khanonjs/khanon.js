import * as BABYLON from '@babylonjs/core'

import { Asset } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Logger } from '../../modules/logger'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteProps } from './sprite-props'

export class SpriteMesh {
  static idShader = 0
  babylon: Pick<BabylonAccessor<any, BABYLON.Mesh, BABYLON.ShaderMaterial>, 'texture' | 'mesh' | 'material' | 'scene'> = { texture: null as any, mesh: null as any, material: null as any, scene: null as any }
  name: string
  asset: Asset<SceneInterface>
  idShader: number
  width: number
  height: number
  numCols:number
  numRows:number
  propCol:number
  propRow:number

  constructor(private readonly scene: SceneInterface, private readonly spriteProps: SpriteProps) {
    this.babylon.scene = this.scene.babylon.scene
    this.width = this.spriteProps.width
    this.height = this.spriteProps.height
  }

  setFromAsset(asset: Asset<SceneInterface>): Promise<void> {
    return new Promise((resolve) => {
      this.name = asset.definition.url
      this.asset = asset
      this.babylon.texture = new BABYLON.Texture(asset.objectURL, this.babylon.scene, this.spriteProps.noMipmap, !this.spriteProps.invertY, this.spriteProps.samplingMode)
      this.babylon.texture.name = this.name
      this.babylon.texture.onLoadObservable.add(() => {
        this.buildMesh()
        resolve()
      })
    })
  }

  // TODO is this okay being sync? We need it sync because the texture is created on real-time execution (one exclusive texture per sprite spwan).
  setFromBlank(name: string): void {
    this.name = name
    this.babylon.texture = new BABYLON.DynamicTexture(this.name, { width: this.spriteProps.width, height: this.spriteProps.height }, this.babylon.scene, this.spriteProps.noMipmap, this.spriteProps.samplingMode, this.spriteProps.format, !this.spriteProps.invertY)
    this.buildMesh()
  }

  setFromTexture(texture: BABYLON.Texture | BABYLON.DynamicTexture, name: string, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    if (this.width === 0 || this.height === 0) { Logger.debugError('Width and Height must be higher than 0:', this.spriteProps) }
    this.name = name
    this.babylon.texture = texture
    this.buildMesh()
  }

  buildMesh(): void {
    const w = this.width / 2
    const h = this.height / 2

    const quadVertexData = new BABYLON.VertexData()
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
      0, 1,
      0, 0,
      1, 0,
      1, 1
    ]
    quadVertexData.positions = positions
    quadVertexData.indices = indices
    quadVertexData.uvs = uvs

    this.babylon.mesh = new BABYLON.Mesh(`SpriteSource - ${this.name}`, this.babylon.scene)
    this.babylon.mesh.visibility = 0
    quadVertexData.applyToMesh(this.babylon.mesh, true)

    const size = this.babylon.texture.getSize()
    this.idShader = SpriteMesh.idShader
    SpriteMesh.idShader++
    this.numCols = size.width / this.width
    this.numRows = size.height / this.height
    this.propCol = 1 / this.numCols
    this.propRow = 1 / this.numRows

    BABYLON.Effect.ShadersStore[`spriteMesh${this.idShader}VertexShader`] = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 worldViewProjection;
    varying vec2 vUv;

    void main() {
        vec4 p = vec4(position, 1.);
        gl_Position = worldViewProjection * p;
        vUv = uv;
    }
`
    BABYLON.Effect.ShadersStore[`spriteMesh${this.idShader}FragmentShader`] = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D textureSampler;
    uniform int frame;
    uniform float alpha;

    void main() {
        int uOffset = frame % ${this.numCols};
        int vOffset = frame / ${this.numCols};
        vec2 computedUV = vec2(vUv.x * ${this.propCol.toPrecision(7)} + float(uOffset) * ${this.propCol.toPrecision(7)}, vUv.y * ${this.propRow.toPrecision(7)} + float(vOffset) * ${this.propRow.toPrecision(7)});
        vec4 color = texture2D(textureSampler, computedUV);
        gl_FragColor = vec4(color.rgb, alpha * color.a);
    }
`

    const shaderMaterial = new BABYLON.ShaderMaterial(`spriteMaterial-${this.name}`, this.babylon.scene, `spriteMesh${this.idShader}`, {
      attributes: ['position', 'uv'],
      uniforms: ['worldViewProjection'],
      samplers: ['textureSampler'],
      needAlphaBlending: true
    })

    shaderMaterial.setTexture('textureSampler', this.babylon.texture)
    shaderMaterial.setInt('frame', 0)
    shaderMaterial.setFloat('alpha', 1)
    this.babylon.mesh.material = shaderMaterial
    this.babylon.material = shaderMaterial
  }

  spawn(): BABYLON.Mesh {
    const mesh = this.babylon.mesh.clone(`Sprite - ${this.name}`)
    mesh.visibility = 1
    mesh.billboardMode = 2
    return mesh
  }

  release(): void {
    this.babylon.material?.dispose()
    this.babylon.texture?.dispose()
    this.babylon.mesh?.dispose()
    this.babylon.material = null as any
    this.babylon.texture = null as any
    this.babylon.mesh = null as any
  }
}
