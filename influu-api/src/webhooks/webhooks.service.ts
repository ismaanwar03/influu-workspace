import { Injectable, Logger } from '@nestjs/common';
import { ConfigService }      from '@nestjs/config';
import axios                  from 'axios';

export type MakeWebhookEvent =
  | 'POST_VERIFIED'
  | 'CONTRACT_SIGNED'
  | 'PAYMENT_RELEASED'
  | 'DRAFT_SUBMITTED'
  | 'DISPUTE_OPENED';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  private readonly WEBHOOK_KEYS: Record<MakeWebhookEvent, string> = {
    POST_VERIFIED:     'MAKE_WEBHOOK_POST_VERIFIED',
    CONTRACT_SIGNED:   'MAKE_WEBHOOK_CONTRACT_SIGNED',
    PAYMENT_RELEASED:  'MAKE_WEBHOOK_PAYMENT_RELEASED',
    DRAFT_SUBMITTED:   'MAKE_WEBHOOK_DRAFT_SUBMITTED',
    DISPUTE_OPENED:    'MAKE_WEBHOOK_DISPUTE_OPENED',
  };

  constructor(private config: ConfigService) {}

  async trigger(event: MakeWebhookEvent, payload: Record<string, any>) {
    const envKey = this.WEBHOOK_KEYS[event];
    const url    = this.config.get<string>(envKey);

    if (!url) {
      this.logger.warn(`No webhook URL configured for ${event} (${envKey})`);
      return;
    }

    try {
      await axios.post(url, {
        event,
        timestamp: new Date().toISOString(),
        ...payload,
      }, { timeout: 8000 });
      this.logger.log(`Webhook triggered: ${event}`);
    } catch (err) {
      this.logger.error(`Webhook failed [${event}]: ${err}`);
    }
  }

  // ── TYPED TRIGGER METHODS ─────────────────────────────────
  async onContractSigned(contractId: string, brandName: string, creatorName: string, amount: number) {
    return this.trigger('CONTRACT_SIGNED', { contractId, brandName, creatorName, amount });
  }

  async onDraftSubmitted(contractId: string, brandEmail: string, creatorName: string, version: number) {
    return this.trigger('DRAFT_SUBMITTED', { contractId, brandEmail, creatorName, version });
  }

  async onPostVerified(contractId: string, postUrl: string, platform: string, timerHours: number) {
    return this.trigger('POST_VERIFIED', { contractId, postUrl, platform, timerHours });
  }

  async onPaymentReleased(contractId: string, creatorEmail: string, amount: number, method: string) {
    return this.trigger('PAYMENT_RELEASED', { contractId, creatorEmail, amount, method });
  }

  async onDisputeOpened(contractId: string, disputeId: string, reason: string) {
    return this.trigger('DISPUTE_OPENED', { contractId, disputeId, reason });
  }
}
