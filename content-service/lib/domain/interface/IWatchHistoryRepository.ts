

import WatchHistory from "../entities/WatchHistory";


export interface IWatchProgressRepository{
  findByProfileAndVideo(profileId: string, videoCatalogId: string): Promise<WatchHistory>;
  save(watchProgress: WatchHistory): Promise<void>;
  getHistoryOfProfile(profileId: string): Promise<WatchHistory[]>;
}