import { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Circle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
  showSender?: boolean;
  showDateSeparator?: boolean;
  dateLabel?: string;
}

export default function ChatMessage({ message, showAvatar = true, showSender = false, showDateSeparator = false, dateLabel }: ChatMessageProps) {
  const isOwnMessage = message.isOwn;

  const getStatusIcon = (status?: string) => {
    if (!isOwnMessage) return null;
    switch (status) {
      case "sent":
        return <Circle className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (message.type === "audio") {
      return (
        <audio controls className="w-48">
          <source src={message.content} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      );
    }
    if (message.type === "file") {
      return (
        <a href={message.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
          Download file
        </a>
      );
    }
    // Highlight @mentions
    const parts = message.content.split(/(@[\w]+)/g);
    return (
      <p className="text-sm leading-relaxed">
        {parts.map((part, i) =>
          part.startsWith('@') ? (
            <span key={i} className="font-semibold text-purple-600">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  };

  return (
    <>
      {showDateSeparator && dateLabel && (
        <div className="flex justify-center my-4">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">{dateLabel}</span>
        </div>
      )}
      <div className={`flex items-end gap-2 mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && showAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={`/avatars/${message.senderId}.jpg`} alt={message.sender} />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
              {message.sender.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {showSender && !isOwnMessage && (
            <span className="text-xs text-gray-500 mb-1 px-2 font-semibold">{message.sender}</span>
          )}
          <div className={`flex items-end gap-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
              }`}
            >
              {renderContent()}
            </div>
            <div className={`flex items-center gap-1 text-xs text-gray-400 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              {getStatusIcon(message.status)}
              <span>{message.time}</span>
            </div>
          </div>
        </div>
        {isOwnMessage && showAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/avatars/currentUser.jpg" alt="You" />
            <AvatarFallback className="text-xs bg-[#009688] text-white">
              Y
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </>
  );
} 