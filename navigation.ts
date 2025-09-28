import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['zh'] as const;
export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/projects': '/projects',
  '/experience': '/experience',
  '/skills': '/skills'
};
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix
  });