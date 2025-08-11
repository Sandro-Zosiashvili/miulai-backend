import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-north-1',
      signatureVersion: 'v4',
    });
  }

  async upload(file: Express.Multer.File) {
    const params = {
      Bucket: String(process.env.BUCKET_NAME),
      Key: String(file.originalname),
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-north-1',
      },
    };

    try {
      return await this.s3.upload(params).promise();
    } catch {
      throw new HttpException('Failed to upload file to S3', 500);
    }
  }

  async getPresignedUrl(key: string) {
    const params = {
      Bucket: String(process.env.BUCKET_NAME),
      Key: key,
      Expires: 3600,
    };
    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch {
      throw new HttpException('Failed to generate presigned URL', 500);
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({
          Bucket: String(process.env.BUCKET_NAME),
          Key: key,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }
}
