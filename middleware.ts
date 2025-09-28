import createMiddleware from 'next-intl/middleware';
import { locales, pathnames, localePrefix } from './navigation';

export default createMiddleware({
  defaultLocale: 'zh',
  locales,
  pathnames,
  localePrefix,
  localeDetection: false // 禁用自动语言检测
});

export const config = {
  matcher: [
    // 启用国际化路由
    '/(zh|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};