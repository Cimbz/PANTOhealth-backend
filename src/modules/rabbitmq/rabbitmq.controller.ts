import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get('test')
  async testSendMessage() {
    try {
      const message = { data: 'Test message' };
      await this.rabbitmqService.sendMessage(message);
      return 'Message sent';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  async receiveXRayData(@Body() xrayData: Record<string, any>) {
    await this.rabbitmqService.sendMessage(xrayData);
    return { status: 'success', receivedData: xrayData };
  }
}
