import Subscription from '../../domain/entities/UserSubscription.js'

async function updateSubscriptions(repository, currentDate = new Date()) {
    // Expire active subscriptions
    const activeSubscriptions = await repository.findActiveSubscriptions();
    for (const subData of activeSubscriptions) {
        const subscription = new Subscription(subData);
        if (subscription.isExpired(currentDate)) {
            await repository.updateStatus(subscription.id, 'expired');
        }
    }

    // Active queued subscriptions
    const queuedSubscriptions = await repository.findQueuedSubscriptions();
    for (const subData of queuedSubscriptions) {
        const subscription = new Subscription(subData);
        if (subscription.canBeActivated(currentDate)) {
            await repository.updateStatus(subscription.id, 'active');
        }
    }
}

export default updateSubscriptions;
