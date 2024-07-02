import io from "socket.io-client";

let socket;

export const initWebSocket = () => {
  socket = io("http://localhost:3001");
};

export const subscribeToChat = (chatId, callback) => {
  socket.on("newMessage", callback);
};

export const sendMessageViaSocket = (chatId, text) => {
  socket.emit("sendMessage", { chatId, text });
};
