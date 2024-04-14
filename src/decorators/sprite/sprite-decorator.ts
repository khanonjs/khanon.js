import { LoadingProgress } from '../../base'
import { SpriteConstructor } from '../../constructors'
import { AssetsController } from '../../controllers/assets-controller'
import { SpritesController } from '../../controllers/sprites-controller'
import {
  applyDefaults,
  invokeCallback
} from '../../helpers/utils'
import { BabylonAccessor } from '../../models'
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
      babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'>
      props = applyDefaults(props, spritePropsDefault)
      textures: Map<SceneType, SpriteTexture> = new Map<SceneType, SpriteTexture>()
      Instance: () => SpriteInstance = () => SpriteInstance // 8a8f

      onLoaded?(): () => void

      load(scene: SceneType): LoadingProgress {
        const callLoaded = () => {
          invokeCallback(this.onLoaded, this, scene)
        }
        const progress = new LoadingProgress().complete()
        if (this.textures.get(scene)) {
          callLoaded()
          return progress.complete()
        } else {
          if (this.props.url) {
            const asset = AssetsController.getAsset(this.props.url)
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromArrayBuffer(asset.buffer)
            this.babylon = texture.babylon
            this.textures.set(scene, texture)
            callLoaded()
            return progress
          } else {
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromBlank()
            this.babylon = texture.babylon
            this.textures.set(scene, texture)
            callLoaded()
            return progress.complete()
          }
        }
      }

      unload(scene: SceneType): void {

      }
    }
    SpritesController.register(new _class())
    return _class
  }
}
