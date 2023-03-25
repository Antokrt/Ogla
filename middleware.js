import { NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {getSession} from "next-auth/react";
import {GetCategory} from "./pages/api/utils/Category";

export async function middleware(req){

    // const session = await getSession({
    //     req:req
    // })
    const token = await getToken({
        req,
        secret:'code'
    })

    if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/profil') && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }



    if (req.nextUrl.pathname.startsWith('/cat/') && !GetCategory().includes(req.nextUrl.pathname.split('/cat/')[1])) {
        console.log(req.nextUrl.pathname.split('/cat/')[1])
        return NextResponse.redirect(new URL('/cat/', req.url));
    }

/*    if (req.nextUrl.pathname.startsWith('/profil') && token && token.is_author) {
        return NextResponse.redirect(new URL('/dashboard/profil', req.url))
    }*/

    if (req.nextUrl.pathname.startsWith('/dashboard') && token && !token.is_author) {
        return NextResponse.redirect(new URL('/', req.url))
    }

}

