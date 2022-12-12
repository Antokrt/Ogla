import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: 'login',
            name: 'login',
            async authorize(credentials, req) {
                const payload = {
                    pseudo: credentials.pseudo,
                    password: credentials.password
                }

                console.log(payload)
                const res = await fetch('http://localhost:3008/auth/login/',{
                    method:'POST',
                    body:JSON.stringify(payload),
                    headers:{
                        'Content-Type':'application/json',
                        tenant:credentials.tenantKey,
                    }
                })

                const user = await res.json();
                console.log(user)
                if (!res.ok && user) {
                    throw new Error(user.message)
                }

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }
                // Return null if user data could not be retrieved
                return null;            }

        }),
        CredentialsProvider({
            id: 'register',
            async authorize(credentials) {
                try {
                    const registerObject = {
                        "pseudo": "josé10",
                        "password": "azerty",
                        "email": "josé2@gmail.com",
                        "is_author": true
                    }
                    return await axios.post('http://localhost:3008/user/register', registerObject);
                } catch (e) {
                    throw new Error("jerjej")
                }
            }
        })
    ],

    pages: {
        signIn: '/auth?login'
    },

    callbacks: {
        async signIn({user}) {
            if (user) return true;
            return 'false';
        },
        async session({session}) {
            session.user.isLoggedIn = true;
            return session;
        },
        async jwt({token, user}) {
            return token;
        }
    },
    secret: 'code'
})