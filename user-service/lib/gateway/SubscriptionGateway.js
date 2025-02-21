import env from '../infrastructure/config/environment.js'
class SubscriptionGateway {
  constructor(axios) {
    this.axios = axios;
  }

  async fetchSubscriptionDetails(userId) {
    try {
      const response = await this.axios.get(
        `${env.SUBSCRIPTION_SERVICE_URL}/${userId}/active`
      );
      if (response.data?.userPlan.length) {
        return response.data.userPlan[0];
      } else {
        return  null;
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error.message);
      return null;
    }
  }
}

export default SubscriptionGateway;
