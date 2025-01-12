import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

declare global {
  var pusherClient: PusherClient | undefined;
}

if (!global.pusherClient) {
  global.pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: "eu",
  });
}

export const pusherClient = global.pusherClient;

// authEndpoint: "/api/pusher-auth",
// authTransport: "ajax",
// auth: {
//   headers: {
//     "Content-Type": "application/json",
//   },
// },
