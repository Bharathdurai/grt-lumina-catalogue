import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface Props {
  pincode: string;
  onPincodeChange: (pincode: string) => void;
}

const PincodeModal = ({ pincode, onPincodeChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(pincode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length === 6) {
      onPincodeChange(input.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-medium hover:opacity-90 transition-opacity">
          <MapPin size={14} />
          {pincode ? `Pincode: ${pincode}` : "Pincode"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Check Availability In Your Pincode</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground font-body">
          Find the closest store for browsing our latest designs. Enter your pincode to check stock availability.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter Pincode"
            className="flex-1 px-4 py-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
          <button
            type="submit"
            className="px-6 py-2.5 gradient-gold text-primary-foreground rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            SUBMIT
          </button>
        </form>
        {pincode && (
          <button
            onClick={() => {
              onPincodeChange("");
              setOpen(false);
            }}
            className="text-xs text-muted-foreground font-body hover:text-primary mt-2"
          >
            Clear pincode filter
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PincodeModal;
