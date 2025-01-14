import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken, setAccessToken, setLastLogin, setUserData } from "./service/auth/authService";

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
        await validateToken(request)
        await taskResets(request)
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
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`
            },
        })
        if (res.status === 401) {
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
            return NextResponse.redirect(new URL('/signin', request.url))
        }
    } catch (error) {
        console.error(error)
    }
}

export async function taskResets(request: NextRequest) {
    try {
        const accessToken = await getAccessToken();
        const lastLogin = request.cookies.get('lastLogin')?.value;


        if (new Date().toISOString().split('T')[0] > (lastLogin ?? '') || !lastLogin) {
            const res = await fetch(api + '/user/tasksReset', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
            })

            if (res.ok) {

                await setLastLogin(new Date().toISOString().split('T')[0])

                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL('/signin', request.url))
            }
        } else {
            return NextResponse.next()
        }

    } catch (error) {
        console.error(error)
    }
}