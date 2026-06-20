import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator'

export class SignupDto {
  @ApiProperty() @IsString() @MinLength(2) name!: string
  @ApiProperty() @IsEmail() email!: string
  @ApiProperty() @IsString() @MinLength(8) password!: string
  @ApiProperty({ enum: ['brand', 'creator'] })
  @IsIn(['brand', 'creator'])
  role!: string
}
