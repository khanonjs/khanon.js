import { LoadingProgress } from '../../base'
import { SpriteConstructor } from '../../constructors'
import { AssetsController } from '../../controllers/assets-controller'
import { SpritesController } from '../../controllers/sprites-controller'
import { applyDefaults } from '../../helpers/utils'
import {
  AssetType,
  BabylonContainer
} from '../../models'
import { SceneType } from '../scene/scene-type'
import { SpriteCore } from './sprite-core'
import { SpriteInstance } from './sprite-instance'
import { SpriteInterface } from './sprite-interface'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { spritePropsDefault } from './sprite.props.deafult'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SpriteCore & SpriteInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SpriteCore, SpriteInterface {
      babylon: Pick<BabylonContainer, 'spriteManager'>
      loaded = false
      props = applyDefaults(props, spritePropsDefault)
      texture: SpriteTexture
      Instance: () => SpriteInstance = () => SpriteInstance // 8a8f

      onLoaded?(): void

      load(scene: SceneType): LoadingProgress {
        if (this.loaded) {
          this.onLoaded()
          return new LoadingProgress().complete()
        } else {
          if (this.props.url) {
            const progress = AssetsController.getFileFromUrl(this.props.url, this.props.cached, AssetType.IMAGE)
            progress.onComplete.add(this.onLoaded)
            progress.onComplete.add((buffer) => {
              this.texture = new SpriteTexture(scene, this.props)
              this.texture.setFromArrayBuffer(buffer)
              this.onLoaded()
            })
            return progress
          } else {
            this.texture = new SpriteTexture(scene, this.props)
            this.texture.setFromBlank()
            this.onLoaded()
            return new LoadingProgress().complete()
          }
        }
      }

      unload(): void {

      }

      spawn(): void {
        // const instance = new SpriteInstance()
      }
    }
    SpritesController.register(new _class())
    return _class
  }
}
