import { useState } from "react";
import { MessageCircle, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoldRate } from "@/contexts/GoldRateContext";
import { useNavigate } from "react-router-dom";

type Screen = "main" | "collections" | "goldrate" | "contact";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("main");
  const { goldRate, discountPerGram } = useGoldRate();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    setOpen(false);
    setScreen("main");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold shadow-elevated flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
        aria-label="Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-gold p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                {screen !== "main" && (
                  <button onClick={() => setScreen("main")} className="hover:opacity-80">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <h4 className="font-display font-semibold text-sm">GRT Assistant</h4>
                  <p className="text-xs opacity-80">How can I help you?</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {screen === "main" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3 font-body">
                    Hi! I'm your assistant for GRT Jewellery. How can I help you today?
                  </p>
                  <ChatButton onClick={() => setScreen("collections")}>🛍️ View Collections</ChatButton>
                  <ChatButton onClick={() => setScreen("goldrate")}>💰 Today's Gold Rate</ChatButton>
                  <ChatButton onClick={() => goTo("/contact")}>📅 Book Appointment</ChatButton>
                  <ChatButton onClick={() => setScreen("contact")}>📞 Contact Support</ChatButton>
                </div>
              )}

              {screen === "collections" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3 font-body">Choose a collection:</p>
                  <ChatButton onClick={() => goTo("/shop?category=Rings")}>💍 Rings</ChatButton>
                  <ChatButton onClick={() => goTo("/shop?category=Necklaces")}>📿 Necklaces</ChatButton>
                  <ChatButton onClick={() => goTo("/shop?category=Earrings")}>✨ Earrings</ChatButton>
                  <ChatButton onClick={() => goTo("/shop?category=Bangles")}>⭕ Bangles</ChatButton>
                  <ChatButton onClick={() => goTo("/shop?category=Chains")}>🔗 Chains</ChatButton>
                  <ChatButton onClick={() => goTo("/shop?category=Golusu")}>🦶 Silver Golusu</ChatButton>
                </div>
              )}

              {screen === "goldrate" && (
                <div className="space-y-3">
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-body">Today's Gold Rate</p>
                    <p className="text-xl font-display font-bold text-primary">₹{goldRate.toLocaleString("en-IN")}/g</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-body">Special Offer</p>
                    <p className="text-sm font-body font-semibold text-primary">₹{discountPerGram}/gram discount on all gold!</p>
                  </div>
                  <ChatButton onClick={() => goTo("/shop?metal=Gold")}>Shop Gold Jewellery →</ChatButton>
                </div>
              )}

              {screen === "contact" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-body">Reach us through:</p>
                  <div className="bg-secondary rounded-lg p-3 text-sm font-body space-y-1">
                    <p>📞 +91 98765 43210</p>
                    <p>✉️ info@grtjewellery.com</p>
                    <p>📍 Chennai, Tamil Nadu</p>
                  </div>
                  <ChatButton onClick={() => goTo("/contact")}>Send us a message →</ChatButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ChatButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2.5 rounded-lg bg-secondary hover:bg-primary/10 text-sm font-body text-foreground transition-colors border border-border"
  >
    {children}
  </button>
);

export default ChatBot;
