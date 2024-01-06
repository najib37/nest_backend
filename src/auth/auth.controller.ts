import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { FortyTwoGuard } from './guard/42.guard';
import { AuthService } from './authService';
import { JwtGuard } from './guard/jwt.guards';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice : AuthService) { }
    @UseGuards(FortyTwoGuard)
    @Get('42')
    loginIn() {     }

    @UseGuards(FortyTwoGuard)
    @Get('42/callback')
    async redirectUser(@Req() req, @Res() res) {
        // console.log(req.user)
        
        const accessToken = await this.authservice.login42(req.user);
        res.cookie('jwt', accessToken, {httpOnly : true})
        return res.send({ user : req.user }) // when providing the @Res() 
        // u need to send the respond manualy 
    }

    @UseGuards(JwtGuard)
    @Get('status')
    user(@Req() req) {
        // console.log( "this is the request ", req);
    //     if (request.user)
    //         return {msg : 'authenticated'}
        return {msg : 'autherized'}
        }
}
