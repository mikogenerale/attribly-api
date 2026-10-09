import { Controller, Get, Version } from '@nestjs/common';
import { LoginService } from './login.service.js';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Get()
    login(): string {
        return this.loginService.login();
    }
    
    @Get('supabase')
    getSupabaseData(): string {
        return this.loginService.getSupabaseData();
    }
}
