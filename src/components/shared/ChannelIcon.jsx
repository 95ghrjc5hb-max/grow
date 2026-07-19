import React from "react";
import { MessageCircle, Instagram, Phone } from "lucide-react";

const channelConfig = {
  messenger: { icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10", label: "Messenger" },
  instagram: { icon: Instagram, color: "text-pink-400", bg: "bg-pink-500/10", label: "Instagram" },
  whatsapp: { icon: Phone, color: "text-green-400", bg: "bg-green-500/10", label: "WhatsApp" },
};

export default function ChannelIcon({ channel, size = "sm", showLabel = false }) {
  const config = channelConfig[channel] || channelConfig.messenger;
  const Icon = config.icon;
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  const padClass = size === "sm" ? "p-1.5" : size === "md" ? "p-2" : "p-2.5";

  return (
    <div className="flex items-center gap-2">
      <div className={`${padClass} rounded-lg ${config.bg}`}>
        <Icon className={`${sizeClass} ${config.color}`} />
      </div>
      {showLabel && <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>}
    </div>
  );
}