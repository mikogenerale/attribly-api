import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service.js';
import { SupabaseAuthService } from './supabase-auth.service.js';
import { SupabaseDatabaseService } from './supabase-database.service.js';

@Module({
  providers: [SupabaseService, SupabaseAuthService, SupabaseDatabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
