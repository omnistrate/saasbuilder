import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { baseURL } from "src/axios";

export async function middleware(request) {
  const authToken = request.cookies.get("token");

  const redirectToSignIn = () => {
    const path = request.nextUrl.pathname;

    // Prevent Redirecting to the Same Page
    if (path.startsWith("/signin")) return;

    let redirectPath = "/signin";

    return NextResponse.redirect(new URL(redirectPath, request.url));
  };

  if (!authToken?.value || jwtDecode(authToken.value).exp < Date.now() / 1000) {
    return redirectToSignIn();
  }

  try {
    const userData = await fetch(`${baseURL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    if (userData?.status !== 200) {
      return redirectToSignIn();
    }

    if (request.nextUrl.pathname.startsWith("/signin")) {
      return NextResponse.redirect(new URL("/service-plans", request.url));
    }
  } catch (error) {
    console.log(error);
    redirectToSignIn();
  }
}

/*
 * Match all request paths except for the ones starting with:
 * - signup
 * - reset-password
 * - change-password
 * - validate-token
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */

export const config = {
  matcher: [
    "/((?!api/action|api/signup|api/signin|api/reset-password|api/provider-details|privacy-policy|terms-of-use|signup|reset-password|change-password|favicon.ico|_next/image|_next/static|static|validate-token).*)",
  ],
};
