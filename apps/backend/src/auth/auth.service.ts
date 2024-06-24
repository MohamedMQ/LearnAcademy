import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService {
  private googleClient?: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private getGoogleClient() {
    if (!this.googleClient) {
      this.googleClient = new OAuth2Client();
    }
    return this.googleClient;
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException("Email already in use");

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashed,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = this.signToken(user.id, user.email, user.tier, user.role);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const token = this.signToken(user.id, user.email, user.tier, user.role);
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async loginWithGoogle(idToken: string) {
    const clientId = this.config.get<string>("GOOGLE_CLIENT_ID");
    if (!clientId) {
      throw new InternalServerErrorException(
        "Google OAuth is not configured on backend",
      );
    }

    const ticket = await this.getGoogleClient().verifyIdToken({
      idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException("Google account email is not verified");
    }

    const email = payload.email.toLowerCase();
    const name = payload.name?.trim() || payload.given_name || "Google User";
    const avatar = payload.picture || null;

    const generatedPassword = await bcrypt.hash(randomUUID(), 12);

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        name,
        avatar,
      },
      create: {
        email,
        name,
        avatar,
        password: generatedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = this.signToken(user.id, user.email, user.tier, user.role);
    return { user, token };
  }

  private signToken(
    userId: string,
    email: string,
    tier: string,
    role: string,
  ): string {
    return this.jwt.sign({ sub: userId, email, tier, role });
  }
}
