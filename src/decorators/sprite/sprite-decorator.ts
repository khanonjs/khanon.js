import { LoadingProgress } from '../../base'
import { SpriteConstructor } from '../../constructors'
import { AssetsController } from '../../controllers/assets-controller'
import { SpritesController } from '../../controllers/sprites-controller'
import {
  applyDefaults,
  invokeCallback
} from '../../helpers/utils'
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
import { SpriteType } from './sprite-type'
import { spritePropsDefault } from './sprite.props.deafult'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): SpriteType }>(constructor: T & SpriteType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SpriteCore, SpriteInterface {
      babylon: Pick<BabylonContainer, 'spriteManager' | 'scene'>
      props = applyDefaults(props, spritePropsDefault)
      textures: Map<SceneType, SpriteTexture> = new Map<SceneType, SpriteTexture>()
      Instance: () => SpriteInstance = () => SpriteInstance // 8a8f

      onLoaded?(): () => void

      load(scene: SceneType): LoadingProgress {
        const callLoaded = () => {
          invokeCallback(this.onLoaded, this, scene)
        }
        if (this.textures.get(scene)) {
          callLoaded()
          return new LoadingProgress().complete()
        } else {
          if (this.props.url) {
            const progress = AssetsController.getFileFromUrl(this.props.url, this.props.cached, AssetType.IMAGE)
            progress.onComplete.add((buffer) => {
              const texture = new SpriteTexture(scene, this.props)
              texture.setFromArrayBuffer(buffer)
              this.babylon = texture.babylon
              this.textures.set(scene, texture)
              callLoaded()
            })
            return progress
          } else {
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromBlank()
            this.babylon = texture.babylon
            this.textures.set(scene, texture)
            callLoaded()
            return new LoadingProgress().complete()
          }
        }
      }

      unload(): void {

      }

      spawn(): void {
        console.log('aki SPAWN!')
        // const instance = new SpriteInstance()
      }
    }
    SpritesController.register(new _class())
    return _class
  }
}
