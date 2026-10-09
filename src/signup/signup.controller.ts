import { Controller, Get } from '@nestjs/common';
import { SignupService } from './signup.service.js';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Get()
  signup(): string {
    return this.signupService.signup();
  }

}
