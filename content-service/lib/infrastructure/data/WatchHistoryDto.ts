export interface WatchHistoryDTO {
    profileId: string;
    videoCatalog: {
      _id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      genre:string;
    };
    progress: number;
    completed: boolean;
    timestamp: Date;
  }
  