import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EscrowService }     from './escrow.service';
import { CreatePaymentDto }  from './dto/create-payment.dto';
import { JwtAuthGuard }      from '../common/guards/jwt-auth.guard';
import { RolesGuard }        from '../common/guards/roles.guard';
import { Roles }             from '../common/decorators/roles.decorator';
import { CurrentUser }       from '../common/decorators/user.decorator';
import { Public }            from '../common/decorators/public.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class EscrowController {
  constructor(private svc: EscrowService) {}

  @Roles('brand')
  @Post('intent')
  @ApiOperation({ summary: 'Create Paymob payment intent and lock escrow' })
  createIntent(@Body() dto: CreatePaymentDto) {
    return this.svc.createPaymentIntent(dto);
  }

  @Public()
  @Post('callback/paymob')
  @ApiOperation({ summary: 'Paymob payment callback (webhook)' })
  paymobCallback(@Body() data: any) {
    return this.svc.verifyPaymobCallback(data);
  }

  @Get('escrow/:contractId')
  @ApiOperation({ summary: 'Get escrow status for a contract' })
  getStatus(@Param('contractId') id: string) {
    return this.svc.getStatus(id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get transaction history for current user' })
  history(@CurrentUser() u: any) {
    return this.svc.getHistory(u.id, u.role);
  }
}
