import { Controller, Get,  Param,  ParseFilePipe,  Post, Res ,UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { ImagesRepoService } from './images-repo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyCustomStorageEngine } from './CustomStorageEngine'
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@Controller('upload')
export class ImagesRepoController {
  constructor(
    private readonly imagesRepoService: ImagesRepoService,
    private readonly userService: UserService
  ) { }

  @Get()
  getHello(): string {
    return "hello"
  }

  @Post('/avatar/:userId')
  @UsePipes(ParseFilePipe)
  @UseInterceptors(
    FileInterceptor(
      'file',
      { storage: new MyCustomStorageEngine("/upload/avatar/") }
    )
  )
  uploadAvatar(@Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.userService.update(userId, { avatar: file.path })
  }

  @Post('/background/:userId')
  @UsePipes(ParseFilePipe)
  @UseInterceptors(
    FileInterceptor(
      'file',
      { storage: new MyCustomStorageEngine("/upload/background/") }
    )
  )
  uploadBackGround(@Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.userService.update(userId, { avatar: file.path })
  }

  @Get(":bucket/:imageName")
  getImage(
    @Res() res: Response,
    @Param('bucket') bucket: string,
    @Param('imageName') imageName: string,
  ) {
    this.imagesRepoService.getImageById(res, bucket, imageName);
  }
}
