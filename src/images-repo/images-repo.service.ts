import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from "express"

@Injectable()
export class ImagesRepoService {
  constructor(
    private readonly userService: UserService
  ) {}

  getImageById( res: Response, bucket: string, imageName : string) {

    const hackedPath = path.join(__dirname, "../../upload/" , bucket, imageName) // debug change it to the env
    res.sendFile(hackedPath);
  }
}
