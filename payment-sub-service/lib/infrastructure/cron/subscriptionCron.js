import cron from 'node-cron'
import SubscriptionRepository from '../repository/userSubscription/userSubscription.js' ;
import updateSubscriptions from '../../use-cases/userSubscription/updateSubscription.js'
function subscriptionCron() {
    cron.schedule('0 * * * *', async () => {
        console.log('Cron Job: Checking subscription statuses...');
        const repository = new SubscriptionRepository();

        try {
            await updateSubscriptions(repository);
            console.log('Cron Job: Subscription status updates completed.');
        } catch (error) {
            console.error('Cron Job: Error updating subscription statuses:', error);
        }
    });
}

export default subscriptionCron; 