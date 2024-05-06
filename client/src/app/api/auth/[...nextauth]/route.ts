import NextAuth from "next-auth";
import {googleOption} from "@/app/api/auth/googleOption";

const handler = NextAuth(googleOption);

export {handler as GET, handler as POST};