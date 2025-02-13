import * as LiveStreamRepo from "../infrastructure/repository/liveStreamRepository";

export const createStream = async (data: any) => {
  const newStream = await LiveStreamRepo.createLiveStream(data);
  
  return newStream;
};

export const getStreamDetails = async (id: string) => {
  return await LiveStreamRepo.getLiveStreamDetails(id);
};

export const getActiveStreams = async () => {
  const streams = await LiveStreamRepo.listLiveStreams();
  return streams;
};

export const getAllStreams = async () => {
  const streams = await LiveStreamRepo.listLiveStreams();
  return streams;
};

export const stopStream = async (streamId: string) => {
  await LiveStreamRepo.disableLiveStream(streamId);
  return { message: "Stream successfully stopped." };
};

export const deleteStream = async (streamId: string) => {
  await LiveStreamRepo.removeLiveStream(streamId);
  return { message: "Stream successfully stopped." };
};

export const getAssets = async (page: number) => {
  return await LiveStreamRepo.getAssets(page);
};

export const getAssetDetails = async (assetsId: string) => {
  return await LiveStreamRepo.getAssetDetails(assetsId);
};