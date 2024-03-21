import { LoadingProgress } from '../models'

// Image
// Mesh
// Sound
// Music
// Fonts

interface CachedFile {
  type: string // (enum)
  data: Buffer
}

export class AssetsController {
  private cachedFiles: CachedFile[]

  static getUrl(url: string, cached?: boolean) {
    console.log('aki LOAD URL:', url)
  }

  /* public loadScene(): LoadingProgress {
    return null
  }

  public loadGUI(): LoadingProgress {
    return null
  } */
}
