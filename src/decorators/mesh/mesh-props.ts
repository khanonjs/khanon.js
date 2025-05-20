import { MeshAnimation } from './mesh-animation'

export interface MeshProps {
  url?: string
  animations?: MeshAnimation[]
  cloneByInstances?: boolean
  renderingGroupId?: number
}
