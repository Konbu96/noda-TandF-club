"use client";

import { useEffect } from "react";

// NOTE: Embed works when the Instagram embed script is present
const INSTAGRAM_EMBED_SCRIPT = "https://www.instagram.com/embed.js";

export default function InstagramFeed({ postUrls = [] as string[] }) {
  useEffect(() => {
    // Load instagram embed script if not present
    const existing = document.querySelector(`script[src="${INSTAGRAM_EMBED_SCRIPT}"]`);
    if (!existing) {
      const s = document.createElement("script");
      s.src = INSTAGRAM_EMBED_SCRIPT;
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => {
        // @ts-ignore
        window?.instgrm?.Embeds?.process?.();
      };
    } else {
      // @ts-ignore
      window?.instgrm?.Embeds?.process?.();
    }
  }, [postUrls]);

  const urls = postUrls.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {urls.map((url, idx) => (
        <div key={idx} className="w-full">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ background: '#FFF', border: 0, margin: 0, padding: 0, width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
