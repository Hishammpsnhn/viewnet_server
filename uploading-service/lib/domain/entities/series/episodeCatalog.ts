export class ResolutionEntity {
  constructor(
    public episodeId: string,
    public key: string,   
    public resolutions: Array<{
      resolution: "1080p" | "720p" | "480p" | "360p" | "auto"; 
      fileUrl: string;
      format: string;  
    }>
  ) {}
}
