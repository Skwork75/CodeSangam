let cachedMappings = null;

export async function findEquivalents(slug) {
  if (typeof slug !== 'string' || !slug.trim()) {
    return null;
  }

  const cleanSlug = slug.trim().toLowerCase();

  try {
    if (!cachedMappings) {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        const response = await fetch(chrome.runtime.getURL('data/mappings.json'));
        if (!response.ok) {
          throw new Error(`Failed to fetch mappings database: ${response.statusText}`);
        }
        cachedMappings = await response.json();
      } else {
        const { readFile } = await import('node:fs/promises');
        const { URL } = await import('node:url');
        const data = await readFile(new URL('../data/mappings.json', import.meta.url), 'utf8');
        cachedMappings = JSON.parse(data);
      }
    }

    if (!cachedMappings || typeof cachedMappings !== 'object' || Array.isArray(cachedMappings)) {
      throw new Error('Invalid mappings database format: root must be an object.');
    }

    if (Object.prototype.hasOwnProperty.call(cachedMappings, cleanSlug)) {
      return cachedMappings[cleanSlug];
    }

    return null;
  } catch (error) {
    throw error;
  }
}
