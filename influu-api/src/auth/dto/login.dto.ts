import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    example: 'ahmed@khaadi.pk',
    description: 'The registered email address of the user',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string

  @ApiProperty({
    example: 'Password123!',
    description: 'The secure account password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string
}
