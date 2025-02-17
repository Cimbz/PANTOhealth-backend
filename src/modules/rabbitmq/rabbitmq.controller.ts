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

  @Post()
  async receiveXRayData(@Body() xrayData: Record<string, any>) {
    await this.rabbitmqService.sendMessage(xrayData);
    return { status: 'success', receivedData: xrayData };
  }
}
