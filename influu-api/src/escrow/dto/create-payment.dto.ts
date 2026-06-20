import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  contractId!: string

  @ApiProperty({ enum: ['card', 'jazzcash', 'easypaisa', 'bank_transfer'] })
  @IsEnum(['card', 'jazzcash', 'easypaisa', 'bank_transfer'])
  paymentMethod!: string
}
