import { type NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./lib/utils";
import { decodeAccessToken } from "./lib/utils/decodeToken";

const authRoutes = [
	ROUTES.mainSite.signin,
	ROUTES.mainSite.signup,
	ROUTES.adminSite.auth.signup,
	ROUTES.adminSite.auth.signin,
];
const protectedRoutes = ["/dashboard", "/profile"];
const roleBasedRoutes: Record<string, string[]> = {
	"/admin": ["admin"],
	"/lecturer": ["lecturer"],
	"/student": ["student", "lecturer"],
};

const isAuthenticated = (req: NextRequest): boolean => {
	const accessToken = req.cookies.get("accessToken")?.value;

	return !!accessToken;
};

const getRedirectUrl = (
	req: NextRequest,
	authenticated: boolean,
): string | null => {
	const { pathname } = req.nextUrl;

	if (authenticated) {
		if (authRoutes.includes(pathname)) return "/";
	} else {
		if (protectedRoutes.includes(pathname)) return "/sign-in";
	}

	return null;
};

const hasRequiredRole = (req: NextRequest, requiredRole: string): boolean => {
	const accessToken = req.cookies.get("accessToken")?.value;

	if (!accessToken) return false;

	try {
		const decoded = decodeAccessToken(accessToken);

		return decoded?.role === requiredRole;
	} catch (error) {
		console.error("Token validation error:", error);

		return false;
	}
};

const hasAccessToRoute = (req: NextRequest): boolean => {
	const { pathname } = req.nextUrl;

	for (const [prefix, roles] of Object.entries(roleBasedRoutes)) {
		if (pathname.startsWith(prefix)) {
			return roles.some((role) => hasRequiredRole(req, role));
		}
	}

	return true;
};

export const middleware = (req: NextRequest) => {
	const { pathname } = req.nextUrl;

	if (
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	const authenticated = isAuthenticated(req);
	const redirectUrl = getRedirectUrl(req, authenticated);

	if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, req.url));

	if (!authenticated) {
		if (!authRoutes.includes(pathname)) {
			if (pathname.startsWith("/admin"))
				return NextResponse.redirect(new URL("/admin/sign-in", req.url));

			if (pathname.startsWith("/student") || pathname.startsWith("/lecturer"))
				return NextResponse.redirect(new URL("/", req.url));
		}
	}

	if (!authRoutes.includes(pathname) && !hasAccessToRoute(req))
		return NextResponse.redirect(new URL("/", req.url));

	return NextResponse.next();
};

export const config = {
	// matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
