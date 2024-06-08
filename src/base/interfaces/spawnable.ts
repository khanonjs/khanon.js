export abstract class Spawnable<I, R> {
  abstract Instance: I
  abstract InstanceReference: R
  abstract spawn(container?: any): void
}
