import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readToken } from 'src/lib/jwt'

export async function middleware(req: NextRequest) {
    if (req.method === "POST") {
        if (req.nextUrl.pathname.startsWith('/api/user/')) {
            return NextResponse.next()
        }
        const response = NextResponse.next()
        console.log(req.nextUrl.pathname, readToken(req.cookies['token']).studentId, await req.text())
        console.log(response.status, await response.text())
        return response
    } else {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.rewrite(url)
    }
}
