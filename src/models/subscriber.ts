import { Subscription } from 'rxjs'

export class Subscriber {
  private subscriptions: Subscription[] = []

  protected addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription)
  }

  protected releaseSubscriptions(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
    this.subscriptions = []
  }
}
