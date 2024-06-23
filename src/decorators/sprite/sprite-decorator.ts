import { LoadingProgress } from '../../base'
import {
  AssetsController,
  SpritesController
} from '../../controllers'
import {
  applyDefaults,
  invokeCallback
} from '../../helpers/utils'
import { BabylonAccessor } from '../../models'
import { Logger } from '../../modules'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteCore } from './sprite-core'
import { SpriteInterface } from './sprite-interface'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { spritePropsDefault } from './sprite.props.deafult'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): SpriteInterface }>(constructor: T & SpriteInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SpriteInterface {
      babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'> = { spriteManager: null, scene: null }

      /* constructor(private readonly scene: SceneType) {
        super()
      } */

      onSpawn?(scene: SceneInterface): void {}

      release(): void {

      }
    }
    const _classCore = class implements SpriteCore {
      props = applyDefaults(props, spritePropsDefault)
      Instance: SpriteInterface = new _classInterface(null)
      textures: Map<SceneType, SpriteTexture> = new Map<SceneType, SpriteTexture>()

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        if (this.textures.get(scene)) {
          return progress.complete()
        } else {
          if (this.props.url) {
            const asset = AssetsController.getAsset(this.props.url)
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromArrayBuffer(asset.buffer)
            this.textures.set(scene, texture)
            return progress
          } else {
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromBlank()
            this.textures.set(scene, texture)
            return progress.complete()
          }
        }
      }

      unload(scene: SceneType): void {
        this.textures.delete(scene)
        // AssetsController. // 8a8f
      }

      spawn(scene: SceneType): SpriteInterface {
        const sprite = new _classInterface(/* scene */)
        invokeCallback(sprite.onSpawn, sprite, scene)
        return sprite
      }
    }
    SpritesController.register(new _classCore())
    return _classInterface
  }
}
