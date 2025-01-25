import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex w-full max-w-4xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center w-full justify-between gap-2 rounded-lg bg-zinc-950 px-4 py-3">
        <code className="flex-1 text-sm text-zinc-100">{code}</code>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400"
          onClick={copyCommand}
        >
          {copied ? (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
