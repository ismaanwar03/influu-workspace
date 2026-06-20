import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class SubmitDraftDto {
  @ApiProperty() @IsArray() @IsString({ each: true }) fileUrls!: string[]
  @ApiProperty() @IsString() caption!: string
  @ApiPropertyOptional() @IsOptional() @IsString() hashtags?: string
}
