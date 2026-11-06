export function extractSlug(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname !== 'leetcode.com' && hostname !== 'www.leetcode.com') {
      return null;
    }

    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    if (segments.length < 2 || segments[0].toLowerCase() !== 'problems') {
      return null;
    }

    const slug = segments[1].trim().toLowerCase();
    if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return null;
    }

    return slug;
  } catch (error) {
    return null;
  }
}
