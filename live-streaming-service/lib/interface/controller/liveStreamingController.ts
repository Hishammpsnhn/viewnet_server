import { Request, Response } from "express";
import * as LiveStreamService from "../../use-case/liveStreamingUsecase";

export const createLiveStream = async (req: Request, res: Response) => {
  try {
    const stream = await LiveStreamService.createStream();
    res.status(200).json({ success: true, data: stream });
  } catch (error: any) {
    console.error("Error creating live stream:", error);
    res.status(500).json({ error: "Error creating live stream" });
  }
};

export const getLiveStreamDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const streamDetails = await LiveStreamService.getStreamDetails(id);
    res.status(200).json({ success: true, data: streamDetails });
  } catch (error: any) {
    console.error("Error fetching stream details:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch stream details" });
  }
};

export const listActiveStreams = async (_req: Request, res: Response) => {
  try {
    const activeStreams = await LiveStreamService.getActiveStreams();
    res.status(200).json({ success: true, data: activeStreams });
  } catch (error: any) {
    console.error("Error fetching stream list:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch stream details" });
  }
};
export const listAllStreams = async (_req: Request, res: Response) => {
  try {
    const activeStreams = await LiveStreamService.getAllStreams();
    res.status(200).json({ success: true, data: activeStreams });
  } catch (error: any) {
    console.error("Error fetching stream list:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch stream details" });
  }
};
export const getAssets = async (req: Request, res: Response) => {
  const { page } = req.query;
  console.log(req.query)

  try {
    const activeStreams = await LiveStreamService.getAssets(Number(page));
    res.status(200).json({ success: true, data: activeStreams.data });
  } catch (error: any) {
    console.error("Error fetching stream list:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch stream details" });
  }
};

export const stopLiveStream = async (req: Request, res: Response) => {
  try {
    const { streamId } = req.body;
    const response = await LiveStreamService.stopStream(streamId);
    res.status(200).json({ success: true, message: response.message });
  } catch (error: any) {
    console.error("Error stopping the stream:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to stop the stream." });
  }
};
export const removeLiveStream = async (req: Request, res: Response) => {
  try {
    const { streamId } = req.params;
    const response = await LiveStreamService.deleteStream(streamId);
    res.status(200).json({ success: true, message: response.message });
  } catch (error: any) {
    console.error("Error delete the stream:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete the stream." });
  }
};
