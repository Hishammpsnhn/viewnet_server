// Gateway: External API communication (e.g., payment-sub-service via Gateway)
class SubscriptionGateway {
    constructor(axios) {
      this.axios = axios;
    }
  
    async fetchSubscriptionDetails(userId) {
      try {
        const response = await this.axios.get(`http://payment-sub-service:5002/${userId}/active`);
        console.log("response++++++++++++",response)
        return response.data.userPlan || null;
      } catch (error) {
        console.error('Error fetching subscription details:', error.message);
        return null;
      }
    }
  }
  
export default SubscriptionGateway;
  