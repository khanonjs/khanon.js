import { TextureOptions } from '../../babylon-interfaces'

export interface SpriteProps {
  /**
   * Load the image file from a url.
   * In case 'url' is not defined, the method 'fomDynamicTexture' will be called with 'undefined' argument to allow the creation of a texture manually.
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
   * Converts the image file to a dynamic texture and calls fromDynamicTexture. (false by default)
   * If true, this option creates a DynamicTexture from the url image file and calls 'fomDynamicTexture' method with the argument as a DynamicTexture.
   * In that way the image can be modified manually.
   */
  toDynamicTexture?: boolean

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
}
