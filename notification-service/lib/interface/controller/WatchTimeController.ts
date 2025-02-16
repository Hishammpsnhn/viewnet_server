import { Request, Response } from "express";
import WatchTimeService from "../../domain/interface/IWatchTime";

class WatchTimeController {
    async getWatchTime(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.query as { userId: string };
            const data = await WatchTimeService.getWatchTime(userId);
            res.json({ success:true, data });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch watch time" });
        }
    }
}

export default new WatchTimeController();
