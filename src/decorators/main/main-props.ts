import { MainPropLoopUpdate } from './main-props-loop-update'

export interface MainProps {
  name: string
  canvas: HTMLCanvasElement
  loopUpdate: MainPropLoopUpdate
  onAppError?: (message: string, data?: unknown) => void
}
