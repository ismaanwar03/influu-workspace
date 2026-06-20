import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly svc: CampaignsService) {}

  @Roles('brand')
  @Post()
  @ApiOperation({ summary: 'Create a new campaign (brand only)' })
  create(@CurrentUser() user: any, @Body() dto: CreateCampaignDto) {
    return this.svc.create(user.brandProfile?.id ?? user.id, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active campaigns (public)' })
  findAll(
    @Query('status') status?: string,
    @Query('platform') platform?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.svc.findAll({ status, platform, page, limit });
  }

  @Get('my')
  @Roles('brand')
  @ApiOperation({ summary: "Get brand's own campaigns" })
  mine(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.svc.findByBrand(user.brandProfile?.id ?? user.id, status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single campaign' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @Roles('brand')
  @ApiOperation({ summary: 'Update a campaign' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.svc.update(id, user.brandProfile?.id ?? user.id, dto);
  }

  @Delete(':id')
  @Roles('brand')
  @ApiOperation({ summary: 'Delete a campaign' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.remove(id, user.brandProfile?.id ?? user.id);
  }
}
