export interface Timeout {
  func: () => void
  oms: number
  ms: number
  context: any
}
