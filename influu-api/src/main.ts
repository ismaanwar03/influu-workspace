import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.enableCors({
    origin: [
      config.get('APP_URL', 'http://localhost:3000'),
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:4000/api/v1',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  })

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  if (config.get('NODE_ENV') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('Influu.pk API')
      .setDescription('Creator Escrow Platform — Pakistan')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth')
      .addTag('campaigns')
      .addTag('contracts')
      .addTag('payments')
      .addTag('social')
      .addTag('notifications')
      .build()
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc))
  }

  const port = config.get<number>('PORT', 4000)
  await app.listen(port)
  console.log(`🚀 Influu API → http://localhost:${port}/api/v1`)
  console.log(`📖 Swagger  → http://localhost:${port}/api/docs`)
}
bootstrap()
