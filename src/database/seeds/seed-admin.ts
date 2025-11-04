import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.seedAdmin();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});

