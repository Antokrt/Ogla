import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";
import jwt from 'jsonwebtoken';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";



async function refreshAccessToken(tokenObject) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${tokenObject.refreshToken}` }
        };

        const tokenResponse = await axios.get('http://localhost:3008/auth/refresh/',config);

        return {
            ...tokenObject,
            accessToken: tokenResponse.data.accessToken,
            refreshToken: tokenResponse.data.refreshToken
        }
    } catch (error) {
        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",
        }
    }
}

async function getExpFromToken(token){
    try {
        const decoded = await jwt.decode(token,'code');
        return decoded.exp;
    }
    catch (e) {
        console.log(e);
    }
}

function isExpire(token) {
    if(!token){
        return true;
    }
    return token < Date.now() / 1000;
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
                    return await user;
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
            return !!user;
        },


        async jwt({token,user}) {

            if(user) {
                token.accessToken = user?.accessToken;
                token.refreshToken = user?.refreshToken;
            }

          const expAccessToken = await getExpFromToken(token.accessToken);

            let tokenHasExpire = isExpire(expAccessToken);

            if (!tokenHasExpire) {
                return Promise.resolve(token)
            }

            token = await refreshAccessToken(token);
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
                    session.user.accessToken = bearerToken;
                })
               .catch((err) => false);
                         return session;

        }

    },
    secret: 'code',
    session:{
        maxAge: 604800  // 7 jours
    }


})

