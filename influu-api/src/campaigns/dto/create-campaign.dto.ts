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

export class CreateCampaignDto {
  @ApiProperty() @IsString() title!: string
  @ApiProperty()
  @IsEnum(['instagram', 'tiktok', 'youtube', 'facebook'])
  platform!: string
  @ApiProperty()
  @IsEnum(['post', 'reel', 'story', 'video', 'short'])
  contentType!: string
  @ApiProperty() @IsString() brief!: string
  @ApiProperty() @IsNumber() @Min(1000) budget!: number
  @ApiProperty() @IsDateString() deadline!: string
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) minFollowers!: number
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  maxRevisions!: number
}
