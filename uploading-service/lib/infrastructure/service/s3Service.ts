// infrastructure/services/S3Service.ts
import { S3 } from 'aws-sdk';
import { IS3Service } from '../../domain/interface/IS3Service';
import { PresignedUrlParams } from '../types/s3Types';
import env from "../config/environment";
export class S3Service implements IS3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      region: env.AWS_REGION,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async generatePresignedUrl(params: PresignedUrlParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          return reject(err);
        }
        resolve(url);
      });
    });
  }
}
