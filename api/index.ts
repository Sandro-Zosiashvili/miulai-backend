import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
// Import the AppModule compiled by `nest build` (tsc, with decorator metadata).
// The thin wrapper below is the only file bundled by Vercel's esbuild, so the
// decorated Nest/TypeORM classes keep their emitted metadata.
import { AppModule } from '../dist/app.module';

const expressApp = express();
let bootstrapPromise: Promise<void> | undefined;

// Bootstrap Nest once per warm serverless instance and reuse it across invocations.
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Keep behaviour identical to src/main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Authorization', 'Set-Cookie'],
  });

  // Serverless: initialise the app (wire routes onto expressApp) without listening.
  await app.init();
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = bootstrap();
    }
    await bootstrapPromise;
  } catch (err) {
    // Don't cache a failed bootstrap: let the next invocation retry.
    bootstrapPromise = undefined;
    throw err;
  }
  expressApp(req, res);
}
