export interface SpriteProps {
  /**
   * Load the image file from a url.
   */
  url?: string

  /**
   * Width of the sprite. It is required in case of using a blank texture. Not required if 'cellWidth' is defined.
   */
  width?: number

  /**
   * Height of the sprite. It is required in case of using a blank texture. Not required if 'cellHeight' is defined.
   */
  height?: number

  /**
   * Cells width. Each cell represents an animation frame. It is equivalent to the sprite width.
   * Currently it is only supported all cells of the same size.
   */
  cellWidth?: number

  /**
   * Cells height. Each cell represents an animation frame. It is equivalent to the sprite height.
   * Currently it is only supported all cells of the same size.
   */
  cellHeight?: number

  /**
   * Numnber of frames (total cells).
   */
  numFrames?: number

  /**
   * Defines if the texture has bitmaps (false by default).
   */
  noMipmap?: boolean

  /**
   * Defines if the texture is inverted on Y axis (false by default).
   */
  invertY?: boolean

  /**
   * Defines the sampling mode we want for the texture while fetching from it (BABYLON.Texture.NEAREST_SAMPLINGMODE...) (default: BABYLON.Texture.TRILINEAR_SAMPLINGMODE)
   */
  samplingMode?: number

  /**
   * Cache this sprite.
   * Cached files are kept in memory and only removed after calling KJS.clearCache().
   * Use cached files in case they are being used between more than one scene.
   * Cached sprites make shorter loading time at the expense of memory usage.
   */
  cached?: boolean

  /**
   * Defines the maximum allowed number of sprites for this sprite sheet
   */
  maxAllowedSprites?: number
}
