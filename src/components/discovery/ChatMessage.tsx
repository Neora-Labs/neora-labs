import type { DiscoveryMessage } from "@/types/project";

export function ChatMessage({ message }: { message: DiscoveryMessage }) {
  return <p className={message.role === "user" ? "ml-auto max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-md bg-action px-4 py-3 text-sm leading-6 text-action-fg" : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-md bg-bg-brand-soft px-4 py-3 text-sm leading-6 text-text-primary"}>{message.content}</p>;
}
