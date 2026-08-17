import { createDirectus, rest, readItems } from '@directus/sdk';

export async function fetchDirectusDocs(serverUrl, collectionName = 'documentation') {
  if (!serverUrl) throw new Error("Please enter a valid Directus CMS Server URL");

  try {
    const client = createDirectus(serverUrl).with(rest());
    const items = await client.request(readItems(collectionName));
    
    return (items || []).map(item => ({
      id: `directus-${item.id || Date.now()}`,
      title: item.title || item.name || 'Directus Document',
      filename: item.filename || `${(item.title || 'doc').toLowerCase().replace(/\s+/g, '_')}.md`,
      category: item.category || 'Directus CMS',
      tags: ['Directus', 'CMS', item.category || 'Content'],
      favorite: false,
      createdAt: item.date_created || new Date().toISOString(),
      content: item.content || item.body || item.markdown || `# ${item.title}\n\n${item.description || 'Imported from Directus CMS'}`
    }));
  } catch (err) {
    throw new Error(`Directus API Error: ${err.message || 'Failed to connect to Directus server.'}`);
  }
}
