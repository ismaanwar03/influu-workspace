import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard }   from '../common/guards/roles.guard';
import { Roles }        from '../common/decorators/roles.decorator';
import { CurrentUser }  from '../common/decorators/user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Platform-wide overview stats' })
  getStats() { return this.svc.getStats(); }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  listUsers(@Query('role') role?: string, @Query('page') page?: number) {
    return this.svc.listUsers(role, page);
  }

  @Patch('users/:id/toggle')
  @ApiOperation({ summary: 'Enable or disable a user account' })
  toggleUser(@Param('id') id: string) { return this.svc.toggleUserStatus(id); }

  @Get('disputes')
  @ApiOperation({ summary: 'List disputes with optional status filter' })
  listDisputes(@Query('status') status?: string) {
    return this.svc.listDisputes(status);
  }

  @Patch('disputes/:id/resolve')
  @ApiOperation({ summary: 'Resolve a dispute in favour of brand or creator' })
  resolveDispute(
    @Param('id')    id:   string,
    @CurrentUser()  u:    any,
    @Body()         body: { resolution: string; favour: 'brand' | 'creator' },
  ) { return this.svc.resolveDispute(id, u.id, body.resolution, body.favour); }

  @Get('queue')
  @ApiOperation({ summary: 'Get moderation queue (stale drafts, disputes, revision issues)' })
  getQueue() { return this.svc.getModerationQueue(); }
}
