import {
  from,
  Observable,
  of,
  throwError
} from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import {
  catchError,
  switchMap
} from 'rxjs/operators'

// import { AssetsManager as BabylonJsAssetsManager } from '@babylonjs/core/Misc/assetsManager'    // TODO?
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import * as Misc from '../../misc'
import { TextureProperties } from '../../models/texture-properties'
import { Logger } from '../logger/logger'
import { SpriteTexture } from '../sprite/sprite-texture'

interface AssetsJsonData {
    /**
     * Load the scene
     */
    scene: { url: string }

    /**
     * Load sprite textures on scene
     */
    spriteTextures: { id: string; url: string; cellWidth: number; cellHeight: number }[]

    /**
     * Load meshes on scene
     */
    meshes: { id: string; url: string }[]
}

export class AssetsManager {
  // private babylonjs: BabylonJsAssetsManager   // TODO?
  private readonly spriteTextures: Misc.KeyValue<string, SpriteTexture> = new Misc.KeyValue<string, SpriteTexture>()
  private loadStack: string = ''

  constructor(private readonly babylonJsScene: BabylonJsScene) {}

  release(): void {
    this.spriteTextures.getValues().forEach((spriteTexture) => spriteTexture.release())
    this.spriteTextures.reset()
  }

  loadAssets(jsonUrl: string): Observable<void> {
    this.loadStack = ''
    if (jsonUrl) {
      return fromFetch(jsonUrl).pipe(
        switchMap((response: Response) => {
          if (response.ok) {
            return from(response.json()).pipe(
              switchMap((jsonData: AssetsJsonData) => {
                // Load scene
                if (jsonData.scene) {
                  this.loadScene(jsonData.scene.url)
                }

                // Load sprites textures
                jsonData.spriteTextures?.forEach((textureData) => {
                  this.loadSpriteTexture({
                    id: textureData.id,
                    url: textureData.url,
                    width: textureData.cellWidth,
                    height: textureData.cellHeight
                  })
                })

                // Load meshes
                jsonData.meshes?.forEach((mesh) => {
                  this.loadMesh(mesh.id, mesh.url)
                })
                return of()
              }),
              catchError((error) => {
                return throwError(() => error)
              })
            )
          } else {
            throwError(() => new Error(`Could't load JSON: ${jsonUrl}`))
          }
        }),
        catchError((error) => {
          Logger.error('Error loading assets. Load stack:', this.loadStack)
          return throwError(() => error)
        })
      )
    } else {
      return of()
    }
  }

  addLoadStackItem(definition: string): void {
    this.loadStack += definition + '\n'
  }

  loadScene(url: string): void {
    this.addLoadStackItem('Scene: ' + url)
    const indexSlash = url.lastIndexOf('/') + 1
    const path = url.slice(0, indexSlash)
    const file = url.slice(indexSlash)
    SceneLoader.ShowLoadingScreen = false
    SceneLoader.AppendAsync(path, file, this.babylonJsScene)
  }

  loadSpriteTexture(textureProperties: TextureProperties): SpriteTexture {
    this.addLoadStackItem('SpriteTexture: ' + textureProperties.id)
    const spriteTexture = new SpriteTexture(textureProperties.id, this.babylonJsScene)
    spriteTexture.setFromUrl(textureProperties.url, textureProperties.width, textureProperties.height)
    this.spriteTextures.add(textureProperties.id, spriteTexture)
    return spriteTexture
  }

  loadMesh(id: string, url: string): void {
    this.addLoadStackItem('Mesh: ' + id)
    // TODO
  }

  /**
     * Returns existing instance of SpriteManager or create a new one.
     *
     * @param textureProperties
     * @returns
     */
  getSpriteTexture(textureProperties: TextureProperties): SpriteTexture {
    const spriteTexture: SpriteTexture = this.spriteTextures.get(textureProperties.id)
    if (spriteTexture) {
      return spriteTexture
    } else if (textureProperties.url) {
      return this.loadSpriteTexture(textureProperties)
    } else {
      Logger.error('SpriteTexture not loaded:', textureProperties.url)
    }
  }

  loadBlender3D(url: string): void {}
}
