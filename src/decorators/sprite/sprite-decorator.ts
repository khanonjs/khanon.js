import { SpriteConstructor } from '../../constructors'
import { AssetsController } from '../../controllers/assets-controller'
import { SpritesController } from '../../controllers/sprites-controller'
import {
  AssetType,
  LoadingProgress
} from '../../models'
import { SceneType } from '../scene/scene-type'
import { SpriteCore } from './sprite-core'
import { SpriteInterface } from './sprite-interface'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SpriteCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SpriteCore {
      loaded = false
      props = props
      texture: SpriteTexture
      Instance: SpriteConstructor = SpriteInterface

      load(scene: SceneType): LoadingProgress {
        if (this.loaded) {
          return new LoadingProgress().complete()
        } else {
          if (this.props.url) {
            const progress = AssetsController.getFileFromUrl(this.props.url, this.props.cached, AssetType.IMAGE)
            progress.onComplete.add(() => {
              // 8a8f
            })
            return progress
          } else {
            this.texture = new SpriteTexture(scene)
            this.texture.setFromBlank(this.props.width, this.props.height)
            return new LoadingProgress().complete()
          }
        }
      }

      unload(): void {

      }

      spawn(): void {

      }
    }
    SpritesController.register(new _class())
    return _class
  }
}
