import axios, { AxiosInstance, AxiosResponse } from "axios";
import environment from "../infrastructure/config/environment";
class UserGateway {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async fetchUser(): Promise<any> {
    try {
      const { data }: AxiosResponse = await this.axios.get(
        `${environment.USER_SERVICE_URL}/users?page=1&limit=20`
      );
      if (data.success) {
        return data.users;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching subscription details:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      return [];
    }
  }
}

export default UserGateway;
