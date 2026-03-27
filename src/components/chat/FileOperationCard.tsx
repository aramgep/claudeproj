"use client";

import { FileText, Plus, Edit3, Loader2, Check, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolInvocation {
  toolCallId?: string;
  args?: Record<string, any>;
  toolName: string;
  state?: string | "call" | "result" | "partial-call" | "error";
  result?: any;
}

interface FileOperationCardProps {
  toolInvocation: ToolInvocation;
}

interface ParsedFileOperation {
  path: string;
  type: "created" | "modified" | "deleted" | "renamed";
  extension: string;
  purpose?: string;
  targetPath?: string; // For rename operations
}

/**
 * Parses file operation details from tool invocation args and result
 */
function parseFileOperation(toolInvocation: ToolInvocation): ParsedFileOperation | null {
  const { args, toolName } = toolInvocation;

  if (toolName === "str_replace_editor" && args?.path) {
    const path = args.path;
    const extension = path.split(".").pop() || "file";
    const command = args.command || "str_replace";

    return {
      path,
      type: command === "create" ? "created" : "modified",
      extension,
      purpose: args.purpose,
    };
  }

  if (toolName === "file_manager" && args?.path) {
    const path = args.path;
    const extension = path.split(".").pop() || "file";
    const command = args.command || "delete";

    if (command === "delete") {
      return {
        path,
        type: "deleted",
        extension,
      };
    }

    if (command === "rename" && args.new_path) {
      return {
        path,
        type: "renamed",
        extension,
        targetPath: args.new_path,
      };
    }
  }

  return null;
}

/**
 * Returns icon and color based on operation type
 */
function getOperationStyles(type: string): {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
  label: string;
} {
  switch (type) {
    case "created":
      return {
        icon: <Plus className="w-4 h-4" />,
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        label: "Created",
      };
    case "modified":
      return {
        icon: <Edit3 className="w-4 h-4" />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        label: "Modified",
      };
    case "deleted":
      return {
        icon: <Trash2 className="w-4 h-4" />,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        label: "Deleted",
      };
    case "renamed":
      return {
        icon: <ArrowRight className="w-4 h-4" />,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        label: "Renamed",
      };
    default:
      return {
        icon: <FileText className="w-4 h-4" />,
        bgColor: "bg-neutral-50",
        borderColor: "border-neutral-200",
        textColor: "text-neutral-700",
        label: "Modified",
      };
  }
}

/**
 * User-friendly file operation card
 * Displays file creation/modification details with visual indicators
 */
export function FileOperationCard({ toolInvocation }: FileOperationCardProps) {
  const fileOp = parseFileOperation(toolInvocation);
  const { state, result } = toolInvocation;

  // Fallback to generic tool display if we can't parse file operation
  if (!fileOp) {
    return (
      <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
        {state === "result" && result ? (
          <>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-neutral-700">{toolInvocation.toolName}</span>
          </>
        ) : (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            <span className="text-neutral-700">{toolInvocation.toolName}</span>
          </>
        )}
      </div>
    );
  }

  const styles = getOperationStyles(fileOp.type);
  const isComplete = state === "result" && result;
  const isLoading = state !== "result";

  return (
    <div className="mt-3 w-full">
      <div
        className={cn(
          "rounded-lg p-3 border",
          styles.bgColor,
          styles.borderColor
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn("flex-shrink-0 mt-0.5", styles.textColor)}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
            ) : (
              styles.icon
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Operation type + File extension */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs font-semibold", styles.textColor)}>
                {styles.label}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 bg-white/50 rounded text-neutral-600">
                .{fileOp.extension}
              </span>
            </div>

            {/* File path */}
            <div className="mt-2 break-all">
              <code className="text-xs text-neutral-700 block font-mono leading-relaxed">
                {fileOp.path}
              </code>
            </div>

            {/* Rename target path */}
            {fileOp.targetPath && (
              <>
                <div className="mt-2 flex items-center text-xs text-neutral-500">
                  <ArrowRight className="w-3 h-3 mx-1" />
                </div>
                <code className="text-xs text-neutral-700 block font-mono leading-relaxed">
                  {fileOp.targetPath}
                </code>
              </>
            )}

            {/* Purpose/description */}
            {fileOp.purpose && (
              <div className="mt-2 text-xs text-neutral-600 leading-relaxed">
                {fileOp.purpose}
              </div>
            )}

            {/* Status indicator */}
            {isComplete && (
              <div className={cn("mt-2 flex items-center gap-1 text-xs", styles.textColor)}>
                <Check className="w-3 h-3" />
                <span>Complete</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
