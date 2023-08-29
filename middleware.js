import { NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {GetCategory} from "./pages/api/utils/Category";

export async function middleware(req){

    const token = await getToken({
        req,
        secret:process.env.NEXT_AUTH_SECRET
    });

    if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/profil') && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }


    if (req.nextUrl.pathname.startsWith('/bibliotheque/') && !GetCategory().includes(req.nextUrl.pathname.split('/bibliotheque/')[1])) {
        return NextResponse.redirect(new URL('/bibliotheque/', req.url));
    }


    if (req.nextUrl.pathname.startsWith('/dashboard') && token && !token.is_author) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if(req.nextUrl.pathname === '/dashboard'){
        return NextResponse.redirect(new URL('/dashboard/books',req.url))
    }



    if(req.nextUrl.pathname === '/devenir-ecrivain' && token && token.is_author){
        return NextResponse.redirect(new URL('/bibliotheque',req.url))
    }
}

