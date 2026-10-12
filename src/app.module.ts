import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoginModule } from './login/login.module.js';
import { SignupModule } from './signup/signup.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [LoginModule, SignupModule, AuthModule.forRoot({ auth })],
})
export class AppModule {}
