import NextAuth from "next-auth";
import authOptions from "@/components/Auth/AuthOptions";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };