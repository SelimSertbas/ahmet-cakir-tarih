import type { Article } from '@/types';

const WIDTH = 1080;
const HEIGHT = 1920;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*\S*$/, '…');
  }
  return lines.slice(0, maxLines);
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Instagram/TikTok hikaye formatında (1080x1920) paylaşılabilir bir görsel üretir. */
export async function generateStoryImage(article: Article): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Arka plan — coffee temalı gradyan
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#3a2517');
  bg.addColorStop(1, '#1a1008');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const padding = 90;
  let cursorY = 140;

  // Logo
  const logo = await loadImage('/android-chrome-192x192.png');
  if (logo) {
    const logoSize = 110;
    ctx.drawImage(logo, padding, cursorY, logoSize, logoSize);
  }
  cursorY += 180;

  // Kapak görseli
  const cover = article.image_url ? await loadImage(article.image_url) : null;
  if (cover) {
    const coverH = 640;
    const coverW = WIDTH - padding * 2;
    ctx.save();
    const radius = 24;
    ctx.beginPath();
    ctx.moveTo(padding + radius, cursorY);
    ctx.arcTo(padding + coverW, cursorY, padding + coverW, cursorY + coverH, radius);
    ctx.arcTo(padding + coverW, cursorY + coverH, padding, cursorY + coverH, radius);
    ctx.arcTo(padding, cursorY + coverH, padding, cursorY, radius);
    ctx.arcTo(padding, cursorY, padding + coverW, cursorY, radius);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(coverW / cover.width, coverH / cover.height);
    const drawW = cover.width * scale;
    const drawH = cover.height * scale;
    ctx.drawImage(
      cover,
      padding + (coverW - drawW) / 2,
      cursorY + (coverH - drawH) / 2,
      drawW,
      drawH
    );
    ctx.restore();
    cursorY += coverH + 60;
  } else {
    cursorY += 40;
  }

  // Kategori etiketi
  if (article.category) {
    ctx.font = '600 30px Georgia, serif';
    const label = article.category.toUpperCase();
    const labelWidth = ctx.measureText(label).width;
    const chipPadX = 28;
    const chipH = 60;
    ctx.fillStyle = 'rgba(244, 236, 224, 0.15)';
    ctx.beginPath();
    ctx.roundRect(padding, cursorY, labelWidth + chipPadX * 2, chipH, chipH / 2);
    ctx.fill();
    ctx.fillStyle = '#f4ece0';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, padding + chipPadX, cursorY + chipH / 2 + 2);
    ctx.textBaseline = 'alphabetic';
    cursorY += chipH + 40;
  }

  // Başlık
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Georgia, serif';
  const titleLines = wrapText(ctx, article.title, WIDTH - padding * 2, 4);
  for (const line of titleLines) {
    ctx.fillText(line, padding, cursorY);
    cursorY += 76;
  }
  cursorY += 30;

  // Özet
  if (article.excerpt) {
    ctx.fillStyle = 'rgba(244, 236, 224, 0.85)';
    ctx.font = '36px Georgia, serif';
    const excerptLines = wrapText(ctx, article.excerpt, WIDTH - padding * 2, 3);
    for (const line of excerptLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += 48;
    }
  }

  // Alt bilgi
  ctx.fillStyle = 'rgba(244, 236, 224, 0.6)';
  ctx.font = '32px Georgia, serif';
  ctx.fillText('Ahmet Çakır — Tarih', padding, HEIGHT - 140);
  ctx.fillStyle = '#c99a5c';
  ctx.font = '600 32px Georgia, serif';
  ctx.fillText(window.location.host, padding, HEIGHT - 90);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Hikaye görselini oluşturur ve mümkünse cihazın native paylaşım menüsünü açar
 * (Instagram/TikTok Hikaye seçenekleri buradan seçilebilir). Paylaşım API'si
 * yoksa görsel indirilir.
 */
export async function shareArticleAsStory(article: Article): Promise<'shared' | 'downloaded' | 'failed'> {
  const blob = await generateStoryImage(article);
  if (!blob) return 'failed';

  const file = new File([blob], 'hikaye.png', { type: 'image/png' });

  if (
    typeof navigator !== 'undefined' &&
    'canShare' in navigator &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: article.title,
        text: article.excerpt,
      });
      return 'shared';
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return 'failed';
      // devam et, indirmeye düş
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hikaye.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
