import { vi } from "vitest";

// Mock server-only module to allow testing server functions
vi.mock("server-only", () => ({}));
