import { IS3Service } from "../domain/interface/IS3Service";
import { PresignedUrlParams } from "../infrastructure/types/s3Types";

export class GeneratePresignedUrlUseCase {
  private s3Service: IS3Service;

  constructor(s3Service: IS3Service) {
    this.s3Service = s3Service;
  }

  async execute(
    params: PresignedUrlParams
  ): Promise<{ url: string; fileName: string }> {
    try {
      const url = await this.s3Service.generatePresignedUrl(params);
      
      return { url, fileName: params.Key };
    } catch (error) {
      throw new Error("Failed to generate presigned URL");
    }
  }
}
