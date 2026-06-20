import {
  Body, Controller, Get, Param, Patch,
  Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService }      from './users.service';
import { UpdateBrandDto }    from './dto/update-brand.dto';
import { UpdateCreatorDto }  from './dto/update-creator.dto';
import { JwtAuthGuard }      from '../common/guards/jwt-auth.guard';
import { RolesGuard }        from '../common/guards/roles.guard';
import { Roles }             from '../common/decorators/roles.decorator';
import { CurrentUser }       from '../common/decorators/user.decorator';
import { Public }            from '../common/decorators/public.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  // ── BRAND ──────────────────────────────────────────────────
  @Roles('brand')
  @Get('brand/me')
  @ApiOperation({ summary: 'Get own brand profile' })
  getBrandProfile(@CurrentUser() u: any) {
    return this.svc.getBrandProfile(u.id);
  }

  @Roles('brand')
  @Patch('brand/me')
  @ApiOperation({ summary: 'Update brand profile' })
  updateBrand(@CurrentUser() u: any, @Body() dto: UpdateBrandDto) {
    return this.svc.updateBrandProfile(u.id, dto);
  }

  // ── CREATOR ────────────────────────────────────────────────
  @Roles('creator')
  @Get('creator/me')
  @ApiOperation({ summary: 'Get own creator profile' })
  getCreatorProfile(@CurrentUser() u: any) {
    return this.svc.getCreatorProfile(u.id);
  }

  @Roles('creator')
  @Patch('creator/me')
  @ApiOperation({ summary: 'Update creator profile' })
  updateCreator(@CurrentUser() u: any, @Body() dto: UpdateCreatorDto) {
    return this.svc.updateCreatorProfile(u.id, dto);
  }

  // ── PUBLIC CREATOR DIRECTORY ───────────────────────────────
  @Public()
  @Get('creators')
  @ApiOperation({ summary: 'Search and browse creators (public)' })
  searchCreators(
    @Query('niche')        niche?:       string,
    @Query('platform')     platform?:    string,
    @Query('minFollowers') minFollowers?: number,
    @Query('search')       search?:      string,
    @Query('page')         page?:        number,
    @Query('limit')        limit?:       number,
  ) {
    return this.svc.searchCreators({ niche, platform, minFollowers, search, page, limit });
  }

  @Public()
  @Get('creators/:id')
  @ApiOperation({ summary: 'Get public creator profile by ID' })
  getCreator(@Param('id') id: string) {
    return this.svc.getPublicCreatorById(id);
  }

  // ── PACKAGES ───────────────────────────────────────────────
  @Roles('creator')
  @Get('packages')
  @ApiOperation({ summary: 'Get own packages' })
  getPackages(@CurrentUser() u: any) {
    return this.svc.getCreatorPackages(u.creatorProfile?.id ?? u.id);
  }

  @Roles('creator')
  @Post('packages')
  @ApiOperation({ summary: 'Create a new package' })
  createPackage(@CurrentUser() u: any, @Body() data: any) {
    return this.svc.createPackage(u.creatorProfile?.id ?? u.id, data);
  }

  @Roles('creator')
  @Patch('packages/:id')
  @ApiOperation({ summary: 'Update a package' })
  updatePackage(@CurrentUser() u: any, @Param('id') id: string, @Body() data: any) {
    return this.svc.updatePackage(id, u.creatorProfile?.id ?? u.id, data);
  }
}
