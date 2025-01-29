class OtpUseCase {
  constructor(otpRepository) {
    this.otpRepository = otpRepository;
  }
  async generateAndSaveOtp(key, value) {
    await this.otpRepository.saveOtp(key, value);
    return value;
  }

  async verifyOtp(key, value) {
    const storedOtp = await this.otpRepository.getOtp(key);

    if (storedOtp && storedOtp === value) {
      await this.otpRepository.deleteOtp(key);
      return true;
    }
    return false;
  }
  async verifyKey(key) {
    const storedVal = await this.otpRepository.getOtp(key);

    if (storedVal == "false") {
      return false;
    }
    return storedVal;
  }
  async updateVal(key, value) {
    await this.otpRepository.saveOtp(key, value);
    const res = await this.otpRepository.getOtp(key);
    console.log("storedval", res);
    if (res != "false") {
      return true;
    }
    return false;
  }
}

export default OtpUseCase;
