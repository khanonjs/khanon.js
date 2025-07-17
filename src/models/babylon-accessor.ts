import { AudioEngineV2 } from '@babylonjs/core/AudioV2/abstractAudio/audioEngineV2'
import { StaticSound } from '@babylonjs/core/AudioV2/abstractAudio/staticSound'
import { StreamingSound } from '@babylonjs/core/AudioV2/abstractAudio/streamingSound'
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Material } from '@babylonjs/core/Materials/material'
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem'
import { Scene } from '@babylonjs/core/scene'
import { Sprite } from '@babylonjs/core/Sprites/sprite'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'

export interface BabylonAccessor<
    C extends TargetCamera = TargetCamera,
    M extends AbstractMesh = AbstractMesh,
    N extends Material = Material
  > {
  camera: C
  engine: Engine
  audioEngine: AudioEngineV2
  scene: Scene
  sprite: Sprite
  mesh: M
  spriteManager: SpriteManager
  particleSystem: ParticleSystem
  texture: Texture | DynamicTexture
  material: N
  gui: AdvancedDynamicTexture
  sound: StaticSound | StreamingSound
}
