import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCreatorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() bio?:          string;
  @ApiPropertyOptional() @IsOptional() @IsString() niche?:        string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?:         string;
  @ApiPropertyOptional() @IsOptional() @IsString() availability?: string;
}
