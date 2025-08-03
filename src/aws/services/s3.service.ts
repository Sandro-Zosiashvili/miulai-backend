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
      Bucket: 'miulai-music',
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
      console.log(process.env.AWS_ACCESS_KEY);
      throw new HttpException('Failed to upload file to S3', 500);
    }
  }

  async getPresignedUrl(key: string) {
    const params = {
      Bucket: 'miulai-music', // Bucket-ის სახელი
      Key: key, // ფაილის სახელი (Key) S3-ზე
      Expires: 3600, // URL-ის ვადა (წამებში)
    };
    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch {
      console.log(key, 'modis modisedvefdvdf ');

      throw new HttpException('Failed to generate presigned URL', 500);
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({
          Bucket: 'miulai-music',
          Key: key,
        })
        .promise();
      return true;
    } catch (error) {
      console.error(`Failed to delete file ${key}:`, error);
      return false;
    }
  }
}
