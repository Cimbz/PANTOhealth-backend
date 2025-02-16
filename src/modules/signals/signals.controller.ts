import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SignalsService } from '../signals/signals.service';

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  private readonly logger = new Logger(SignalsController.name);


  @Get('getAllSignals')
  async getAllSignals() {
    const signals = await this.signalsService.getAllSignals();
    return { signals };
  }

}