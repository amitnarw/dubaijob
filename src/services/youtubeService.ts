/** YouTube helpers: thumbnails with fallback chain, embed HTML. */

export function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function thumbnailFallbacks(videoId: string): string[] {
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  ];
}

export function embedHtml(videoId: string): string {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><style>html,body{margin:0;padding:0;background:#000;height:100%}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}</style></head><body><iframe src="https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></body></html>`;
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
