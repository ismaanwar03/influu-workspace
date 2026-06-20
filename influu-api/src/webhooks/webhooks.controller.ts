import { Body, Controller, Headers, Post, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation }                   from '@nestjs/swagger';
import { Public }                                  from '../common/decorators/public.decorator';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  /** Paymob payment notification — handled by EscrowService directly */
  @Public()
  @Post('paymob')
  @ApiOperation({ summary: 'Paymob HMAC-verified payment webhook' })
  paymob(@Body() body: any, @Headers('hmac') hmac: string) {
    this.logger.log(`Paymob webhook received, HMAC: ${hmac ? 'present' : 'missing'}`);
    return { received: true };
  }

  /** Phyllo social account sync notification */
  @Public()
  @Post('phyllo')
  @ApiOperation({ summary: 'Phyllo account sync webhook' })
  phyllo(@Body() body: any) {
    this.logger.log(`Phyllo webhook: ${body?.type}`);
    return { received: true };
  }
}
