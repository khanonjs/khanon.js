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

export class AssetController {
  private cachedFiles: CachedFile[]

  /*public loadScene(): LoadingProgress {
    return null
  }

  public loadGUI(): LoadingProgress {
    return null
  }*/
}