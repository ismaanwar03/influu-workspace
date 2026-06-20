import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContractsService }  from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { SubmitDraftDto }    from './dto/submit-draft.dto';
import { ReviewDraftDto }    from './dto/review-draft.dto';
import { SubmitPostUrlDto }  from './dto/submit-post.dto';
import { JwtAuthGuard }      from '../common/guards/jwt-auth.guard';
import { RolesGuard }        from '../common/guards/roles.guard';
import { Roles }             from '../common/decorators/roles.decorator';
import { CurrentUser }       from '../common/decorators/user.decorator';

@ApiTags('contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private svc: ContractsService) {}

  @Roles('brand')
  @Post()
  @ApiOperation({ summary: 'Create a new contract / send an offer' })
  create(@CurrentUser() u: any, @Body() dto: CreateContractDto) {
    return this.svc.create(u.brandProfile?.id ?? u.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List contracts for current user' })
  findAll(@CurrentUser() u: any, @Query('status') status?: string) {
    return this.svc.findAll(u.id, u.role, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full contract details' })
  findOne(@Param('id') id: string, @CurrentUser() u: any) {
    return this.svc.findOne(id, u.id);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Digitally sign a contract' })
  sign(@Param('id') id: string, @CurrentUser() u: any) {
    return this.svc.sign(id, u.id, u.role);
  }

  @Roles('creator')
  @Post(':id/drafts')
  @ApiOperation({ summary: 'Submit a draft for brand review' })
  submitDraft(@Param('id') id: string, @CurrentUser() u: any, @Body() dto: SubmitDraftDto) {
    return this.svc.submitDraft(id, u.id, dto);
  }

  @Roles('brand')
  @Post(':id/drafts/:draftId/review')
  @ApiOperation({ summary: 'Approve or request revision on a draft' })
  reviewDraft(
    @Param('id')      id:      string,
    @Param('draftId') draftId: string,
    @CurrentUser()    u:       any,
    @Body()           dto:     ReviewDraftDto,
  ) { return this.svc.reviewDraft(id, draftId, u.id, dto); }

  @Roles('creator')
  @Post(':id/post-url')
  @ApiOperation({ summary: 'Submit the live post URL for verification' })
  submitPostUrl(@Param('id') id: string, @CurrentUser() u: any, @Body() dto: SubmitPostUrlDto) {
    return this.svc.submitPostUrl(id, u.id, dto);
  }
}
