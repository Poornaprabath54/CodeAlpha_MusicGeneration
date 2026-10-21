const chat = document.querySelector("#chat");
const message = document.querySelector("#message");
const sendBtn = document.querySelector("#sendBtn");

function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = `chat-bubble ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const value = message.value.trim();
  if (!value) return;
  addBubble(value, "user");
  message.value = "";
  sendBtn.disabled = true;
  try {
    const response = await fetch("/api/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:value})
    });
    const data = await response.json();
    addBubble(data.response || "Sorry, something went wrong.", "bot");
  } catch {
    addBubble("Unable to reach the chatbot service.", "bot");
  } finally {
    sendBtn.disabled = false;
    message.focus();
  }
}
sendBtn.addEventListener("click", sendMessage);
message.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
document.querySelector("#clearChat").addEventListener("click", () => {
  chat.innerHTML = '<div class="chat-bubble bot">Chat cleared. Ask me a question!</div>';
});
