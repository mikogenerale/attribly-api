import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseService {

    getSupabaseData(): string {
        return 'Supabase endpoint called!';
    }
}
