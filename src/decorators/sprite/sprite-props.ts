import { TextureOptions } from '../../babylon-config'

export interface SpriteProps {
  /**
   * Load the image file from a url.
   */
  url?: string

  /**
   * Width of the sprite. It is required in case of using a blank texture. Not required if the url is defined.
   */
  width?: number

  /**
   * Height of the sprite. It is required in case of using a blank texture. Not required if the url is defined.
   */
  height?: number

  /**
   * Cells width. In case the image contains a single cell it represents the image width.
   */
  cellWidth?: number

  /**
   * Cells height. In case the image contains a single cell it represents the image height.
   */
  celHeight?: number

  /**
   * Set the generated texture options
   */
  textureOptions?: TextureOptions

  /**
   * Cache this sprite.
   * Cached files are kept in memory and only removed after calling KJS.clearCache().
   * Use cached files in case they are being used between more than one scene.
   * Cached files have a shorter loading time at the expense of memory usage.
   */
  cached?: boolean

  /**
   * Defines the maximum allowed number of sprites for this sprite sheet
   */
  maxAllowedSprites?: number
}
