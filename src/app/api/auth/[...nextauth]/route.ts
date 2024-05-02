import {NextAuthOption} from './options';
import NextAuth from 'next-auth/next';

const Handler = NextAuth(NextAuthOption);

export {
    Handler as GET,
    Handler as POST
}