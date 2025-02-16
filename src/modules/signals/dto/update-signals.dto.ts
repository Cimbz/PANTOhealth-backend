import { PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/entities/output.dto';
import { CreateXRaySignalInput } from './create-signals.dto';

export class UpdateSignalInput extends PartialType(CreateXRaySignalInput) {}

export class UpdateSignalOutput extends CoreOutput {}
