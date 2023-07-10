import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from "next-auth/providers/google";
import axios from "axios";
import jwt from 'jsonwebtoken';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {getToken} from "next-auth/jwt";
import {getConfigOfProtectedRoute} from "../utils/Config";
import {GetFetchPath} from "../utils/Instance";


async function refreshAccessToken(tokenObject) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${tokenObject.refreshToken}` }
        };

        if(config){
            const tokenResponse = await axios.get(GetFetchPath() + 'auth/refresh/',config);
            return {
                ...tokenObject,
                accessToken: tokenResponse.data.accessToken,
                refreshToken: tokenResponse.data.refreshToken
            }
        }



    } catch (error) {
        console.log(error);
        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",
        }
    }
}

async function getExpFromToken(token) {
    try {
        const decoded = await jwt.decode(token, 'code');
        return decoded.exp;
    }
    catch (e) {
        console.log(e);
    }
}

function isExpire(token) {
    if (!token) {
        return true;
    }
    return token < Date.now() / 1000;
}

function getProfil(accessToken) {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    return new Promise((resolve, reject) => {
        axios.get(GetFetchPath() + 'user/profil', config)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export default function (req, res) {
    return NextAuth(req, res, {
        providers: [
            Google(
                {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_SECRET,
                    authorization: {
                        params: {
                            prompt: 'consent',
                            access_type: 'offline',
                            response_type: 'code',
                            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login'
                        }
                    }
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

                    const res = await fetch(GetFetchPath() + 'auth/login/', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                            tenant: credentials.tenantKey,
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
                id: 'signup',
                async authorize(credentials, req) {
                    const payload = {
                        email: credentials.email,
                        pseudo: credentials.pseudo,
                        password: credentials.password,
                        is_author: false
                    }
                    const res = await fetch(GetFetchPath() + 'user/register', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                            tenant: credentials.tenantKey,
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
                id: 'signupAuthor',
                async authorize(credentials) {

                    const payload = credentials;
                    payload.is_author = true;

                    const res = await fetch(GetFetchPath() + 'user/register', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                            tenant: credentials.tenantKey,
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

            async signIn({ user, account, profile }) {
                if (account.provider === 'google' && profile) {
                    const data = {
                        user: account,
                        profil: profile
                    }
                    const res = await fetch(GetFetchPath() + 'auth/google/redirect', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    const response = await res.json();
                    user.accessToken = response.accessToken;
                    user.refreshToken = response.refreshToken;
                    if (res.ok && user) {
                        const accessToken = user.accessToken;
                        const res = await getProfil(accessToken);
                        user.id = res.data._id;
                        user.pseudo = res.data.pseudo;
                        user.email = res.data.email;
                        user.image = res.data.img;
                        user.provider = res.data.provider;
                        user.date_birth = res.data.date_birth;
                        user.verified = res.data.verified;
                        user.settings = res.data.settings;
                        user.is_author = res.data.is_author;
                        if (user.is_author) {
                            user.author = res.data.author;
                        }
                        user.accessToken = accessToken;
                        return user;
                    }
                }
                else {
                    const res = await getProfil(user.accessToken);
                    user.id = res.data._id;
                    user.pseudo = res.data.pseudo;
                    user.email = res.data.email;
                    user.image = res.data.img;
                    user.provider = res.data.provider;
                    user.date_birth = res.data.date_birth;
                    user.is_author = res.data.is_author;
                    user.verified = res.data.verified;
                    user.settings = res.data.settings
                    if (user.is_author) {
                        user.author = res.data.author;
                    }

                    return user;
                }
            },

            async jwt({ token, user, account }) {
                if (user) {
                    token.accessToken = user?.accessToken;
                    token.refreshToken = user?.refreshToken;
                    token.user = user
                }

                const expAccessToken = await getExpFromToken(token.accessToken);

                let tokenHasExpire = isExpire(expAccessToken);

                if (!tokenHasExpire) {
                    return Promise.resolve(token)
                }

                token = await refreshAccessToken(token);

                return Promise.resolve(token);

            },

            async session({ session, token, user }) {
                if (token.error) {
                    session.error = token.error;
                }
                session.user = token.user;
                token.is_author = session.user.is_author;


                if (req.url === '/api/auth/session?update-author') {
                    const config = await getConfigOfProtectedRoute(req);
                    const newAuthor = await fetch(GetFetchPath() + 'author/check', config);
                    const authorJson = await newAuthor.json();
                    if (authorJson.statusCode !== 401) {
                        token.is_author = true;
                        token.pseudo = authorJson.pseudo;
                        session.user.is_author = true;
                        session.user.pseudo = authorJson.pseudo;
                        session.user.author = authorJson.author;
                    }
                    session.user.accessToken = token?.accessToken;
                    return session;
                }

                if (req.url === '/api/auth/session?update-picture') {
                    const res = await getProfil(token?.accessToken);
                    session.user.image = res.data.img;
                    return session;
                }

                if (req.url === '/api/auth/session?email-verified') {
                    const res = await getProfil(token?.accessToken);
                    session.user.verified = res.data.verified;
                    return session;
                }

                if (req.url === '/api/auth/session?new-settings') {
                    const res = await getProfil(token?.accessToken);
                    session.user.settings = res.data.settings
                    return session;
                }

                if(req.url === '/api/auth/session?update-google-provider'){
                    const res = await getProfil(token?.accessToken);
                    session.user.provider = res.data.provider;
                    return session;
                }
                session.user.accessToken = token?.accessToken;
                return session;

            }

        },
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            maxAge: 604800  // 7 jours
        }
    })
}


