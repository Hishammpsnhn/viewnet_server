import ActiveSchema from "../database/models/ActiveSchema";
import moment from "moment-timezone";

class ActiveUserImpl implements ActiveUserImpl {
  async update(count:number): Promise<any> {
    const currentHour = moment().tz("Asia/Kolkata").hour();
    const updatedRecord = await ActiveSchema.findOneAndUpdate(
      { hour: currentHour },
      { $inc: { count: count } },
      { upsert: true, new: true }
    );
    return updatedRecord;
  }

  async getActiveUserCount(): Promise<any[]> {
    console.log("getActiveUserCount")
    const res = await ActiveSchema.find();
    console.log(res)
    return res;
  }
}

export default ActiveUserImpl;
