/**
 * Normaliza tablas Quill y texto tabular para vista en pantalla (misma lógica que el PDF).
 */
export function prepararContenidoInformeParaVista(html: string): string {
  if (!html?.trim()) return html ?? '';

  let contenido = html;
  contenido = normalizarTablasQuill(contenido);
  contenido = convertirContenidoTabularATablas(contenido);
  return contenido;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTagsKeepTabs(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#9;/g, '\t')
    .replace(/&tab;/gi, '\t');
}

function buildTablaHtmlFromRows(rows: string[][]): string {
  if (rows.length === 0) return '';
  const colCount = Math.max(...rows.map((r) => r.length));
  if (colCount < 2) return '';

  const header = rows[0] ?? [];
  const body = rows.slice(1);
  let table = '<table class="informe-tabla"><thead><tr>';
  for (let i = 0; i < colCount; i++) {
    table += `<th>${escapeHtml(header[i] || '')}</th>`;
  }
  table += '</tr></thead><tbody>';
  for (const row of body) {
    table += '<tr>';
    for (let i = 0; i < colCount; i++) {
      table += `<td>${escapeHtml(row[i] || '')}</td>`;
    }
    table += '</tr>';
  }
  table += '</tbody></table>';
  return table;
}

function normalizarTablasQuill(html: string): string {
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (full) => {
    const rows: string[][] = [];
    for (const rowMatch of full.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [...rowMatch[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
        stripTagsKeepTabs(m[1] ?? '').trim()
      );
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length >= 2) {
      return buildTablaHtmlFromRows(rows);
    }
    return full.replace(/\s*data-row="[^"]*"/gi, '').replace(/<table/i, '<table class="informe-tabla"');
  });
}

function convertirContenidoTabularATablas(html: string): string {
  if (!html?.trim()) return html;

  html = html.replace(/<table(?![^>]*class=)/gi, '<table class="informe-tabla"');

  html = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (full, _attrs, inner) => {
    const parts = inner.split(/<br\s*\/?>/gi);
    if (parts.length <= 1) return full;

    const lines = parts.map((p: string) => stripTagsKeepTabs(p).trim()).filter(Boolean);
    const tabLines = lines.filter((l: string) => l.includes('\t'));
    if (tabLines.length < 2) return full;

    const titleLines = lines.filter((l: string) => !l.includes('\t'));
    const rows = tabLines.map((l: string) => l.split('\t').map((c) => c.trim()));
    const tableHtml = buildTablaHtmlFromRows(rows);
    if (!tableHtml) return full;

    const titleHtml = titleLines.map((t: string) => `<p>${escapeHtml(t)}</p>`).join('');
    return `${titleHtml}${tableHtml}`;
  });

  return convertirParrafosTabularesConsecutivos(html);
}

function convertirParrafosTabularesConsecutivos(html: string): string {
  const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  const segments: string[] = [];
  let lastIndex = 0;
  let tabBuffer: string[][] = [];

  const flushTabBuffer = (): void => {
    if (tabBuffer.length >= 2) {
      const tableHtml = buildTablaHtmlFromRows(tabBuffer);
      if (tableHtml) segments.push(tableHtml);
    } else if (tabBuffer.length === 1) {
      const row = tabBuffer[0] ?? [];
      segments.push(`<p>${row.map((c) => escapeHtml(c)).join('\t')}</p>`);
    }
    tabBuffer = [];
  };

  let match: RegExpExecArray | null;
  while ((match = paragraphRegex.exec(html)) !== null) {
    segments.push(html.slice(lastIndex, match.index));
    const inner = match[0].replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
    const text = stripTagsKeepTabs(inner).trim();
    if (text.includes('\t')) {
      tabBuffer.push(text.split('\t').map((c) => c.trim()));
    } else {
      flushTabBuffer();
      segments.push(match[0]);
    }
    lastIndex = paragraphRegex.lastIndex;
  }

  flushTabBuffer();
  segments.push(html.slice(lastIndex));
  return segments.join('');
}
