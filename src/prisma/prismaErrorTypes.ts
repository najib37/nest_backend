
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError
} from '@prisma/client/runtime/library';


export type PrismaError = PrismaClientKnownRequestError //| PrismaClientUnknownRequestErrovr 
// | PrismaClientRustPanicError | PrismaClientInitializationError
