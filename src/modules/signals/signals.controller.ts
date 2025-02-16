import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SignalsService } from '../signals/signals.service';
import { CreateXRaySignalInput } from './dto/create-signals.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { UpdateSignalInput } from './dto/update-signals.dto';

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

  @Get('search')
  @ApiQuery({
    name: 'deviceId',
    required: false,
    type: String,
    description: 'Optional device ID',
  })
  @ApiQuery({
    name: 'dataLength',
    required: false,
    type: Number,
    description: 'Optional data length',
  })
  async searchSignals(
    @Query('deviceId') deviceId?: string,
    @Query('dataLength') dataLength?: string,
  ) {
    const dataLengthNum =
      dataLength && !isNaN(Number(dataLength))
        ? parseInt(dataLength, 10)
        : undefined;
    const signals = await this.signalsService.searchSignals({
      deviceId,
      dataLength: dataLengthNum,
    });
    return { signals };
  }

  @Get(':id')
  async getSignalById(@Param('id') id: string) {
    const signal = await this.signalsService.getSignalById({ id });
    return { signal };
  }

  @Put(':id')
  @ApiBody({
    description: 'Update signal payload',
    type: UpdateSignalInput,
  })
  async updateSignal(
    @Param('id') id: string,
    @Body() updateData: UpdateSignalInput,
  ) {
    const updatedSignal = await this.signalsService.updateSignal(
      id,
      updateData,
    );
    return { message: 'Signal updated successfully', updatedSignal };
  }

  @Delete(':id')
  async deleteSignal(@Param('id') id: string) {
    await this.signalsService.deleteSignal({ id });
    return { message: `Signal with ID ${id} deleted successfully` };
  }
}
