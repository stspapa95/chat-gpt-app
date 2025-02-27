import supabase from "@/db/supabase";
import { ChatWithMessages, Message } from "@/types";

/**
 * Creates a new chat and inserts associated messages.
 *
 * @param {string} userEmail - The email of the user creating the chat.
 * @param {string} name - The name of the chat.
 * @param {Message[]} msgs - An array of messages to be inserted into the chat.
 * @returns {Promise<number | null>} The newly created chat ID, or null if an error occurs.
 */
export async function createChat(
  userEmail: string,
  name: string,
  msgs: Message[],
): Promise<number | null> {
  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .insert([{ user_email: userEmail, name }])
    .select("id") // Retrieve the newly inserted row id
    .single(); // Ensures we get a single object and not an array

  if (chatError) {
    console.error("Error inserting chat:", chatError);
    return null;
  }

  const chatId = chatData.id;

  // Insert messages linked to the chat ID
  const formattedMessages = msgs.map((msg) => ({
    chat_id: chatId,
    role: msg.role,
    content: msg.content,
  }));

  const { error: messagesError } = await supabase
    .from("messages")
    .insert(formattedMessages);

  if (messagesError) {
    console.error("Error inserting messages:", messagesError);
    return null;
  }

  return chatId;
}

/**
 * Retrieves a specific chat along with its messages.
 *
 * @param {number} chatId - The ID of the chat to retrieve.
 * @returns {Promise<ChatWithMessages | null>} The chat with its messages, or null if an error occurs.
 */
export async function getChat(chatId: number) {
  // Fetch chat details
  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();

  if (chatError || !chat) {
    console.error("Error fetching chat:", chatError);
    return null;
  }

  // Fetch messages related to this chat
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId);

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return null;
  }

  return {
    ...chat,
    messages: messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
  };
}

/**
 * Retrieves the last 3 chats for a user along with their messages.
 *
 * @param {string} userEmail - The email of the user whose chats are being retrieved.
 * @returns {Promise<ChatWithMessages[]>} An array of chats with messages, or an empty array if an error occurs.
 */
export async function getChatsWithMessages(userEmail: string) {
  // Fetch the last 3 chats for the user
  const { data: chats, error: chatsError } = await supabase
    .from("chats")
    .select("*")
    .eq("user_email", userEmail)
    .order("timestamp", { ascending: false })
    .limit(3);

  if (chatsError) {
    console.error("Error fetching chats:", chatsError);
    return [];
  }

  // Fetch messages for each chat
  for (const chat of chats) {
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat.id);

    if (messagesError) {
      console.error(
        `Error fetching messages for chat ${chat.id}:`,
        messagesError,
      );
      chat.messages = [];
    } else {
      chat.messages = messages.map((msg) => ({
        ...msg,
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
    }
  }

  return chats as ChatWithMessages[];
}

/**
 * Retrieves messages for a given chat.
 *
 * @param {number} chatId - The ID of the chat whose messages are being retrieved.
 * @returns {Promise<Message[]>} An array of messages for the chat, or an empty array if an error occurs.
 */
export async function getMessages(chatId: number) {
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId);

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return [];
  }

  return messages.map((msg) => ({
    ...msg,
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));
}

/**
 * Updates the messages of an existing chat.
 *
 * @param {number} chatId - The ID of the chat to update.
 * @param {Message[]} msgs - An array of messages to update for the chat.
 * @returns {Promise<boolean>} Returns `true` if the update was successful, otherwise `false`.
 */
export async function updateChat(
  chatId: number | null,
  msgs: Message[],
): Promise<boolean> {
  // Ensure the chat exists by checking its ID first
  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .single();

  if (chatError || !chat) {
    console.error("Error: Chat not found:", chatError);
    return false;
  }

  // Format the messages
  const formattedMessages = msgs.map((msg) => ({
    chat_id: chatId,
    role: msg.role,
    content: msg.content,
  }));

  // Insert new messages or update existing ones

  const { error: messagesError } = await supabase
    .from("messages")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .upsert(formattedMessages, { onConflict: ["chat_id", "role", "content"] });

  if (messagesError) {
    console.error("Error updating messages:", messagesError);
    return false;
  }

  return true;
}
