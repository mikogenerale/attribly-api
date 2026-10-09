import { Injectable } from '@nestjs/common';

@Injectable()
export class SignupService {
    signup(): string { 
        return 'Signup endpoint called!';
    }
}
