import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock Next.js cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));

// Import after mocking
import { createSession, getSession, deleteSession } from "../auth";

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieStore.set.mockClear();
  });

  it("should create a session and set auth-token cookie", async () => {
    const userId = "user-123";
    const email = "test@example.com";

    await createSession(userId, email);

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    
    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[0]).toBe("auth-token");
    expect(typeof callArgs[1]).toBe("string"); // JWT token
    expect(callArgs[2]).toEqual(
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      })
    );
  });

  it("should set JWT token with correct payload", async () => {
    const userId = "user-456";
    const email = "john@example.com";

    await createSession(userId, email);

    const token = mockCookieStore.set.mock.calls[0][1];
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // Valid JWT format (header.payload.signature)
  });

  it("should set cookie expiration to 7 days from now", async () => {
    const userId = "user-789";
    const email = "jane@example.com";
    
    const beforeTime = Date.now();
    await createSession(userId, email);
    const afterTime = Date.now();

    const callArgs = mockCookieStore.set.mock.calls[0];
    const expiresDate = callArgs[2].expires;

    // Should be approximately 7 days from now (within 1 second tolerance)
    const expectedExpiration = 7 * 24 * 60 * 60 * 1000;
    const actualExpiration = expiresDate.getTime() - beforeTime;

    expect(actualExpiration).toBeGreaterThan(expectedExpiration - 1000);
    expect(actualExpiration).toBeLessThan(expectedExpiration + 1000);
  });

  it("should set httpOnly flag for security", async () => {
    await createSession("user-abc", "user@test.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].httpOnly).toBe(true);
  });

  it("should set sameSite to lax for CSRF protection", async () => {
    await createSession("user-def", "user2@test.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].sameSite).toBe("lax");
  });

  it("should set path to root", async () => {
    await createSession("user-ghi", "user3@test.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].path).toBe("/");
  });

  it("should set secure flag in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await createSession("user-prod", "prod@example.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].secure).toBe(true);

    vi.unstubAllEnvs();
  });

  it("should not set secure flag in development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    mockCookieStore.set.mockClear();
    await createSession("user-dev", "dev@example.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].secure).toBe(false);

    vi.unstubAllEnvs();
  });

  it("should handle special characters in email", async () => {
    const specialEmail = "user+test@example.co.uk";

    await createSession("user-special", specialEmail);

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const token = mockCookieStore.set.mock.calls[0][1];
    expect(token).toBeDefined();
  });

  it("should handle long userId", async () => {
    const longUserId = "user-".concat("a".repeat(100));

    await createSession(longUserId, "test@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const token = mockCookieStore.set.mock.calls[0][1];
    expect(token).toBeDefined();
  });

  it("should create valid JWT token with correct algorithm", async () => {
    await createSession("user-jwt", "jwt@example.com");

    const token = mockCookieStore.set.mock.calls[0][1];
    const parts = token.split(".");

    // Decode header
    const header = JSON.parse(
      Buffer.from(parts[0], "base64").toString("utf-8")
    );
    expect(header.alg).toBe("HS256");
  });

  it("should set token cookie name correctly", async () => {
    await createSession("user-token", "token@example.com");

    const cookieName = mockCookieStore.set.mock.calls[0][0];
    expect(cookieName).toBe("auth-token");
  });

  it("should be callable multiple times with different users", async () => {
    await createSession("user1", "user1@example.com");
    await createSession("user2", "user2@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);

    const firstCall = mockCookieStore.set.mock.calls[0];
    const secondCall = mockCookieStore.set.mock.calls[1];

    expect(firstCall[1]).not.toBe(secondCall[1]); // Tokens should be different
  });

  it("should include userId and email in token payload", async () => {
    const userId = "user-payload";
    const email = "payload@example.com";

    await createSession(userId, email);

    const token = mockCookieStore.set.mock.calls[0][1];
    const parts = token.split(".");

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    expect(payload.userId).toBe(userId);
    expect(payload.email).toBe(email);
  });

  it("should include expiration time in token payload", async () => {
    await createSession("user-exp", "exp@example.com");

    const token = mockCookieStore.set.mock.calls[0][1];
    const parts = token.split(".");

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    expect(payload.exp).toBeDefined();
    expect(typeof payload.exp).toBe("number");
    // exp should be approximately 7 days from now
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    expect(payload.exp).toBeGreaterThan(nowInSeconds + sevenDaysInSeconds - 10);
    expect(payload.exp).toBeLessThan(nowInSeconds + sevenDaysInSeconds + 10);
  });

  it("should include issued-at claim in token", async () => {
    await createSession("user-iat", "iat@example.com");

    const token = mockCookieStore.set.mock.calls[0][1];
    const parts = token.split(".");

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    expect(payload.iat).toBeDefined();
    expect(typeof payload.iat).toBe("number");
    // iat should be close to now
    const nowInSeconds = Math.floor(Date.now() / 1000);
    expect(payload.iat).toBeGreaterThanOrEqual(nowInSeconds - 5);
    expect(payload.iat).toBeLessThanOrEqual(nowInSeconds + 5);
  });

  it("should handle empty userId", async () => {
    // Edge case: While not ideal, the function should handle it without crashing
    await createSession("", "user@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
  });

  it("should handle empty email", async () => {
    // Edge case: While not ideal, the function should handle it without crashing
    await createSession("user-123", "");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
  });

  it("should call cookies() from next/headers", async () => {
    const { cookies } = await import("next/headers");
    const cookiesMock = vi.mocked(cookies);
    cookiesMock.mockClear();

    await createSession("user-cookies", "cookies@example.com");

    expect(cookiesMock).toHaveBeenCalled();
  });
});
