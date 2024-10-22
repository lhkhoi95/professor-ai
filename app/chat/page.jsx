'use client';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function ChatPage() {
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  const imageUrl = user?.imageUrl;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. I can help you find information about these schools:

**University of Florida**
      
**San Jose State University**

**California State University San Bernardino**
    
  What would you like to know?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false); // State to track if streaming

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isStreaming) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setIsStreaming(true); // Start streaming

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsStreaming(false); // End streaming
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col p-4">
      <div className="flex flex-grow flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="flex-start mb-4 mr-4 flex gap-4 dark:text-gray-200 text-white">
              <Avatar>
                {msg.role === 'user' ? (
                  <Image
                    src={imageUrl}
                    alt="User Image"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image
                    src="/images/logo.png"
                    alt="Assistant Image"
                    width={40}
                    height={40}
                  />
                )}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                className="prose prose-invert max-w-none rounded-lg dark:bg-[#2f2f2f] bg-[#c0c0c0] p-3"
                dangerouslySetInnerHTML={{ __html: marked(msg.content) }}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 flex items-center gap-2 pb-2">
        <input
          aria-label="message input box"
          placeholder="Type message here..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow rounded-md bg-[#F5F5F4] dark:bg-[#2f2f2f] p-3 text-white dark:text-gray-200 placeholder-gray-400 outline-none"
        />
        <Button
          aria-label="send message button"
          onClick={sendMessage}
          className="px-6 py-3"
          disabled={isStreaming} // Disable the button if streaming
        >
          Send
        </Button>
      </div>
    </div>
  );
}
