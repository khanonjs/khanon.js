export abstract class AppInterface {
  abstract onStart(): void
  onClose?(): void
  onError?(error?: any): void
}
