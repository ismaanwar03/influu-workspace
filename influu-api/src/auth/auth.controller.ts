import { Body, Controller, Get, Post, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto }   from './dto/signup.dto';
import { LoginDto }    from './dto/login.dto';
import { Public }      from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  // 🚀 Explicitly inject the service by its class reference token
  constructor(@Inject(AuthService) authService: AuthService) {
    this.authService = authService;
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new brand or creator account' })
  signup(@Body() dto: SignupDto) { 
    return this.authService.signup(dto); 
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT tokens' })
  login(@Body() dto: LoginDto) { 
    return this.authService.login(dto); 
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body('refreshToken') token: string) { 
    return this.authService.refresh(token); 
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: any) { 
    return this.authService.me(user.id); 
  }
}
