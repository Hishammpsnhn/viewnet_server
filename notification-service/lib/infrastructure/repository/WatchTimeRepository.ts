import WatchTime, { IWatchTime } from "../database/models/WatchTime";

class WatchTimeRepository {
  async updateWatchTime(
    userId: string,
    watchTime: number
  ): Promise<IWatchTime | null> {
    const date = new Date().toISOString().split("T")[0];
    return await WatchTime.findOneAndUpdate(
      { userId, date },
      { $inc: { watchTime } },
      { upsert: true, new: true }
    );
  }

  async getWatchTime(
    userId: string
  ): Promise<{ day: string; watchTime: number }[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const watchTimes = await WatchTime.aggregate([
      {
        $match: {
          userId,
          date: { $gte: sevenDaysAgo.toISOString().split("T")[0] }, 
        },
      },
      {
        $group: {
          _id: "$date",
          watchTime: { $sum: "$watchTime" }, 
        },
      },
      {
        $sort: { _id: 1 }, 
      },
    ]);

    return watchTimes.map(({ _id, watchTime }) => ({
      day: new Date(_id).toLocaleDateString("en-US", { weekday: "short" }),
      watchTime: +(watchTime / 3600).toFixed(2), 
    }));
  }
}

export default new WatchTimeRepository();
