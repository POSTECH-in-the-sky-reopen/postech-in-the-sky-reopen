import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from 'src/lib/jwt'

export function middleware(req: NextRequest) {
    const token = req.cookies['token']
    try {
        verifyToken(token)
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.rewrite(url)
    } catch (err) {
        return NextResponse.next()
    }
}
