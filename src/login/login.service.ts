import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../integrations/supabase/supabase.service.js';

@Injectable()
export class LoginService {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}
    login(): string {
        return 'Login endpoint called!';
    }
    getSupabaseData(): string {
        return this.supabaseService.getSupabaseData();
    }
}
