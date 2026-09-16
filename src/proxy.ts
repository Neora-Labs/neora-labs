import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_MAX_AGE,
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { negotiateLocale } from "@/i18n/negotiate";
import {
  COUNTRY_COOKIE,
  DETECTED_MARKET_COOKIE,
  MARKET_COOKIE,
  MARKET_COOKIE_MAX_AGE,
  MARKET_OVERRIDE_COOKIE,
  resolveRequestMarket,
} from "@/lib/market";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const response = NextResponse.next();
    setLocaleCookie(response, first);
    setMarketCookies(request, response);
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const response = NextResponse.redirect(url, 307);
  setLocaleCookie(response, locale);
  setMarketCookies(request, response);
  return response;
}

function setMarketCookies(request: NextRequest, response: NextResponse) {
  const headerCountry = request.headers.get("x-vercel-ip-country");
  const rememberedCountry = request.cookies.get(COUNTRY_COOKIE)?.value;
  const override = request.cookies.get(MARKET_OVERRIDE_COOKIE)?.value;
  const resolved = resolveRequestMarket(headerCountry ?? rememberedCountry, override);
  const options = { path: "/", maxAge: MARKET_COOKIE_MAX_AGE, sameSite: "lax" as const };

  if (resolved.country) response.cookies.set(COUNTRY_COOKIE, resolved.country, options);
  response.cookies.set(DETECTED_MARKET_COOKIE, resolved.detectedMarket, options);
  response.cookies.set(MARKET_COOKIE, resolved.market, options);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) {
    return cookie;
  }
  return negotiateLocale(request.headers.get("accept-language")) ?? defaultLocale;
}

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
