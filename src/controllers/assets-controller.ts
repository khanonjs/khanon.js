import { CreateSoundBufferAsync } from '@babylonjs/core/AudioV2/abstractAudio/audioEngineV2'
import { LoadFile } from '@babylonjs/core/Misc/fileTools'

import {
  Asset,
  AssetDataMesh,
  AssetDefinition,
  AssetType,
  LoadingProgress
} from '../base'
import { ActorActionCore } from '../decorators/actor/actor-action/actor-action-core'
import { ActorActionInterface } from '../decorators/actor/actor-action/actor-action-interface'
import { ActorCore } from '../decorators/actor/actor-core'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { ActorStateCore } from '../decorators/actor/actor-state/actor-state-core'
import { ActorStateInterface } from '../decorators/actor/actor-state/actor-state-interface'
import { MeshCore } from '../decorators/mesh/mesh-core'
import { MeshInterface } from '../decorators/mesh/mesh-interface'
import { ParticleCore } from '../decorators/particle/particle-core'
import { ParticleInterface } from '../decorators/particle/particle-interface'
import { SceneActionCore } from '../decorators/scene/scene-action/scene-action-core'
import { SceneActionInterface } from '../decorators/scene/scene-action/scene-action-interface'
import { SceneConstructor } from '../decorators/scene/scene-constructor'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateCore } from '../decorators/scene/scene-state/scene-state-core'
import { SceneStateInterface } from '../decorators/scene/scene-state/scene-state-interface'
import { SoundInterface } from '../decorators/sound/sound-interface'
import { SpriteCore } from '../decorators/sprite/sprite-core'
import { SpriteInterface } from '../decorators/sprite/sprite-interface'
import { Logger } from '../modules/logger'
import { isPrototypeOf } from '../utils/utils'
import { ActorStatesController } from './actor-states-controller'
import { ActorActionsController } from './actors-actions-controller'
import { ActorsController } from './actors-controller'
import { MeshesController } from './meshes-controller'
import { ParticlesController } from './particles-controller'
import { SceneActionsController } from './scene-actions-controller'
import { SceneStatesController } from './scene-states-controller'
import { ScenesController } from './scenes-controller'
import { SoundsController } from './sounds-controller'
import { SpritesController } from './sprites-controller'

export class AssetsController {
  private static assets: Map<string, Asset<SceneInterface>> = new Map<string, Asset<SceneInterface>>()

  static getAsset</* Definition data */ D>(url: string | string[]): Asset<SceneInterface, D> | undefined {
    return this.assets.get(AssetsController.getAssetName(url))
  }

  /**
   * Get all assets definitions within a source class decorator *props* (Scene, State, Actor, Sprite, Mesh, GUI, Particle, etc..)
   */
  static findAssetsDefinitions(source: any, urls: object = {}): AssetDefinition[] {
    let definitions: AssetDefinition<any, any>[] = []
    if (typeof source === 'object') {
      for (const property of Object.values(source)) {
        if (Array.isArray(property)) {
          property.forEach(element => {
            if (isPrototypeOf(SceneStateInterface, element)) {
              const state = SceneStatesController.get<SceneStateCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(state.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(state.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(ActorStateInterface, element)) {
              const state = ActorStatesController.get<ActorStateCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(state.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(state.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(ActorActionInterface, element)) {
              const action = ActorActionsController.get<ActorActionCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(action.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(action.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(SceneActionInterface, element)) {
              const action = SceneActionsController.get<SceneActionCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(action.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(action.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(ActorInterface, element)) {
              const actor = ActorsController.get<ActorCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(actor.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(actor.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(ParticleInterface, element)) {
              const particle = ParticlesController.get<ParticleCore>(element)
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(particle.props, urls)]
              definitions = [...definitions, ...AssetsController.findAssetsDefinitions(particle.Instance._metadata.getProps(), urls)]
            } else if (isPrototypeOf(SpriteInterface, element)) {
              const sprite = SpritesController.get<SpriteCore>(element)
              if (sprite.props.url && !urls[sprite.props.url]) {
                urls[sprite.props.url] = true
                definitions = [...definitions, {
                  url: sprite.props.url,
                  type: AssetType.IMAGE
                }]
              }
            } else if (isPrototypeOf(MeshInterface, element)) {
              const mesh = MeshesController.get<MeshCore>(element)
              if (mesh.props.url && !urls[mesh.props.url]) {
                urls[mesh.props.url] = true
                const indexSlash = mesh.props.url.lastIndexOf('/') + 1
                const path = mesh.props.url.slice(0, indexSlash)
                const file = mesh.props.url.slice(indexSlash)
                definitions = [...definitions, {
                  url: mesh.props.url,
                  type: AssetType.MESH,
                  data: {
                    path,
                    file
                  }
                }]
              }
            } else if (isPrototypeOf(SoundInterface, element)) {
              const sound = SoundsController.get<SoundInterface>(element)
              if (!sound._props.stream) {
                urls[AssetsController.getAssetName(sound._props.url)] = true
                definitions = [...definitions, {
                  url: sound._props.url,
                  type: AssetType.AUDIO
                }]
              }
            }
          })
        }
      }
    }
    return definitions
  }

  /**
   * Loads all assets of a Scene
   */
  static sceneLoad(scene: SceneInterface): LoadingProgress {
    const progress = new LoadingProgress()
    if (scene._assets.length === 0) {
      progress.complete()
    } else {
      const progresses: LoadingProgress[] = []
      scene._assets.forEach(assetDef => {
        const asset: Asset<SceneInterface> | undefined = AssetsController.assets.get(assetDef.url)
        if (asset) {
          asset.addSource(scene)
          progresses.push(asset.progress)
        } else {
          switch (assetDef.type) {
          case AssetType.AUDIO:
            progresses.push(AssetsController.loadAudioFromUrl(assetDef, scene))
            break
          default:
            progresses.push(AssetsController.loadFileFromUrl(assetDef, scene))
          }
        }
      })
      progress.fromNodes(progresses)
    }
    return progress
  }

  /**
   * Remove assets without sources.
   * @param nextScenes Keep the assets of the next scene to load.
   */
  static purgeAssets(nextScenes?: SceneConstructor[]) {
    const assetsToDelete: string[] = []
    let nextAssetsDefinition: string[] = []
    nextScenes?.forEach(scene => {
      const sceneAssets = AssetsController.findAssetsDefinitions(ScenesController.get(scene)._props)
      nextAssetsDefinition = [...nextAssetsDefinition, ...sceneAssets.map(asset => asset.url)]
    })
    AssetsController.assets.forEach((asset, key) => {
      if (!asset.hasSources() && !nextAssetsDefinition.includes(key)) {
        assetsToDelete.push(key)
      }
    })
    assetsToDelete.forEach(key => {
      AssetsController.assets.get(key)?.remove()
      AssetsController.assets.delete(key)
      Logger.debug(`Asset removed: '${key}'`)
    })
  }

  private static getAssetName(url: string | string[]): string {
    if (Array.isArray(url)) {
      return url.join(':')
    } else {
      return url
    }
  }

  /**
   * Loads a non-existing asset. This method is called after checking 'definition.url' has no associated asset.
   * @param definition
   * @param source
   * @returns
   */
  private static loadFileFromUrl(definition: AssetDefinition, source: SceneInterface): LoadingProgress {
    const asset = new Asset(definition, source)
    AssetsController.assets.set(definition.url, asset)
    const throwError = (errorMsg: string) => {
      Logger.error(errorMsg)
      asset.progress.error(errorMsg)
      asset.progress.onError.notifyObservers(errorMsg)
    }
    LoadFile(definition.url,
      (data) => {
        Logger.debug(`LoadFileFromUrl: Loaded '${definition.url}'`)
        const buffer = data as ArrayBuffer
        switch (definition.type) {
        case AssetType.IMAGE:
          asset.setObjectURL(buffer)
          break
        case AssetType.MESH:
          asset.setFile(buffer, (definition.data as AssetDataMesh).file)
          break
        default:
          asset.setBuffer(buffer)
        }
        asset.progress.complete()
      },
      (progress) => {
        asset.progress.setProgress(progress.loaded / progress.total)
      },
      undefined,
      true,
      (_error, exception) => {
        throwError(`LoadFileFromUrl: Error loading file '${definition.url}': ${exception}`)
      }
    )
    return asset.progress
  }

  private static loadAudioFromUrl(definition: AssetDefinition<any, string | string[]>, source: SceneInterface): LoadingProgress {
    const asset = new Asset(definition, source)
    AssetsController.assets.set(AssetsController.getAssetName(definition.url), asset)
    const throwError = (errorMsg: string) => {
      Logger.error(errorMsg)
      asset.progress.error(errorMsg)
      asset.progress.onError.notifyObservers(errorMsg)
    }
    CreateSoundBufferAsync(definition.url)
      .then((audioBuffer) => {
        Logger.debug(`LoadAudioFromUrl: Loaded '${definition.url}'`)
        asset.setAudioBuffer(audioBuffer)
        asset.progress.complete()
      })
      .catch((error) => {
        throwError(`LoadAudioFromUrl: Error loading file '${definition.url}': ${error}`)
      })
    return asset.progress
  }
}
