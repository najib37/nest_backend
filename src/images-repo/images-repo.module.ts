import { Module } from '@nestjs/common';
import { ImagesRepoService } from './images-repo.service';
import { ImagesRepoController } from './images-repo.controller';

@Module({
  controllers: [ImagesRepoController],
  providers: [ImagesRepoService],
})
export class ImagesRepoModule {}
