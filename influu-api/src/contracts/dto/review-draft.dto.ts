import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class ReviewDraftDto {
  @ApiProperty({ enum: ['approve', 'request_revision'] })
  @IsEnum(['approve', 'request_revision'])
  decision!: string
  @ApiPropertyOptional() @IsOptional() @IsString() feedback?: string
}
