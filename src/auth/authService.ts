import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AuthService  { 
    constructor(private jwtService: JwtService) { }

    async login42(user : User) { 
        console.log(user)
        const payload = {username : user.username, sub: user.id}
        const token = await this.jwtService.sign(payload);
        // console.log(token)
        return token;
    }
}