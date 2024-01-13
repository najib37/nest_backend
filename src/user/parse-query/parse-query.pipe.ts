import { ArgumentMetadata, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { QueryTypedto, FormatQueryType } from 'src/user/dto/query-validation.dto'

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(queries: QueryTypedto, metadata: ArgumentMetadata) : FormatQueryType {
    let formatedQuery: FormatQueryType = {};
    const take = parseInt(queries.take, 10);
    const skip = parseInt(queries.skip, 10);

    if (!isNaN(take))
      formatedQuery.take = take;
    if (!isNaN(skip))
      formatedQuery.skip= skip;
      
    return formatedQuery;
  };
}
