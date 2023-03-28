import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const { topicId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // 在组件挂载时获取指定 Topic 下的所有 Conversations
    getConversations();
  }, []);

  async function getConversations() {
    try {
      const response = await axios.get(`/api/topic/${topicId}/conversations`);
      setConversation(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleInputSubmit(event) {
    event.preventDefault();
    if (inputValue) {
      try {
        // 调用 /api/conversation/generate 接口，生成 GPT 回复
        const response = await axios.post('/api/conversation/generate', {
          topicId,
          role: 'user',
          text: inputValue,
        });
        // 将用户输入的消息和 GPT 的回复添加到 Conversation 中
        setConversation((conversation) => [
          ...conversation,
          { role: 'user', text: inputValue },
          { role: 'gpt', text: response.data.text },
        ]);
        // 清空输入框
        setInputValue('');
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <ul>
        {conversation.map((item, index) => (
          <li key={index}>
            {item.role === 'user' ? 'You: ' : 'GPT: '}
            {item.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleInputSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
