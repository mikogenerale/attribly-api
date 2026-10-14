import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ENV_FILE } from './config/env.js';
import { EmailModule } from './email/email.module.js';
import { EmailService } from './email/email.service.js';
import { createAuth } from './auth/auth.js';
import { StoreModule } from './dashboard/store/store.module.js';
import { DatabaseModule, PG_POOL } from './database/database.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import type { Pool } from 'pg';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ENV_FILE }),
    DatabaseModule,
    EmailModule,
    AuthModule.forRootAsync({
      imports: [EmailModule, DatabaseModule],
      inject: [ConfigService, EmailService, PG_POOL],
      useFactory: (config: ConfigService, email: EmailService, pool: Pool) => ({
        auth: createAuth(config, email, pool),
      }),
    }),
    ProjectsModule,
    StoreModule,
  ],
})
export class AppModule {}