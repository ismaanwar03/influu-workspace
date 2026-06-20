import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl } from 'class-validator'

export class SubmitPostUrlDto {
  @ApiProperty({
    description: 'Public URL of the live post on Instagram/TikTok/YouTube',
  })
  @IsString()
  @IsUrl()
  postUrl!: string
}
