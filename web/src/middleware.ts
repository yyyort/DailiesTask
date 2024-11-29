import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setAccessToken } from "./service/authService";

export const config = {
    matcher: [
        '/',
        '/tasks'
    ],
}

// Middleware to check if the request is authenticated
export async function middleware(request: NextRequest) {
    const protectedRoutes = [
        '/',
        '/tasks'
    ];

    const isProtectedRoute = protectedRoutes.some(
        (route) => request.nextUrl.pathname === route
    );

    if (isProtectedRoute) {
        return validateToken(request)
    }
    return NextResponse.next()
}


// middleware to check if the user is authenticated
export async function validateToken(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value

    console.log(refreshToken)

    if (!refreshToken) {
        //redirect to the signin page
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // revalidate the access token
    try {
        const res = await fetch('http://localhost:4000/api/user/revalidate', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`
            },
            cache: 'force-cache',
            next: {
                // revalidate for 15 minutes as the access token expires in 15 minutes
                revalidate: 15 * 60
            }
        })

        if (res.ok) {
            //set the new access token in the header
            const { accessToken } = await res.json()


            //set the new access token in the cookie
            await setAccessToken(accessToken);

            request.headers.set('Authorization', `Bearer ${accessToken}`)     
        

            //redirect to the requested page
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL('/signin', request.url))
        }
    } catch (error) {
        console.log(error)
    }
}