import { NextResponse } from "next/server"

export function middleware(request) {
    const token = request.cookies.get('token')?.value || null;
    const role = request.cookies.get('role')?.value || null;

    if (token) {
        if (role === 'ADMIN' && request.nextUrl.pathname.startsWith('/admin'))
            return NextResponse.next();
        if (role === 'USER' && request.nextUrl.pathname.startsWith('/user'))
            return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup')) return NextResponse.next();
    return NextResponse.redirect(new URL('/signin', request.url))
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/user/:path*',
        '/signin',
        '/signup',
    ]
}