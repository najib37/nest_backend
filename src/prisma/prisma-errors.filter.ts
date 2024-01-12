import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';

type arr = {
  [key: string]: HttpException
}

@Injectable()
@Catch()
export class PrismaErrorsFilter/* <T> */ implements ExceptionFilter {
  private exceptionMap = new Map();
  constructor() {
    this.exceptionMap['2002'] = HttpStatus.BAD_REQUEST;
  }
  catch(exception: any, host: ArgumentsHost) {

  }
}
