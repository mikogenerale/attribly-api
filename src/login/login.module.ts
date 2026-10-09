import { Module } from '@nestjs/common';
import { LoginController } from './login.controller.js';
import { LoginService } from './login.service.js';
import { SupabaseModule } from '../integrations/supabase/supabase.module.js';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [SupabaseModule]
})
export class LoginModule {}
