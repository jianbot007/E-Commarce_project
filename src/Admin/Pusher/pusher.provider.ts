import { Provider } from '@nestjs/common';
import Pusher from 'pusher';

export const PusherProvider: Provider = {
  provide: 'PUSHER_CLIENT',
  useFactory: () => {
   return new Pusher({
  appId: process.env.PUSHER_APP_ID!,  
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
  },
};
