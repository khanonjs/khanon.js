import { Rect } from './rect'

export interface DrawBlockProperties {
  /**
   * Font name (CSS fontface).
   */
  fontName: string

  /**
   * Font size.
   */
  fontSize: number

  /**
   * Text color (HTML format).
   */
  textColor: string

  /**
   * Font style (bold, italic, etc..).
   */
  fontStyle?: string

  /**
   * Background color (Deefault is transparent background).
   */
  bgColor?: string

  /**
   * Center horizontally (*true* by default).
   */
  centerH?: boolean

  /**
   * Center vertically (*true* by default).
   */
  centerV?: boolean

  /**
   * Texture size (Default fits text to whole area).
   */
  textureSize?: Rect
}
