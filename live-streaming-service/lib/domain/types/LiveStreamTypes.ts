
export interface CreateStreamDTO {
  title?: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  assetsId?: string;
  thumbnailUrl: string;
  streamId: string;
}

export interface AssetDetails {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  // Add other relevant fields
}

export interface PaginationParams {
  page: number;
  limit: number;
}
