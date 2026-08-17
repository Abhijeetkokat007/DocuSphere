import { Marked } from 'marked';

// Custom renderer to support GitHub callouts and custom headers
const marked = new Marked();

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(content = '') {
  if (!content) return '';

  let html = marked.parse(content);

  // Transform GitHub alerts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION]
  html = html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (match, type, text) => {
      const alertType = type.toUpperCase();
      let icon = 'ℹ️';
      let title = 'NOTE';

      if (alertType === 'TIP') {
        icon = '💡';
        title = 'TIP';
      } else if (alertType === 'WARNING') {
        icon = '⚠️';
        title = 'WARNING';
      } else if (alertType === 'IMPORTANT') {
        icon = '📢';
        title = 'IMPORTANT';
      } else if (alertType === 'CAUTION') {
        icon = '🚨';
        title = 'CAUTION';
      }

      return `
        <div class="github-alert github-alert-${alertType.toLowerCase()}">
          <div class="github-alert-title">
            <span class="github-alert-icon">${icon}</span>
            <span>${title}</span>
          </div>
          <div class="github-alert-content">${text}</div>
        </div>
      `;
    }
  );

  // Add IDs to h1, h2, h3 tags for scroll syncing TOC
  html = html.replace(/<h([1-4])>(.*?)<\/h\1>/gi, (match, level, title) => {
    const cleanText = title.replace(/<[^>]*>?/gm, '').trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h${level} id="${id}">${title}</h${level}>`;
  });

  return html;
}
