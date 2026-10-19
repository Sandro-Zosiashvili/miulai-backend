import { HttpException, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private endpoint?: string;

  constructor() {
    this.endpoint = process.env.AWS_ENDPOINT_URL_S3;
    this.bucket = String(process.env.S3_BUCKET);
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'auto',
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      },
    });
  }

  async upload(file: Express.Multer.File) {
    const key = String(file.originalname);
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        }),
      );

      const base = (this.endpoint || '').replace(/\/$/, '');
      const location = base
        ? `${base}/${this.bucket}/${encodeURIComponent(key)}`
        : key;

      return {
        Location: location,
        Key: key,
        Bucket: this.bucket,
      };
    } catch {
      throw new HttpException('Failed to upload file to S3', 500);
    }
  }

  async getPresignedUrl(key: string) {
    try {
      return await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn: 3600 },
      );
    } catch {
      throw new HttpException('Failed to generate presigned URL', 500);
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
