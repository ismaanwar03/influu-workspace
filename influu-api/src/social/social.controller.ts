import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SocialService }  from './social.service';
import { JwtAuthGuard }   from '../common/guards/jwt-auth.guard';
import { RolesGuard }     from '../common/guards/roles.guard';
import { Roles }          from '../common/decorators/roles.decorator';
import { CurrentUser }    from '../common/decorators/user.decorator';

@ApiTags('social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('social')
export class SocialController {
  constructor(private svc: SocialService) {}

  @Roles('creator')
  @Get()
  @ApiOperation({ summary: 'Get all connected social accounts' })
  getAccounts(@CurrentUser() u: any) {
    return this.svc.getConnectedAccounts(u.creatorProfile?.id ?? u.id);
  }

  @Roles('creator')
  @Post('phyllo/token')
  @ApiOperation({ summary: 'Get Phyllo SDK token for account connection' })
  getPhylloToken(@CurrentUser() u: any) {
    return this.svc.createPhylloUser(u.id);
  }

  @Roles('creator')
  @Post('phyllo/sync')
  @ApiOperation({ summary: 'Sync account stats after Phyllo connection' })
  syncPhyllo(
    @CurrentUser() u: any,
    @Body() body: { platform: string; phylloAccountId: string },
  ) {
    return this.svc.syncPhylloAccount(
      u.creatorProfile?.id ?? u.id,
      body.platform,
      body.phylloAccountId,
    );
  }

  @Post('verify-post')
  @ApiOperation({ summary: 'Verify a social media post URL' })
  verifyPost(@Body() body: { postUrl: string; platform: string; username?: string }) {
    return this.svc.verifyPost(body.postUrl, body.platform, body.username);
  }

  @Roles('creator')
  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect a social account' })
  disconnect(@CurrentUser() u: any, @Param('id') id: string) {
    return this.svc.disconnectAccount(u.creatorProfile?.id ?? u.id, id);
  }
}
