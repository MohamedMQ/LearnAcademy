import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(
    @CurrentUser() user: any,
    @Body() body: { messages: any[] },
    @Res() res: Response,
  ) {
    if (user.tier !== 'ULTRA') {
      throw new ForbiddenException('AI Tutor requires Ultra plan');
    }

    const result = await this.aiService.createChatStream(body.messages);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('x-vercel-ai-data-stream', 'v1');

    const stream = result.toDataStream();
    const reader = stream.getReader();

    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      pump();
    };

    pump();
  }
}
