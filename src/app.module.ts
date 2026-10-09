import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoginModule } from './login/login.module.js';
import { SignupModule } from './signup/signup.module.js';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [LoginModule, SignupModule],
})
export class AppModule {}
