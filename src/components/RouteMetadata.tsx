import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeMetadata } from '../core/seo';
export function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const data = routeMetadata(pathname);
    document.title = data.title;
    const set = (key: string, value: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector<HTMLMetaElement>('meta[' + attr + '="' + key + '"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.append(tag);
      }
      tag.content = value;
    };
    set('description', data.description);
    set('robots', 'noindex,nofollow');
    set('og:title', data.title, true);
    set('og:description', data.description, true);
    set('og:type', 'website', true);
    set('og:site_name', 'KORΛ', true);
    set('twitter:card', 'summary');
    set('twitter:title', data.title);
    set('twitter:description', data.description);
    const canonical = new URL(pathname, import.meta.env.VITE_SITE_URL || location.origin).href;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.append(link);
    }
    link.href = canonical;
    set('og:url', canonical, true);
  }, [pathname]);
  return null;
}
