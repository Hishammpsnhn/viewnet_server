import { Request, Response } from "express";
import UpdateActiveUser from "../../usecase/updateActiveUsers";
import GetActiveUser from "../../usecase/getActiveUsers";
import ActiveUserImpl from "../../infrastructure/repository/ActiveRepository";
import { HttpStatus } from "../HttpStatus";

const getActiveUser = new GetActiveUser(new ActiveUserImpl());
const updateActiveUser = new UpdateActiveUser(new ActiveUserImpl());
class ActiveUserController {
  // Handler for getting active users
  async getActiveUsers(req: Request, res: Response): Promise<void> {
    try {
      const activeUsers = await getActiveUser.execute();
      res.status(HttpStatus.OK).json({ success: true, data: activeUsers });
    } catch (error) {
      console.error("Error fetching active users:", error);
      res
        .status(HttpStatus.InternalServerError)
        .json({ success: false, message: "Failed to fetch active users" });
    }
  }

  // Handler for updating active users
  async updateActiveUsers(count: number): Promise<void> {
    try {
      await updateActiveUser.execute(count);
    } catch (error) {
      console.error("Error updating active user:", error);
    }
  }
}

export default ActiveUserController;
