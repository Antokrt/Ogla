import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";


async function refreshAccessToken(tokenObject) {
    try {

        const config = {
            headers: { Authorization: `Bearer ${tokenObject}` }
        };
        const tokenResponse = await axios.post('http://localhost:3008/auth/refresh/',{
            token: tokenObject.refreshToken
        })

        return {
            ...tokenObject,
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken
        }
    } catch (error) {
        console.log('tokenObject')

        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",
        }
    }
}


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
                if (res.ok && user) {
                    return user
                }
                return null;
            }

        }),
        CredentialsProvider({
            id:'signup',
            async authorize (credentials,req){
                const payload = {
                    email: credentials.email,
                    pseudo:credentials.pseudo,
                    password:credentials.password,
                    is_author: false
                }
                const res = await fetch('http://localhost:3008/user/register',{
                    method:'POST',
                    body:JSON.stringify(payload),
                    headers:{
                        'Content-Type':'application/json',
                        tenant:credentials.tenantKey,
                    }
                })

                const user = await res.json();

                if (!res.ok && user) {
                    console.log(user.message)
                    throw new Error(user.message)
                }
                if (res.ok && user) {
                    return user
                }
                return null;
            }
        }),
        CredentialsProvider({
            id:'signupAuthor',
            async authorize (credentials,req){
                const payload = credentials;
                payload.is_author = true;
                const res = await fetch('http://localhost:3008/user/register',{
                    method:'POST',
                    body:JSON.stringify(payload),
                    headers:{
                        'Content-Type':'application/json',
                        tenant:credentials.tenantKey,
                    }
                })

                const user = await res.json();

                if (!res.ok && user) {
                    console.log(user.message)
                    throw new Error(user.message)
                }
                if (res.ok && user) {
                    return user
                }
                return null;
            }
        }),
    ],

    pages: {
        signIn: '/auth?login',
    },

    callbacks: {

        async signIn({user}) {
            if (user){
                return user;
            }
            return false;
        },


        async jwt({token,user}) {
            if(user) {
                token.accessToken = user?.accessToken;
                token.refreshToken = user?.refreshToken;
            }

            const shouldRefreshTime = Math.round((token?.exp - 60 * 60 * 1000) - Date.now());

            if (shouldRefreshTime < 0) {
                return Promise.resolve(token)
            }
            token = refreshAccessToken(token);
            return Promise.resolve(token);
        },

        async session({session,token,user}) {
            const bearerToken = token?.accessToken;
            const config = {
                headers: { Authorization: `Bearer ${bearerToken}` }
            };
           await axios.get('http://localhost:3008/user/profil',config)
                .then((res) => {
                    session.user.id = res.data._id;
                    session.user.pseudo = res.data.pseudo;
                    session.user.email = res.data.email;
                    session.user.image = res.data.img;
                    session.user.date_birth = res.data.date_birth;
                    session.user.is_author = res.data.is_author;
                })
                .catch((err) => console.log(err.response.data))
                    session.user.accessToken = token?.accessToken;
                    return session;

        }

    },
    secret: 'code'
})

