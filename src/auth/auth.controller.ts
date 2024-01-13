import { Controller, Get, Post ,Logger, Next, Req, Res, UseGuards, Body, UnauthorizedException, HttpCode, Delete } from '@nestjs/common';
import { FortyTwoGuard } from './guard/42.guard';
import { AuthService } from './authService';
import { JwtGuard } from './guard/jwt.guards';
import { toDataURL } from 'qrcode';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { nextTick } from 'process';
import {GoogleGuard} from  './guard/googleGuard'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { strict } from 'assert';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService, private readonly userservice : UserService) { }
  


  // login
  
  @UseGuards(GoogleGuard)
  @Get('google')
  googleLogin() { }
  
  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req, @Res({passthrough : true}) res) {
    const accessToken = await this.authservice.loginGoogle(req.user);
    // ! if (the user is 2fa off redirect to a specific page or otherwise)
    
    res.cookie('jwt', accessToken , { httpOnly : true})
    // if (req.user.twoFactorEnabled == false)
    // {
    //     res.redirect("http://localhost:5600/home")
    // }
    // else {
    //   res.redirect("")
    // }
    return req.user;
  }

 
  @UseGuards(FortyTwoGuard)
  @Get('42')
  loginIn(@Req() req) { 
  }

  
  @UseGuards(FortyTwoGuard)
    @Get('42/callback')
    async redirectUser(@Req() req, @Res({ passthrough: true }) res) {
    
        console.log(req.user)
        
        const accessToken = await this.authservice.login42(req.user);
        res.cookie('jwt', accessToken, {httpOnly : true})
        
        // ! if (the user is 2fa off redirect to a specific page or otherwise)
        return { user : req.user } 
        //if (req.user.twoFactorEnabled == false)
        // {
        //     res.redirect("http://localhost:5600/home")
        // }
        // else {
        //   res.redirect("")
        // }
   
        // res.cookie('jwt', accessToken, { httpOnly: true });
    
        // //  Redirect to the frontend
        // res.redirect(env.FRONT_URL);


    }
  
  

  @UseGuards(JwtGuard)
  @Get('status')
  user(@Req() req) {
    return { msg: 'autherized' }
  }
   
  

  //loggingOut
  @UseGuards(JwtGuard)
  @Delete('logginOut')
  logout(@Req() req, @Res() res) {
    res.clearCookie('jwt', {httpOnly : true, sameSite : 'strict'});
  }




    
    @UseGuards(JwtGuard)
    @Get('2fa/generate') // two factor button on 
    async generateTwoFactor(@Req()  req)  {
        // i need the username and i have to generate a generateTwoFactAuthSecret using authenticator
        const user : any =  req.user;
       console.log(req);
        const secret  = await authenticator.generateSecret();
        const otpauthUrl = await authenticator.keyuri(user.email, 'FT_TRANS', secret);

        await this.userservice.update(user.sub, {twoFactor: secret});

        console.log("_______________________", otpauthUrl + "\n\n\n");

        //generateQrCodeDataURL
        let to = await toDataURL(otpauthUrl);
        // change this when linking with front 
        return `<image src = ${to} ></image>`;
        
        // res.status(201).json({hamid: "rajol"})
        // return user;
        // console.log(secret);
        // const updateSecret = this.userservice.updateSecret(/*user id && secret */);
        // now we generate a qr code
        // To do this, we’ll use the qrcode module.
        // const otp = authenticator.keyuri(/*user, "OUR TFA APP" , secret*/)

        // and then Url to qr code using tofilestream
    }

    @Post('2fa/turn-on')
    @UseGuards(JwtGuard)
    async turnOnTwoFactAuth(@Req() req, @Res({ passthrough: true })  res,@Body() body) {
        const user = await this.userservice.findOne(req.user.sub);
        const isCodeValid = await this.authservice.isTwoFactorAuthenticationCodeValid(
          body.twoFactorAuthenticationCode,
          user,
        );
        // if the code is wrong 
        // execption handling will be changed
        if (!isCodeValid)
        {
        
          throw new UnauthorizedException("Wrong Auth Code")
        }
        // only if the code is right 
        await this.userservice.update(req.user.sub, {twoFactorEnabled: true})
        return {valid : true}
    }
    

    @Post('2fa/turn-off')
    @UseGuards(JwtGuard)
    async turnOfTwoFactAuth(@Req() req, @Res({passthrough : true}) res) {
      const user = await this.userservice.findOne(req.user.sub)

      await this.userservice.update(user.id, {twoFactorEnabled : false});
      return {off : true}
    }


    /*login with 2fac */
    @UseGuards(JwtGuard)
    @Post('otp')
    async LoginOtp(@Req() req, @Body('twoFactorAuthenticationCode') token : string) {
      console.log(req.user.sub);
      const user = await this.userservice.findOne(req.user.sub);
      return this.authservice.loginOtp(token, user)
    }
    

    /* JWT TWO FACTOR GUARD WILL BE USED WHEN TRYING TO VALIDATE THE 2fa */
}
