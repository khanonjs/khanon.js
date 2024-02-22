export interface SpriteProps {
  /**
   * Load the image file from a url
   */
  url?: string

  /**
   * Cells width, in case it is a single image, it represents the image width (required if the sprite is loaded through url)
   */
  cellWidth?: number

  /**
   * Cells height, in case it is a single image, it represents the image height (required if the sprite is loaded through url)
   */
  celHeight?: number

  /**
   * Converts the url image file to a dynamic texture and calls (false by default)
   * If true, this option creates a DynamicTexture from the image file and calls 'fomDynamicTexture' method with the image file texture as argument.
   * In that way the image can be modified manually.
   */
  toDynamicTexture?: boolean

  /**
   * Cache this sprite.
   * Cached files are kept in memory and only removed after calling KJS.clearCache() method.
   * Use cached files in case they are being used between more than one scene.
   * Cached files have a shorter loading time at the expense of memory usage.
   */
  cached?: boolean
}
