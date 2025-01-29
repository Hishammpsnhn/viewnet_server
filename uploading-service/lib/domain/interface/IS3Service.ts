import { PresignedUrlParams } from "../../infrastructure/types/s3Types";

// domain/interfaces/IS3Service.ts
export interface IS3Service {
    generatePresignedUrl(params: PresignedUrlParams): Promise<string>;
  }
  