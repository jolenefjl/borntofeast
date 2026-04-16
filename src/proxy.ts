import {NextResponse, type NextRequest} from "next/server";

import {defaultLocale, locales} from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (
    locales.some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
