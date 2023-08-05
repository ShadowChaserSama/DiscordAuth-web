import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";


const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;

if (!discordClientId || !discordClientSecret) {
  throw new Error('Discord client ID or client secret not defined.');
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
   DiscordProvider({
    clientId: discordClientId,
    clientSecret: discordClientSecret
  }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);


