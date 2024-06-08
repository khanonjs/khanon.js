export abstract class Spawnable<I> {
  abstract Instance: I
  abstract spawn(container?: any): void
}
