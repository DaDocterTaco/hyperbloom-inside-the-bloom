/** One quiet bloom grows with the surrounding chapter; no content is animated. */
export function FlowerAccent({ variant = 'journal' }) {
  return <div className={`flower-accent flower-accent--${variant}`} aria-hidden="true">
    <img src="/art/bloom-sculpture-v1.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
  </div>;
}
