import { OnModuleInit, Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private logger: Logger = new Logger(PrismaService.name)
  ) {
    super();
    // this.logger.log("prisma service constructor");
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.debug("PRISMA CLIENT CONNECTED");
    } catch {
      this.logger.fatal("PRISMA CLIENT CONLDN'T CONNECT");
    }
  }
}
