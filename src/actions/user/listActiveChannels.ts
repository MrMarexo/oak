"use server";

import { pusherServer } from "@/lib/pusher";

export const listActiveChannels = async () => {
  const res = await pusherServer.get({ path: "/channels" });
  if (res.status === 200) {
    const body = await res.json();
    const channelsInfo = body.channels;

    console.log("Active Channels:", channelsInfo);
  }
};
