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

                const res = await fetch('http://localhost:3008/auth/login/',{
                    method:'POST',
                    body:JSON.stringify(payload),
                    headers:{
                        'Content-Type':'application/json',
                        tenant:credentials.tenantKey,
                    }
                })

                const user = await res.json();
                if (!res.ok && user) {
                    throw new Error(user.message)
                }

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null;            }

        }),
    ],

    pages: {
        signIn: '/auth?login'
    },

    callbacks: {

        async signIn({user}) {
            if (user){
                return user;
            }
            return false;
        },

        async jwt({token,user}) {
            if(user){
                token.access_token = user?.accessToken;
                return token;
            }
            return token

        },

        async session({session,token,user}) {
            const bearerToken = token?.access_token;
            const config = {
                headers: { Authorization: `Bearer ${bearerToken}` }
            };
           await axios.get('http://localhost:3008/user/profil',config)
                .then((res) => {
                    console.log(res.data)
                    session.user.id = res.data._id;
                    session.user.pseudo = res.data.pseudo;
                    session.user.name = res.data.name;
                    session.user.email = res.data.email;
                    session.user.image = res.data.img;
                    session.user.date_birth = res.data.date_birth;
                    session.user.is_author = res.data.is_author;
                    console.log(session)
                })
                .catch((err) => console.log(err.response.data))


                    session.user.access_token = token?.accessToken;
                    return session;

        }

    },
    secret: 'code'
})