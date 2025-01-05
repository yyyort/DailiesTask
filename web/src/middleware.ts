import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { removeAccessToken, removeRefreshToken, setAccessToken, setUserData } from "./service/auth/authService";

const api = process.env.SERVER_URL

export const config = {
    matcher: [
        '/',
        '/tasks',
        '/routines',
        '/notes',
        '/notes/add',
        '/notes/[id]',
    ],
}

// Middleware to check if the request is authenticated
export async function middleware(request: NextRequest) {
    const protectedRoutes = [
        '/',
        '/tasks',
        '/routines',
        '/notes',
    ];


    const isProtectedRoute = protectedRoutes.some(
        (route) => request.nextUrl.pathname === route
    );

    if (isProtectedRoute) {
        return validateToken(request)
        //return NextResponse.next()
    }

    return NextResponse.next()
}


// middleware to check if the user is authenticated
export async function validateToken(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
        //redirect to the signin page
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // revalidate the access token
    try {
        const res = await fetch(api + '/user/revalidate', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`
            },
            cache: 'force-cache',
            next: {
                // revalidate for 15 minutes as the access token expires in 15 minutes
                revalidate: 800,
                tags: ["token"]
            }
        })
        if (res.status === 401) {
            //removes cookies
            await removeRefreshToken();
            await removeAccessToken();

            return NextResponse.redirect(new URL('/signin', request.url))
        }


        if (res.ok) {
            //set the new access token in the header
            const { accessToken, user } = await res.json()

            //set the new access token in the cookie
            await setAccessToken(accessToken);
            await setUserData(user);

            //redirect to the requested page
            return NextResponse.next()
        } else {
            //removes cookies
            await removeRefreshToken();
            await removeAccessToken();

            return NextResponse.redirect(new URL('/signin', request.url))
        }
    } catch (error) {
        console.log(error)
    }
}

