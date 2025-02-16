import { Prop, Schema } from '@nestjs/mongoose';
import { DefaultEntity } from 'src/common/entities/default.entity';
import { CollectionName } from 'src/common/enums/collection-name.enum';
import { IsNumber, IsString } from 'class-validator';
import { DEVICE_ID_MUST_BE_STRING } from 'src/common/constants/common_message';
import { Coordinates } from './coordinates.entity';
import mongoose from 'mongoose';
import { SchemaFactory } from 'src/common/utils/schema-factory.util';
import { Document } from 'src/common/types/document.type';

@Schema({ collection: CollectionName.SIGNALS })
export class XRaySignalEntity extends DefaultEntity {
  @Prop({ type: String, required: true })
  @IsString({ message: DEVICE_ID_MUST_BE_STRING })
  deviceId: string;

  @Prop({ type: Number, required: true })
  @IsNumber()
  time: number;

  @Prop({ type: Number, required: true })
  @IsNumber()
  dataLength: number;

  @Prop({ type: Number, required: true })
  @IsNumber()
  dataVolume: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  coordinates: Coordinates[];
}

const XRaySignalSchema = SchemaFactory(XRaySignalEntity);
type TXRaySignal = Document<XRaySignalEntity>;

export { XRaySignalSchema, TXRaySignal };
