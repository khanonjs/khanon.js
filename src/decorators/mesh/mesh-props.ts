import { MeshAnimation } from './mesh-animation'

export interface MeshProps {
  url?: string
  animations?: MeshAnimation[]
  cached?: boolean
  cloneByInstances?: boolean
  renderingGroupId?: number
}
