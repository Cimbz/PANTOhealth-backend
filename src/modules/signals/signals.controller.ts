import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SignalsService } from '../signals/signals.service';
import { CreateXRaySignalInput } from './dto/create-signals.dto';

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  private readonly logger = new Logger(SignalsController.name);

  @Post()
  async createSignal(@Body() input: CreateXRaySignalInput) {
    this.logger.log('Creating new signal:', input);
    await this.signalsService.createSignal(input);
    return { message: 'Signal created successfully', data: input };
  }

  @Get('getAllSignals')
  async getAllSignals() {
    const signals = await this.signalsService.getAllSignals();
    return { signals };
  }

 

}