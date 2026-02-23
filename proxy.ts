import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "./lib/i18n/config";
import { ROUTES } from "./lib/utils";
import { decodeAccessToken } from "./lib/utils/decodeToken";

const authRoutes = [
  ROUTES.mainSite.signin,
  ROUTES.mainSite.signup,
  ROUTES.adminSite.auth.signup,
  ROUTES.adminSite.auth.signin,
];
/** Home and about: only for unauthorized users. Authorized users are redirected to dashboard. */
const publicOnlyRoutes = ["/", "/about"];
const protectedRoutes = ["/dashboard", "/profile", "/courses"];
const roleBasedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
};

/** Strip locale prefix from pathname for route matching. Returns path without leading locale. */
function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.slice(1).split("/");
  const first = segments[0];
  if (first && isLocale(first)) return `/${segments.slice(1).join("/")}` || "/";
  return pathname;
}

/** Get locale from pathname, or default. */
function getLocaleFromPath(pathname: string): string {
  const segments = pathname.slice(1).split("/");
  const first = segments[0];
  if (first && isLocale(first)) return first;
  return DEFAULT_LOCALE;
}

const isAuthenticated = (req: NextRequest): boolean => {
  const accessToken = req.cookies.get("accessToken")?.value;

  return !!accessToken;
};

const getRedirectUrl = (
  req: NextRequest,
  authenticated: boolean,
): string | null => {
  const { pathname } = req.nextUrl;
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const locale = getLocaleFromPath(pathname);

  if (authenticated) {
    // Authorized: redirect away from public-only and auth routes to dashboard (or admin)
    if (publicOnlyRoutes.includes(pathWithoutLocale))
      return `/${locale}/dashboard`;
    if (authRoutes.includes(pathWithoutLocale)) {
      const isAdminAuth =
        pathWithoutLocale === ROUTES.adminSite.auth.signin ||
        pathWithoutLocale === ROUTES.adminSite.auth.signup;
      if (isAdminAuth) return `/${locale}/admin`;
      return `/${locale}/dashboard`;
    }
  } else {
    if (
      protectedRoutes.some(
        (r) => pathWithoutLocale === r || pathWithoutLocale.startsWith(r + "/"),
      )
    )
      return `/${locale}/sign-in`;
  }

  return null;
};

const hasRequiredRole = (req: NextRequest, requiredRole: string): boolean => {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.log("Middleware: No access token found");
    return false;
  }

  try {
    const decoded = decodeAccessToken(accessToken);

    // Case insensitive check
    return decoded?.role?.toLowerCase() === requiredRole.toLowerCase();
  } catch (error) {
    console.error("Token validation error:", error);

    return false;
  }
};

const hasAccessToRoute = (req: NextRequest): boolean => {
  const pathWithoutLocale = getPathWithoutLocale(req.nextUrl.pathname);

  for (const [prefix, roles] of Object.entries(roleBasedRoutes)) {
    if (
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(prefix + "/")
    ) {
      return roles.some((role) => hasRequiredRole(req, role));
    }
  }

  return true;
};

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // i18n: redirect to locale-prefixed path if missing
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const hasLocaleInPath = pathname !== pathWithoutLocale;
  const locale = getLocaleFromPath(pathname);
  if (!hasLocaleInPath && pathname !== "/") {
    const preferred = req.cookies.get("NEXT_LOCALE")?.value;
    const targetLocale =
      preferred && isLocale(preferred) ? preferred : DEFAULT_LOCALE;
    const newPath =
      pathname === "/" ? `/${targetLocale}` : `/${targetLocale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, req.url));
  }
  if (pathname === "/") {
    const preferred = req.cookies.get("NEXT_LOCALE")?.value;
    const targetLocale =
      preferred && isLocale(preferred) ? preferred : DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${targetLocale}`, req.url));
  }

  const authenticated = isAuthenticated(req);
  const redirectUrl = getRedirectUrl(req, authenticated);

  if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, req.url));

  if (!authenticated) {
    if (!authRoutes.includes(pathWithoutLocale)) {
      if (
        pathWithoutLocale === "/admin" ||
        pathWithoutLocale.startsWith("/admin/")
      )
        return NextResponse.redirect(
          new URL(`/${locale}/admin/sign-in`, req.url),
        );

      if (
        pathWithoutLocale.startsWith("/student") ||
        pathWithoutLocale.startsWith("/lecturer")
      )
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  if (!authRoutes.includes(pathWithoutLocale) && !hasAccessToRoute(req))
    return NextResponse.redirect(new URL(`/${locale}`, req.url));

  return NextResponse.next();
};

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
