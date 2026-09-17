import { Module } from "@nestjs/common";
import { JwtService } from "./jwt.service.js";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      //This tells NestJS that the ConfigService should be injected into the factory function.
      inject: [ConfigService],

      // The function accepts the injected ConfigService as a parameter, so you can use it inside the function.
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}