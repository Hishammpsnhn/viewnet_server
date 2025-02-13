export class LiveStream {
    constructor(
      private readonly props: {
        id?: string;
        title?: string;
        description?: string;
        genre?: string;
        isPrivate: boolean;
        assetsId?: string;
        thumbnailUrl: string;
        streamId: string;
        createdAt?: Date;
        updatedAt?: Date;
      }
    ) {}
  
    get id(): string | undefined {
      return this.props.id;
    }
  
    get title(): string | undefined {
      return this.props.title;
    }
  
    get description(): string | undefined {
      return this.props.description;
    }
  
    get genre(): string | undefined {
      return this.props.genre;
    }
  
    get isPrivate(): boolean {
      return this.props.isPrivate;
    }
  
    get assetsId(): string | undefined {
      return this.props.assetsId;
    }
  
    get thumbnailUrl(): string {
      return this.props.thumbnailUrl;
    }
  
    get streamId(): string {
      return this.props.streamId;
    }
  
    get createdAt(): Date | undefined {
      return this.props.createdAt;
    }
  
    get updatedAt(): Date | undefined {
      return this.props.updatedAt;
    }
  
    public updateTitle(title: string): void {
      this.props.title = title;
      this.props.updatedAt = new Date();
    }
  
    public updateDescription(description: string): void {
      this.props.description = description;
      this.props.updatedAt = new Date();
    }
  
    public updatePrivacy(isPrivate: boolean): void {
      this.props.isPrivate = isPrivate;
      this.props.updatedAt = new Date();
    }
  
    public updateThumbnail(thumbnailUrl: string): void {
      this.props.thumbnailUrl = thumbnailUrl;
      this.props.updatedAt = new Date();
    }
  }