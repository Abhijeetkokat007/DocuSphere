import { initialReadmes } from './sampleReadmes';

const STORAGE_KEY = 'docusphere_readmes_v1';

export function getStoredReadmes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReadmes));
      return initialReadmes;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load readmes from localStorage:', err);
    return initialReadmes;
  }
}

export function saveReadmes(readmes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readmes));
  } catch (err) {
    console.error('Failed to save readmes to localStorage:', err);
  }
}

export function calculateWordCount(text = '') {
  if (!text) return 0;
  const words = text.trim().replace(/[\r\n\s]+/g, ' ').split(' ');
  return words.filter(w => w.length > 0).length;
}

export function calculateReadingTime(wordCount) {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes < 1 ? 1 : minutes;
}

export function extractHeadings(markdownText = '') {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    const level = match[1].length;
    const rawTitle = match[2].trim();
    // Generate clean id slug
    const id = rawTitle
      .toLowerCase()
      .replace(/<[^>]*>?/gm, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({
      level,
      title: rawTitle,
      id
    });
  }
  return headings;
}

export function exportAsFile(filename, content, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
