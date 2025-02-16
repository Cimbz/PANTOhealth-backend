import { CoreOutput } from 'src/common/entities/output.dto';
import { XRaySignalEntity } from '../entities/signals.entity';



export class SearchSignalsOutput extends CoreOutput {
  results?: XRaySignalEntity[];
}
