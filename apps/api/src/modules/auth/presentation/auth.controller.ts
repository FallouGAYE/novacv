import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';

import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

import { UsersService } from '../../users/application/users.service.js';

import { LoginService } from '../application/login.service.js';
import { RegisterService } from '../application/register.service.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import type { LoginResult } from '../application/login.types.js';
import type { RegisterResult } from '../application/register.types.js';

import {
  loginSchema,
  type LoginDto,
} from './dto/login.dto.js';

import {
  registerSchema,
  type RegisterDto,
} from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly usersService: UsersService,
  ) {}

  // INSCRIPTION

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() input: RegisterDto,
  ): Promise<RegisterResult> {
    return this.registerService.execute(input);
  }

  // CONNEXION

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() input: LoginDto,
  ): Promise<LoginResult> {
    return this.loginService.execute(input);
  }

  // PROFIL DE L'UTILISATEUR CONNECTÉ

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
