import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoginModule } from './login/login.module.js';
import { SignupModule } from './signup/signup.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    LoginModule, 
    SignupModule, 
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local', // TODO: add dynamic support for local and production env files 
    })
  ],
})
export class AppModule {}
