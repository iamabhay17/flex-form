"use client";

import * as React from "react";
import { Check, Copy, File, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CodePreviewProps {
  files: Record<
    string,
    {
      name: string;
      code: string;
      language?: string;
      highlightLines: number[];
    }
  >;
  activePage: string;
}

export function CodePreview({ files, activePage }: CodePreviewProps) {
  const [activeFile, setActiveFile] = React.useState<string>(activePage);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect file language from extension
  const getLanguage = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
        return "javascript";
      case "jsx":
        return "jsx";
      case "ts":
        return "typescript";
      case "tsx":
        return "tsx";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      default:
        return "typescript";
    }
  };

  return (
    <div className="flex h-[600px] w-full max-w-4xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Sidebar */}
      <div className="flex-none w-48 border-r border-zinc-800 bg-zinc-900/50">
        <div className="p-3 text-xs font-medium text-zinc-400">EXPLORER</div>
        <div className="space-y-1 p-2">
          {Object.entries(files).map(([key, file]) => (
            <button
              key={key}
              onClick={() => setActiveFile(key)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800/50",
                activeFile === key && "bg-zinc-800/75 text-zinc-100"
              )}
            >
              <File className="h-4 w-4" />
              {file.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* File Header */}
        <div className="flex h-9 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              {files[activeFile].name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400"
              onClick={() => copyToClipboard(files[activeFile].code)}
            >
              <AnimatePresence>
                {copied ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-green-500"
                  >
                    <Check className="h-3 w-3" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Copy className="h-3 w-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <ScrollArea className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFile}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="min-w-fit"
            >
              <CodeBlock
                code={files[activeFile].code}
                language={
                  files[activeFile].language ||
                  getLanguage(files[activeFile].name)
                }
                highlightLines={files[activeFile].highlightLines}
              />
            </motion.div>
          </AnimatePresence>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  language: string;
  highlightLines?: number[];
}

function CodeBlock({ code, language, highlightLines = [] }: CodeBlockProps) {
  // Customize the syntax highlighter theme
  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "transparent",
      margin: 0,
      padding: "1rem",
    },
  };

  // Custom line renderer to support line highlighting
  const lineProps = (lineNumber: number) => {
    const style: React.CSSProperties = {
      display: "table-row",
    };

    if (highlightLines.includes(lineNumber)) {
      style.backgroundColor = "rgba(255, 255, 255, 0.05)";
    }

    return { style };
  };

  return (
    <div className="relative min-w-fit">
      <SyntaxHighlighter
        language={language}
        style={customStyle}
        showLineNumbers
        wrapLines
        lineProps={lineProps}
        customStyle={{
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
          minWidth: "fit-content",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
