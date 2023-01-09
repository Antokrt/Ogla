import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from "next-auth/providers/google";
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
        Google(
            {
                clientId: '1092772885175-pr1v5209i6c07o52utevpt9q0hp37g3d.apps.googleusercontent.com',
                clientSecret:'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'
            }
        ),

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
                    return null
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

        async signIn({user,account, profile}) {
            if(account.provider === 'google' && profile){
                const data = {
                    user:account,
                    profil:profile
                }
                const res = await fetch('http://localhost:3008/auth/google/redirect',{
                    method:'POST',
                    body: JSON.stringify(data),
                    headers:{
                        'Content-Type':'application/json',
                    }
                })
                const response = await res.json();
                user.accessToken = response.accessToken;
                user.refreshToken = response.refreshToken;
                if(res.ok && user){
                    return user;
                }
            }
            else {
                return !!user;
            }
        },


        async jwt({token,user,account}) {
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
            if(token.error){
                session.error = token.error;
            }
            const config = {
                headers: { Authorization: `Bearer ${bearerToken}` }
            };

            await axios.get('http://localhost:3008/user/profil',config)
                .then((res) => {
                    session.user.id = res.data._id;
                    session.user.pseudo = res.data.pseudo;
                    session.user.email = res.data.email;
                    session.user.image = res.data.img;
                    session.user.provider = res.data.provider;
                    session.user.date_birth = res.data.date_birth;
                    session.user.is_author = res.data.is_author;
                    if(session.user.is_author){
                        session.user.author = res.data.author;
                    }
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

