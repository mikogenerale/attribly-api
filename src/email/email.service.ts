// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(config: ConfigService) {
    this.resend = new Resend(config.getOrThrow('RESEND_API_KEY'));
    this.from = config.getOrThrow('EMAIL_FROM');
  }

  // Deliberately not async: callers must not wait on the send
  send(opts: { to: string; subject: string; html: string }) {
    void this.resend.emails
      .send({ from: this.from, ...opts })
      .then(({ error }) => {
        if (error) this.logger.error(`Resend failed: ${error.message}`);
      });
  }
}