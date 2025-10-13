import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
export const pusherServer = new Pusher({
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
	secret: process.env.PUSHER_SECRET!,
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
	useTLS: true,
});

// Client-side Pusher instance (singleton)
let pusherClient: PusherClient | null = null;

export const getPusherClient = () => {
	if (!pusherClient) {
		pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		});
	}
	return pusherClient;
};

// Helper function to trigger events
export const triggerPusherEvent = async (
	channel: string,
	event: string,
	data: any
) => {
	try {
		await pusherServer.trigger(channel, event, data);
		return { success: true };
	} catch (error) {
		console.error("Pusher trigger error:", error);
		return { success: false, error };
	}
};
