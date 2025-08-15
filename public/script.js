const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
 
form.addEventListener('submit', async function (e) {
  e.preventDefault();
 
  const userMessage = input.value.trim();
  if (!userMessage) return;
 
  appendMessage('user', userMessage);
  input.value = '';
 
  // Create a placeholder for the bot's response and show a thinking message
  const botMessageElement = appendMessage('bot', 'Gemini is thinking...');
 
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ reply: `Server error: ${response.statusText}` }));
      throw new Error(errorData.reply);
    }
 
    const data = await response.json();
    // Update the bot message element with the actual response
    botMessageElement.textContent = data.reply;
  } catch (error) {
    // Update the bot message element with the error message
    botMessageElement.textContent = `Error: ${error.message}`;
  }
});
 
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
