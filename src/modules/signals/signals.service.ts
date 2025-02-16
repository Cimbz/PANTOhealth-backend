import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CreateXRaySignalInput,
  CreateXRaySignalOutput,
} from './dto/create-signals.dto';
import { SignalRepository } from './signals.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly signalRepository: SignalRepository,
  ) {}

  async insertXRaySignals(
    input: CreateXRaySignalInput[],
  ): Promise<CreateXRaySignalOutput> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (!input || input.length === 0) {
        this.logger.warn('Empty input array received for x-ray signals.');
        throw new InternalServerErrorException('Input array is empty.');
      }
      await this.signalRepository.bulkInsert(input);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Failed to save x-ray signal:', error);
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }

  async handleIncomingXRayData(input: Record<string, any>): Promise<void> {
    try {
      if (!input || Object.keys(input).length === 0) {
        this.logger.warn('Received empty x-ray data for processing.');
        return;
      }

      const newXraySignals: CreateXRaySignalInput[] = [];
      for (const [deviceId, deviceData] of Object.entries(input)) {
        const { data, time } = deviceData;

        if (!data || !Array.isArray(data)) {
          this.logger.warn(`Invalid data format for device ${deviceId}`);
          continue;
        }

        const dataLength = data.length;
        const dataVolume = Buffer.byteLength(JSON.stringify(data));

        if (dataLength === 0) {
          this.logger.warn(`Device ${deviceId} has no x-ray data to process.`);
          continue;
        }

        data.forEach(([relativeTime, [x, y, speed]]) => {
          const timestamp = new Date(time + relativeTime);

          if (
            typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof speed !== 'number'
          ) {
            this.logger.warn(
              `Malformed coordinate data for device ${deviceId}: ${JSON.stringify({ x, y, speed })}`,
            );
            return;
          }

          const data: CreateXRaySignalInput = {
            deviceId: deviceId,
            time: timestamp.getTime(),
            coordinates: [{ x, y, speed }],
            dataLength,
            dataVolume,
          };

          newXraySignals.push(data);
        });

        await this.insertXRaySignals(newXraySignals);
      }
    } catch (error) {
      this.logger.error('Error processing x-ray data:', error);
      throw error;
    }
  }
}
