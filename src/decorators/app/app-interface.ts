export abstract class AppInterface {
  onStart?(): void
  onError?(error?: string): void
  onClose?(): void
}
