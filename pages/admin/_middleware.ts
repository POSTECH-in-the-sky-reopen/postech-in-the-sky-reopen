import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readToken } from 'src/lib/jwt'

export function middleware(req: NextRequest) {
    const token = req.cookies['token']
    try {
        const payload = readToken(token)
        if (payload.isAdmin) {
            return NextResponse.next()
        } else {
            const url = req.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.rewrite(url)
        }
    } catch (err) {
        const url = req.nextUrl.clone()
        url.pathname = '/user/sign-in'
        return NextResponse.rewrite(url)
    }
}
