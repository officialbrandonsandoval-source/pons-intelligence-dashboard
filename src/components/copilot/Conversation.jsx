import { useEffect, useRef } from 'react';

function Conversation({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="conversation__messages" aria-label="Conversation">
      {messages.map((m) => (
        <div key={m.id} className={`msg ${m.role === 'user' ? 'is-user' : 'is-assistant'}`}>
          <div className="msg__role">{m.role === 'user' ? 'You' : 'Copilot'}</div>
          <div className="msg__bubble">{m.content}</div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

export default Conversation;
