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
      console.log(file.originalname, "esari namee")
      return await this.s3.upload(params).promise();
    } catch {
      throw new HttpException('Failed to upload file to S3', 500);
    }
  }
}
