import { NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {getSession} from "next-auth/react";

export async function middleware(req){

    const token = await getToken({
        req,
        secret:'code'
    })

    if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/dashboard') && token && !token.is_author) {
        return NextResponse.redirect(new URL('/', req.url))
    }

}

