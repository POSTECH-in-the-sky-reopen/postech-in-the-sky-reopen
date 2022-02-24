import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from 'src/lib/jwt'

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/user/') || 
        req.nextUrl.pathname.startsWith('/api/user/') ||
        req.nextUrl.pathname.startsWith('/closed') ) {
        return NextResponse.next()
    }

    const token = req.cookies['token']
    try {
        verifyToken(token)
        return NextResponse.next()
    } catch (err) {
        const url = req.nextUrl.clone()
        url.pathname = '/user/sign-in'
        return NextResponse.rewrite(url)
    }
}