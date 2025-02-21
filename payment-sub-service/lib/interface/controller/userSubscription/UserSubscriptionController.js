import GetUserPlanDetail from "../../../use-cases/userSubscription/GetUserPlan.js";
import GetCountOfUserPlan from "../../../use-cases/userSubscription/getCountOfUserPlan.js";
import UserNewPlanRepository from "../../../infrastructure/repository/userSubscription/userSubscription.js";

const userPlanRepository = new UserNewPlanRepository();
export async function GetUserPlan(req, res) {
  const { userId } = req.params;
  try {
    const userPlan = await GetUserPlanDetail(userId, {
      userPlanRepository: userPlanRepository,
    });
    res.status(200).json({ success: true, userPlan });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}
export async function GetUserActivePlan(req, res) {
  const { userId } = req.params;

  try {
    const userPlan = await GetUserPlanDetail(userId, {
      userPlanRepository: userPlanRepository,
    });
    res.status(200).json({ success: true, userPlan });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}
export async function GetUserPlanCount(req, res) {
  try {
    const count = await GetCountOfUserPlan({
      userPlanRepository: userPlanRepository,
    });
    res.status(200).json({ success: true, data: count });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}
