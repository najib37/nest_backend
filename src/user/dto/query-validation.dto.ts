
import {
  IsOptional,
  IsNumberString,
} from 'class-validator'


export class QueryTypedto {
  // @IsNumberString()
  // @IsOptional()
  [key: string]: string;
}

export class FormatQueryType {
  skip?: number;
  take?: number;
  // : number,
  // skip: number,
}
