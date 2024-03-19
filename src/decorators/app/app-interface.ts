export abstract class AppInterface {
  onStart?(): void
  onClose?(): void
  onError?(error?: any): void
}
