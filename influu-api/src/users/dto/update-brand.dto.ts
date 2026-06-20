import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateBrandDto {
  @ApiPropertyOptional() @IsOptional() @IsString() companyName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string
  @ApiPropertyOptional() @IsOptional() @IsUrl() website?: string
}
