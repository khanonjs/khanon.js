export abstract class Spawnable<I, P = any> {
  abstract Instance: I
  abstract spawn(container?: any, props?: P): void
}
