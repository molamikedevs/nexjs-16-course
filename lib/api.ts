import { IUser } from "@/database/user.model";
import { fetchHandler } from "./handlers/fetch";
import { IAccount } from "@/database/account.model";
import { SignInWithOAuthParams } from "@/types/action";
import { siteConfig } from "@/config/site";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  // Placeholder for authentication-related API calls
  auth: {
    oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithOAuthParams) => {
      return fetchHandler(`${API_BASE_URL}/auth/${siteConfig.ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      });
    },
  },

  // User-related API calls
  users: {
    getAll: async () => fetchHandler(`${API_BASE_URL}/users`),
    getById: async (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: async (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: async (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: async (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: async (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      }),
  },

  // Account-related API calls
  accounts: {
    getAll: async () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: async (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: async (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: async (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: async (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: async (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      }),
  },
};