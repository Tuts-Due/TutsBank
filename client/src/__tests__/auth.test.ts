import { describe, it, expect, beforeEach, vi } from "vitest";
import { authService } from "@/services/api";

describe("Authentication Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await authService.login({
        email: "user@tutsbank.com",
        password: "password123",
      });

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe("user@tutsbank.com");
      expect(response.user.name).toBe("Arthur Dué");
    });

    it("should fail with invalid email", async () => {
      try {
        await authService.login({
          email: "invalid@email.com",
          password: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("Email ou senha inválidos");
      }
    });

    it("should store token in localStorage", async () => {
      await authService.login({
        email: "user@tutsbank.com",
        password: "password123",
      });

      const token = localStorage.getItem("authToken");
      expect(token).toBeDefined();
      expect(token).toMatch(/^mock-token-/);
    });

    it("should store user in localStorage", async () => {
      await authService.login({
        email: "user@tutsbank.com",
        password: "password123",
      });

      const userJson = localStorage.getItem("user");
      expect(userJson).toBeDefined();

      const user = JSON.parse(userJson!);
      expect(user.email).toBe("user@tutsbank.com");
      expect(user.id).toBe("user-001");
    });
  });

  describe("logout", () => {
    it("should clear localStorage on logout", async () => {
      // Login first
      await authService.login({
        email: "user@tutsbank.com",
        password: "password123",
      });

      expect(localStorage.getItem("authToken")).toBeDefined();

      // Logout
      await authService.logout();

      expect(localStorage.getItem("authToken")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      // Login first
      await authService.login({
        email: "user@tutsbank.com",
        password: "password123",
      });

      const user = await authService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user.email).toBe("user@tutsbank.com");
      expect(user.name).toBe("Arthur Dué");
    });

    it("should throw error when not authenticated", async () => {
      try {
        await authService.getCurrentUser();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("Usuário não autenticado");
      }
    });
  });
});
