import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./lib/validation";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";

// NextAuth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        // Validate the credentials using the SignInSchema
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Fetch the existing account by provider (email in this case)
          const { data: existingAccount } = (await api.accounts.getByProvider(email)) as ActionResponse<IAccountDoc>;
          if (!existingAccount) return null;

          // Fetch the associated user by userId
          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;
          if (!existingUser) return null;

          // Compare the provided password with the stored hashed password
          const isValidPassword = await bcrypt.compare(password, existingAccount.password!);
          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],

  // Callbacks to handle session JWT token and sign-in logic
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        // Fetch the existing account by provider (email in this case)
        const { data: existingAccount, success } = (await api.accounts.getByProvider(
          account.type === "credentials" ? token.email! : account.providerAccountId
        )) as ActionResponse<IAccountDoc>;
        if (!success || !existingAccount) return token;

        // Update the token's subject with the userId from the existing account
        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }

      // Return the updated token
      return token;
    },

    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      // Prepare user information for OAuth sign-in
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: account.provider === "github" ? (profile?.login as string) : (user.name?.toLowerCase() as string),
      };

      // Call the OAuth sign-in API
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      // Check if the OAuth sign-in was successful and if yes return true
      if (!success) return false;
      return true;
    },
  },
});
