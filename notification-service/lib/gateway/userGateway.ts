import axios, { AxiosInstance, AxiosResponse } from "axios";

class UserGateway {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async fetchUser(): Promise<any> {
    try {
      const { data }: AxiosResponse = await this.axios.get(
        `http://user-service:5000/users?page=1&limit=20`
      );
      console.log(data)
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
