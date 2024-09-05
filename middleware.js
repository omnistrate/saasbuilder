import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { baseURL } from "src/axios";
import { getEnvironmentType } from "src/server/utils/getEnvironmentType";

const environmentType = getEnvironmentType();

const redirectToSignIn = (request) => {
  const path = request.nextUrl.pathname;

  // Prevent Redirecting to the Same Page
  if (path.startsWith("/signin")) return;

  const redirectPath = "/signin";

  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  response.headers.set(`x-middleware-cache`, `no-cache`);
  return response;
};

const redirectToDestination = (request) => {
  // Get the Destination URL from the Query Parameters
  const destination = request.nextUrl.searchParams.get("destination");

  // Decode the Destination URL if it starts with %2Fservice-plans - Allow Redirecting to Service Plans Page
  const decodedDestination =
    destination && destination.startsWith("%2Fservice-plans")
      ? decodeURIComponent(destination)
      : "/service-plans";

  const response = NextResponse.redirect(
    new URL(decodedDestination, request.url)
  );
  response.headers.set(`x-middleware-cache`, `no-cache`);
  return response;
};

export async function middleware(request) {
  const authToken = request.cookies.get("token");
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/signup") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/change-password")
  ) {
    if (environmentType === "PROD") return;
  }

  if (!authToken?.value || jwtDecode(authToken.value).exp < Date.now() / 1000) {
    return redirectToSignIn(request);
  }

  try {
    const userData = await fetch(`${baseURL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    if (userData?.status !== 200) {
      return redirectToSignIn(request);
    }
    //subscriptions page should only be accessible in PROD
    if (request.nextUrl.pathname.startsWith("/subscriptions")) {
      if (environmentType !== "PROD") {
        redirectToDestination(request);
      }
    }

    if (request.nextUrl.pathname.startsWith("/signin")) {
      redirectToDestination(request);
    }
  } catch (error) {
    console.log("Middleware Error", error?.response?.data);
    redirectToSignIn(request);
  }

  const response = NextResponse.next();
  response.headers.set(`x-middleware-cache`, `no-cache`);
  return response;
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
    "/((?!api/action|api/signup|api/signin|api/reset-password|api/provider-details|idp-auth|api/sign-in-with-idp|privacy-policy|terms-of-use|favicon.ico|_next/image|_next/static|static|validate-token).*)",
  ],
};
