import { LoadingProgress } from '../models'

// Sprite
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

  public loadScene(): LoadingProgress {
    return null
  }

  public loadGUI(): LoadingProgress {
    return null
  }
}