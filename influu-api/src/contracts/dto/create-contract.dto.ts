import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class CreateContractDto {
  @ApiProperty() @IsString() creatorId!: string
  @ApiPropertyOptional() @IsOptional() @IsString() campaignId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() packageId?: string
  @ApiProperty()
  @IsEnum(['instagram', 'tiktok', 'youtube', 'facebook'])
  platform!: string
  @ApiProperty()
  @IsEnum(['post', 'reel', 'story', 'video', 'short'])
  contentType!: string
  @ApiProperty() @IsNumber() @Min(500) amount!: number
  @ApiProperty() @IsDateString() deadline!: string
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  maxRevisions!: number
}
