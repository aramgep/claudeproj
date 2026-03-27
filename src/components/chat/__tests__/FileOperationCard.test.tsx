import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileOperationCard } from "../FileOperationCard";

describe("FileOperationCard", () => {
  describe("File Creation", () => {
    it("displays created file with extension badge and status", () => {
      const toolInvocation = {
        toolCallId: "tool-1",
        toolName: "str_replace_editor",
        args: {
          command: "create",
          path: "src/components/Button.tsx",
          purpose: "Reusable button component with variants",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Created")).toBeDefined();
      expect(screen.getByText(".tsx")).toBeDefined();
      expect(screen.getByText("src/components/Button.tsx")).toBeDefined();
      expect(
        screen.getByText("Reusable button component with variants")
      ).toBeDefined();
      expect(screen.getByText("Complete")).toBeDefined();
    });

    it("displays created file without purpose", () => {
      const toolInvocation = {
        toolCallId: "tool-2",
        toolName: "str_replace_editor",
        args: {
          command: "create",
          path: "src/utils/helpers.ts",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Created")).toBeDefined();
      expect(screen.getByText(".ts")).toBeDefined();
      expect(screen.getByText("src/utils/helpers.ts")).toBeDefined();
      expect(screen.queryByText("Complete")).toBeDefined();
    });

    it("shows loading spinner when creating file", () => {
      const toolInvocation = {
        toolCallId: "tool-3",
        toolName: "str_replace_editor",
        args: {
          command: "create",
          path: "src/services/api.ts",
        },
        state: "partial-call" as const,
      };

      const { container } = render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Created")).toBeDefined();
      expect(screen.getByText("src/services/api.ts")).toBeDefined();
      // Should have a loading spinner
      expect(container.querySelector("svg")).toBeDefined();
      expect(screen.queryByText("Complete")).toBeNull();
    });
  });

  describe("File Modification", () => {
    it("displays modified file with extension badge", () => {
      const toolInvocation = {
        toolCallId: "tool-4",
        toolName: "str_replace_editor",
        args: {
          command: "str_replace",
          path: "src/components/Header.tsx",
          purpose: "Updated header to support dark mode",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Modified")).toBeDefined();
      expect(screen.getByText(".tsx")).toBeDefined();
      expect(screen.getByText("src/components/Header.tsx")).toBeDefined();
      expect(
        screen.getByText("Updated header to support dark mode")
      ).toBeDefined();
    });

    it("handles insert command as modification", () => {
      const toolInvocation = {
        toolCallId: "tool-5",
        toolName: "str_replace_editor",
        args: {
          command: "insert",
          path: "src/styles/globals.css",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Modified")).toBeDefined();
      expect(screen.getByText(".css")).toBeDefined();
    });
  });

  describe("File Deletion", () => {
    it("displays deleted file with appropriate styling", () => {
      const toolInvocation = {
        toolCallId: "tool-6",
        toolName: "file_manager",
        args: {
          command: "delete",
          path: "src/components/OldComponent.tsx",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Deleted")).toBeDefined();
      expect(screen.getByText(".tsx")).toBeDefined();
      expect(screen.getByText("src/components/OldComponent.tsx")).toBeDefined();
    });
  });

  describe("File Rename", () => {
    it("displays renamed file with source and target paths", () => {
      const toolInvocation = {
        toolCallId: "tool-7",
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "src/components/OldName.tsx",
          new_path: "src/components/NewName.tsx",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("Renamed")).toBeDefined();
      expect(screen.getByText("src/components/OldName.tsx")).toBeDefined();
      expect(screen.getByText("src/components/NewName.tsx")).toBeDefined();
    });
  });

  describe("Long File Paths", () => {
    it("handles long file paths with wrapping", () => {
      const longPath = "src/components/features/admin/dashboard/widgets/charts/BarChart.tsx";
      const toolInvocation = {
        toolCallId: "tool-8",
        toolName: "str_replace_editor",
        args: {
          command: "create",
          path: longPath,
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText(longPath)).toBeDefined();
      expect(screen.getByText(".tsx")).toBeDefined();
    });
  });

  describe("Fallback Behavior", () => {
    it("shows generic tool display for unknown tools", () => {
      const toolInvocation = {
        toolCallId: "tool-9",
        toolName: "unknown_tool",
        args: {},
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("unknown_tool")).toBeDefined();
    });

    it("shows generic display when str_replace_editor has no path", () => {
      const toolInvocation = {
        toolCallId: "tool-10",
        toolName: "str_replace_editor",
        args: {
          command: "view",
        },
        state: "result" as const,
        result: { success: true },
      };

      render(<FileOperationCard toolInvocation={toolInvocation} />);

      expect(screen.getByText("str_replace_editor")).toBeDefined();
    });
  });

  describe("File Extensions", () => {
    it("extracts and displays various file extensions", () => {
      const extensions = [
        { path: "file.tsx", expected: ".tsx" },
        { path: "styles.css", expected: ".css" },
        { path: "config.json", expected: ".json" },
        { path: "script.js", expected: ".js" },
        { path: "types.ts", expected: ".ts" },
      ];

      extensions.forEach(({ path, expected }) => {
        const { unmount } = render(
          <FileOperationCard
            toolInvocation={{
              toolCallId: "tool",
              toolName: "str_replace_editor",
              args: { command: "create", path },
              state: "result" as const,
              result: { success: true },
            }}
          />
        );

        expect(screen.getByText(expected)).toBeDefined();
        unmount();
      });
    });
  });

  describe("Component State", () => {
    it("displays different states for loading vs complete", () => {
      const { rerender } = render(
        <FileOperationCard
          toolInvocation={{
            toolCallId: "tool-11",
            toolName: "str_replace_editor",
            args: { command: "create", path: "test.tsx" },
            state: "partial-call" as const,
          }}
        />
      );

      expect(screen.queryByText("Complete")).toBeNull();

      rerender(
        <FileOperationCard
          toolInvocation={{
            toolCallId: "tool-11",
            toolName: "str_replace_editor",
            args: { command: "create", path: "test.tsx" },
            state: "result" as const,
            result: { success: true },
          }}
        />
      );

      expect(screen.getByText("Complete")).toBeDefined();
    });
  });
});
