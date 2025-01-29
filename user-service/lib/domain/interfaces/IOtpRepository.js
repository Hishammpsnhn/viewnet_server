// application/interfaces/OtpRepository.js
class IOtpRepository {
    async saveOtp(key, otp, ttl) {
      throw new Error("Method not implemented");
    }
  
    async getOtp(key) {
      throw new Error("Method not implemented");
    }
  
    async deleteOtp(key) {
      throw new Error("Method not implemented");
    }
  }
  
export default IOtpRepository