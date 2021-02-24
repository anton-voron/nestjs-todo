import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const server = config.get('server');
  const port = process.env.PORT || server.port;
  await app.listen(port);
  logger.log(`app started on http://127.0.0.1:${port}`);
}
bootstrap();
