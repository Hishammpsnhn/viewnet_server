import mux from "../config/muxConfig";

export const createLiveStream = async () => {
  return await mux.video.liveStreams.create({
    playback_policy: ["public"],
    new_asset_settings: { playback_policy: ["public"] },
  });
};

export const getLiveStreamDetails = async (id: string) => {
  return await mux.video.liveStreams.retrieve(id);
};

export const listLiveStreams = async () => {
  return await mux.video.liveStreams.list();
};

export const disableLiveStream = async (streamId: string) => {
  return await mux.video.liveStreams.disable(streamId);
};
export const removeLiveStream = async (streamId: string) => {
  console.log("stream id for delete", streamId);
  return await mux.video.liveStreams.delete(streamId);
};
export const getAssets = async (page: number, limit: number = 5) => {
  const res = await mux.video.assets.list({ limit, page });
  console.log(res);
  return res;
};
