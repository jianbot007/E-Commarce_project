// src/pusher/pusher.module.ts
import { Module } from "@nestjs/common";
import { PusherService } from "./pusher.service";
import { PusherProvider } from "./pusher.provider";

@Module({
  providers: [PusherService,PusherProvider],
  exports: [PusherService],
})
export class PusherModule {}
