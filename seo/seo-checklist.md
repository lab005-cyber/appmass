# SEO Launch Checklist

> Implementation guide for appmass SEO configuration.

---

## 1. robots.txt
| Field | Details |
|-------|---------|
| **Status** | ✅ Complete |
| **Priority** | High |
| **Guide** | Place in `public/robots.txt`. Allow all crawlers (`Allow: /`), disallow admin/auth paths (`Disallow: /admin`, `Disallow: /auth`). Point to sitemap: `Sitemap: https://appmass.app/sitemap.xml`. |
| **Appwrite** | Serve via Appwrite Hosting static files or place at root of Expo web build output. |

## 2. sitemap.xml
| Field | Details |
|-------|---------|
| **Status** | ✅ Complete |
| **Priority** | High |
| **Guide** | Dynamic sitemap generator script in `scripts/generate-sitemap.js`. List all public pages with `<lastmod>`, `<changefreq>`, `<priority>`. Update on every deploy. |
| **Appwrite** | Regenerate via Appwrite Function triggered on deploy webhook. Store in Appwrite Storage for CDN serving. |

## 3. Canonical URL
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Set `<link rel="canonical" href="https://appmass.app/current-path" />` in `<head>`. Use Expo Router `usePathname()` to derive current path. Prevent duplicate content from query params. |
| **Appwrite** | N/A — handled in client-side `<head>` via `expo-router` or `next/head` equivalent. |

## 4. Meta Title (per-page strategy)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Format: `Page Name | Appmass`. Home: `Appmass — Connect Locally`. Profile: `@username | Appmass`. Post: `Post Title | Appmass`. Category: `Category Name | Appmass`. Use `<Helmet>` or `expo-router` `Head` component. Keep under 60 characters. |
| **Appwrite** | Store custom page titles in Appwrite Database `pages` collection for CMS-driven pages. |

## 5. Meta Description (per-page strategy)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Max 155 characters. Home: "Join Appmass to discover local events, connect with neighbors, and build your community." Profile: user bio snippet. Post: first ~150 chars of content. |
| **Appwrite** | Pull from user profiles (`bio` field) or post content dynamically. |

## 6. Open Graph Tags
| Field | Details |
|-------|---------|
| **Status** | ✅ Complete |
| **Priority** | High |
| **Guide** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (website/article), `og:site_name`. Generate OG images dynamically for shared posts. |
| **Appwrite** | Store OG image URLs in post documents. Use Appwrite Storage for image hosting. |

## 7. Twitter Card Tags
| Field | Details |
|-------|---------|
| **Status** | ✅ Complete |
| **Priority** | Medium |
| **Guide** | `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site` (@appmass). |
| **Appwrite** | Same image URLs as OG tags. |

## 8. Schema.org JSON-LD
| Field | Details |
|-------|---------|
| **Status** | ✅ Complete |
| **Priority** | Medium |
| **Guide** | Implement `Organization` schema for brand (logo, name, URL, social profiles), `WebSite` schema with `searchAction`, `WebPage` schema per page. |
| **Appwrite** | Store schema templates in Appwrite Database or inject via server-side rendering function. |

## 9. Breadcrumb Schema
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | Medium |
| **Guide** | Add `BreadcrumbList` JSON-LD to all pages. Example paths: Home > Profile, Home > Post, Home > Category > Post. Use current route segments to build array. |
| **Appwrite** | N/A — computed client-side based on navigation state. |

## 10. FAQ Schema (for help pages)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | Low |
| **Guide** | Add `FAQPage` schema to `/help` and `/faq` pages. Structure with `mainEntity` array of `Question`/`AcceptedAnswer`. Pull from help content source. |
| **Appwrite** | Store FAQ entries in Appwrite Database `faqs` collection. Auto-generate schema on page load. |

## 11. Article Schema (for posts/blog)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | Medium |
| **Guide** | Add `Article` or `NewsArticle` schema on individual post pages. Include `headline`, `author`, `datePublished`, `dateModified`, `image`, `publisher`. |
| **Appwrite** | Pull from post documents: title → `headline`, user name → `author`, timestamps, cover image URL. |

## 12. Image Alt Text
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | Medium |
| **Guide** | All `<Image>` components require `alt` prop. For user-uploaded images, prompt user for alt text on upload. Auto-generate alt text from post caption as fallback. |
| **Appwrite** | Store `alt` field alongside image URL in post/avatar storage metadata. Use Appwrite Functions for AI alt-text generation. |

## 13. Lazy Loading
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | Medium |
| **Guide** | Use `loading="lazy"` on `<img>` tags. For Expo, use `expo-image` with `contentFit` and caching. Implement IntersectionObserver for below-fold content. |
| **Appwrite** | N/A — purely client-side optimization. |

## 14. Core Web Vitals Optimization
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Target LCP < 2.5s, FID < 100ms, CLS < 0.1. Optimize images (WebP/AVIF), preload fonts, minimize JS bundles, use `React.lazy` + code splitting. Monitor with Lighthouse CI. |
| **Appwrite** | Minimize Appwrite SDK bundle — use tree-shakeable imports. Consider lazy-loading Appwrite modules. |

## 15. Compression (gzip/brotli)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Enable Brotli compression at CDN/origin level for JS, CSS, HTML, JSON, SVG. Fallback to gzip. Target compression ratio > 70%. |
| **Appwrite** | If using Appwrite Hosting, verify compression headers. Otherwise configure on Cloudflare/Netlify/Vercel in front of Appwrite. |

## 16. Caching (CDN + browser)
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Set `Cache-Control` headers: static assets (1y), HTML (no-cache), API responses (short TTL). Use service worker for offline-capable caching. Implement ETags. |
| **Appwrite** | Appwrite Functions responses — add `Cache-Control` headers. For static files in Appwrite Storage, set cache duration via bucket settings. |

## 17. CDN Setup
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Use Cloudflare (recommended), Fastly, or AWS CloudFront. Configure custom domain, SSL, DDoS protection, cache rules, and edge worker for A/B testing. |
| **Appwrite** | Appwrite sits behind your CDN. Route `https://appmass.app/*` → CDN → Appwrite Hosting or Functions. Use CDN for static files in Storage. |

## 18. Mobile Responsive
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Test all pages at 320px, 375px, 768px, 1024px, 1440px. Use `<meta name="viewport">`. Ensure touch targets ≥ 44px. Use relative units (rem/%). No horizontal scroll. |
| **Appwrite** | N/A — handled entirely in frontend. Use Expo's responsive APIs and `useWindowDimensions`. |

## 19. HTTPS Enforcement
| Field | Details |
|-------|---------|
| **Status** | ❌ Not Started |
| **Priority** | High |
| **Guide** | Redirect HTTP → 301 HTTPS. Enable HSTS header (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`). Submit to HSTS preload list. |
| **Appwrite** | Enable custom domain with SSL in Apprite Console. Use Cloudflare's Universal SSL (free) or Appwrite's built-in SSL termination. |

---

## Summary

| Priority | Count | Status |
|----------|-------|--------|
| High | 11 | 3 ✅ / 8 ❌ |
| Medium | 6 | 2 ✅ / 4 ❌ |
| Low | 2 | 0 ✅ / 2 ❌ |
| **Total** | **19** | **5 ✅ / 14 ❌** |
