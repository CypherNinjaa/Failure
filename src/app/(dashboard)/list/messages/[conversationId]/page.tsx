import {
	getConversationMessages,
	getUserConversations,
} from "@/lib/messageActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MessageThread from "@/components/messages/MessageThread";
import Link from "next/link";
import Image from "next/image";
import ConversationList from "@/components/messages/ConversationList";
import ConversationHeader from "@/components/messages/ConversationHeader";

const ConversationPage = async ({
	params,
}: {
	params: { conversationId: string };
}) => {
	const { userId } = auth();
	if (!userId) redirect("/sign-in");

	const conversationId = params.conversationId;

	// Get messages for this conversation
	const messagesResult = await getConversationMessages(conversationId);
	const messages = messagesResult.success ? messagesResult.messages || [] : [];
	const hasMore = messagesResult.success
		? messagesResult.hasMore || false
		: false;
	const nextCursor = messagesResult.success ? messagesResult.nextCursor : null;

	// Get all conversations for the sidebar
	const conversationsResult = await getUserConversations();
	const conversations = conversationsResult.success
		? conversationsResult.conversations || []
		: [];

	// Get current conversation details
	const currentConversation = conversations.find(
		(c: any) => c.id === conversationId
	);

	if (!messagesResult.success) {
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-4">⚠️</div>
					<h2 className="text-xl font-semibold text-gray-700 mb-2">
						Conversation not found
					</h2>
					<Link
						href="/list/messages"
						className="text-lamaPurple hover:underline"
					>
						← Back to messages
					</Link>
				</div>
			</div>
		);
	}

	const getConversationName = () => {
		if (!currentConversation) return "Conversation";
		if (currentConversation.type === "GROUP") {
			return currentConversation.name || "Group Chat";
		}
		const otherParticipant = currentConversation.participants[0];
		if (otherParticipant) {
			return `${otherParticipant.name} ${otherParticipant.surname}`.trim();
		}
		return "Unknown";
	};

	const getConversationImage = () => {
		if (!currentConversation || currentConversation.type === "GROUP")
			return null;
		const otherParticipant = currentConversation.participants[0];
		return otherParticipant?.img;
	};

	const getOtherUserId = () => {
		if (!currentConversation || currentConversation.type === "GROUP")
			return undefined;
		const otherParticipant = currentConversation.participants[0];
		return otherParticipant?.userId;
	};

	return (
		<div className="messages-container flex bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
			{/* Sidebar (hidden on mobile, shown on desktop) */}
			<div className="hidden md:flex md:flex-col w-96 border-r border-gray-200 bg-white flex-shrink-0">
				<div className="h-20 px-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600 text-white flex-shrink-0">
					<div>
						<h1 className="text-2xl font-bold flex items-center gap-2">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
									clipRule="evenodd"
								/>
							</svg>
							Messages
						</h1>
						<p className="text-xs text-purple-100 mt-0.5">
							{conversations.length} conversation
							{conversations.length !== 1 ? "s" : ""}
						</p>
					</div>
					<Link
						href="/list/messages"
						className="bg-white text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50 transition-all font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105"
					>
						+ New
					</Link>
				</div>
				<ConversationList conversations={conversations} />
			</div>

			{/* Main chat area */}
			<div className="flex-1 flex flex-col w-full bg-white overflow-hidden">
				{/* Chat header */}
				<ConversationHeader
					currentUserId={userId}
					otherUserId={getOtherUserId()}
					conversationName={getConversationName()}
					conversationImage={getConversationImage()}
					isGroup={currentConversation?.type === "GROUP"}
					memberCount={
						currentConversation?.type === "GROUP"
							? currentConversation.participants.length + 1
							: undefined
					}
					conversationId={conversationId}
				/>

				{/* Message thread */}
				<MessageThread
					conversationId={conversationId}
					initialMessages={messages}
					currentUserId={userId}
					otherUserId={getOtherUserId()}
					initialHasMore={hasMore}
					initialCursor={nextCursor}
				/>
			</div>
		</div>
	);
};

export default ConversationPage;
