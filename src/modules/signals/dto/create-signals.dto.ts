import { OmitType } from '@nestjs/mapped-types';
import { XRaySignalEntity } from '../entities/signals.entity';
import { CoreOutput } from 'src/common/entities/output.dto';

export class CreateXRaySignalInput extends OmitType(XRaySignalEntity, [
  '_id',
  'createdAt',
  'updatedAt',
] as const) {}

export class CreateXRaySignalOutput extends CoreOutput {}
