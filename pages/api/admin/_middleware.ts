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
            return NextResponse.json({ message: '어드민 권한이 없습니다.' })
        }
    } catch (err) {
        const url = req.nextUrl.clone()
        url.pathname = '/sign-in'
        return NextResponse.rewrite(url)
    }
}
