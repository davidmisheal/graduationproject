import axios from "axios";

// Fetch messages
export const fetchMessages = async (chatId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/messages/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data.messages; // Assuming the API returns messages under data.data.messages
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};

// Send a message
export const sendMessage = async (chatId, text) => {
  try {
    const token = window.localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:3000/api/v1/messages/${chatId}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
