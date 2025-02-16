import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
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
   
  @Get(':id')
  async getSignalById(@Param('id') id: string) {
    const signal = await this.signalsService.getSignalById({id});
    return { signal };
  }

  @Put(':id')
  async updateSignal(@Param('id') id: string, @Body() updateData: Record<string, any>) {
    const updatedSignal = await this.signalsService.updateSignal({id, ...updateData});
    return { message: 'Signal updated successfully', updatedSignal };
  }

  @Delete(':id')
  async deleteSignal(@Param('id') id: string) {
    await this.signalsService.deleteSignal({id});
    return { message: `Signal with ID ${id} deleted successfully` };
  }

}