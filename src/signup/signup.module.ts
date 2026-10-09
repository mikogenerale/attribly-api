import { Module } from '@nestjs/common';
import { SignupService } from './signup.service.js';
import { SignupController } from './signup.controller.js';

@Module({
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule {}
