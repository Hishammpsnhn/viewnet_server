
class WatchHistory {
  profileId: string;
  videoCatalogId: string;
  progress: number;
  completed: boolean;
  timestamp: Date;
  isHide:boolean;

  constructor(
    profileId: string,
    videoCatalogId: string,
    progress: number = 0,
    completed: boolean = false,
    timestamp: Date = new Date(),
    isHide:boolean = false,
  ) {
    this.profileId = profileId;
    this.videoCatalogId = videoCatalogId;
    this.progress = progress;
    this.completed = completed;
    this.timestamp = timestamp;
    this.isHide = isHide;
  }

  updateProgress(newProgress: number): void {
    if (newProgress < 0 || newProgress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }
    this.progress = newProgress;
    this.completed = newProgress === 100;
    this.timestamp = new Date();
  }
}

export default WatchHistory;
