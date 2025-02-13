import mux from "../config/muxConfig";
import MuxMetaSchema from "../database/model/StreamMetaData";

export const createLiveStream = async (formData: any) => {
  const data = await mux.video.liveStreams.create({
    playback_policy: ["public"],
    new_asset_settings: { playback_policy: ["public"] },
  });
  
  // const res = await MuxSchema.insertOne(data);
  const res = await MuxMetaSchema.insertOne({
    title: formData.title,
    description: formData.descrption,
    genre: formData.genre,
    streamId: data.id,
  });

  return { stream: data, metadata: res };
};

export const getLiveStreamDetails = async (id: string) => {
  return await mux.video.liveStreams.retrieve(id);
};

export const listLiveStreams = async () => {
  const res = (await mux.video.liveStreams.list({ status: "active" })).data;
  const meta = await Promise.all(
    res.map(async (stream) => {
      const metadata = await MuxMetaSchema.findOne({ streamId: stream.id });
   
      return {
        stream, // Include the stream details
        metadata, // Include the corresponding metadata
      };
    })
  );

  return meta;
};

export const disableLiveStream = async (streamId: string) => {
  const data = await mux.video.liveStreams.retrieve(streamId);
  const res = await MuxMetaSchema.updateOne(
    { streamId: data.id },
    { $set: { assetsId: data.active_asset_id } }
  );


  return await mux.video.liveStreams.disable(streamId);
};
export const removeLiveStream = async (streamId: string) => {
  console.log("stream id for delete", streamId);
  // const res = await MuxSchema.updateOne({id:streamId},{status:'deleted'});
  return await mux.video.liveStreams.delete(streamId);
};
export const getAssets = async (page: number, limit: number = 5) => {
  const res = await MuxMetaSchema.find(
    { assetsId: { $exists: true } }, 
  )
    .skip((page - 1) * limit) // Skip documents for pagination
    .limit(limit); // Limit the number of documents

  return res;
};

export const getAssetDetails = async (id:string) => {
  const res = (await mux.video.assets.retrieve(id))
  // const res = await MuxMetaSchema.find({});

  return res;
};

export const listonGoingStreams = async () => {
  return (await mux.video.liveStreams.list({ status: "active" })).data;
};
