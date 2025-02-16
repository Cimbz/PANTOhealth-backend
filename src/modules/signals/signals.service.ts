import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateXRaySignalInput,
  CreateXRaySignalOutput,
} from './dto/create-signals.dto';
import { SignalRepository } from './signals.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SearchSignalsInput, SearchSignalsOutput } from './dto/search-signals.dto';
import { FindSignalByIdInput, FindSignalOutput } from './dto/find-signals.dto';
import { NOTHING_FOUND } from 'src/common/constants/common_message';
import { UpdateSignalInput, UpdateSignalOutput } from './dto/update-signals.dto';
import { DeleteSignalInput, DeleteSignalOutput } from './dto/delete-signals.dto';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly signalRepository: SignalRepository,
  ) {}


  async createSignal(
    input: CreateXRaySignalInput,
  ): Promise<CreateXRaySignalOutput> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
     
      await this.signalRepository.create(input);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Failed to save signal:', error);
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }

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

  async getAllSignals():Promise<SearchSignalsOutput>{
    try{
      const results = await this.signalRepository.getAllSignals();

      return{
        success:true,
        results,
      }
    } catch(error){
      this.logger.error('Failed to get data:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async getSignalById(input: FindSignalByIdInput ):Promise<FindSignalOutput> {
    try{
        const signal = await this.signalRepository.findById(input.id);
        if(!signal) {
          throw new NotFoundException(NOTHING_FOUND)
        }

        return{
          success: true,
          results: signal,
        }

    } catch(error){
      this.logger.error('Failed to get data by id:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateSignal(input: UpdateSignalInput): Promise<UpdateSignalOutput>{
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.getSignalById({id:input.id});
      await this.signalRepository.update(input);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Failed to update signal:', error);
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }

  async deleteSignal(input: DeleteSignalInput): Promise<DeleteSignalOutput>{
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.getSignalById({id:input.id});
      await this.signalRepository.delete(input.id);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Failed to delete signal:', error);
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }

  async searchSignals(input: SearchSignalsInput): Promise<SearchSignalsOutput>{
    try{
      const results = await this.signalRepository.search(input);

      return{
        success: true,
        results,
      }

    } catch(error){
      this.logger.error('Failed to get signals with provided filters:', error);
      throw new InternalServerErrorException(error);
    }
  }
}
