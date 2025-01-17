import { MeshAnimation } from './mesh-animation'

export interface MeshProps {
  url?: string
  meshId?: string
  animations?: MeshAnimation[]
  cached?: boolean
  cloneByInstances?: boolean
}
