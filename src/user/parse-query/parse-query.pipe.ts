import { ArgumentMetadata, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { QueryTypedto, FormatedQueryType } from 'src/user/dto/query-validation.dto'

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(queries: QueryTypedto, metadata: ArgumentMetadata) : FormatedQueryType {
    let formatedQuery: FormatedQueryType = {};
    const take = parseInt(queries.take, 10);
    const skip = parseInt(queries.skip, 10);

    if (!isNaN(take) && take >= 0)
      formatedQuery.take = take;
    if (!isNaN(skip) && take >= 0)
      formatedQuery.skip= skip;
      
    return formatedQuery;
  };
}
