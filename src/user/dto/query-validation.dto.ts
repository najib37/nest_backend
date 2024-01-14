
import {
  IsOptional,
  IsNumberString,
} from 'class-validator'


export class QueryTypedto {
  @IsOptional()
  @IsNumberString()
  skip: string;

  @IsOptional()
  @IsNumberString()
  take: string;
}

export type FormatedQueryType = {
  [Property in keyof Partial<QueryTypedto>]: number;
};

