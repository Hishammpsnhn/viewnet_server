
class WatchHistory {
  profileId: string;
  videoCatalogId: string;
  progress: number;
  completed: boolean;
  timestamp: Date;

  constructor(
    profileId: string,
    videoCatalogId: string,
    progress: number = 0,
    completed: boolean = false,
    timestamp: Date = new Date()
  ) {
    this.profileId = profileId;
    this.videoCatalogId = videoCatalogId;
    this.progress = progress;
    this.completed = completed;
    this.timestamp = timestamp;
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
