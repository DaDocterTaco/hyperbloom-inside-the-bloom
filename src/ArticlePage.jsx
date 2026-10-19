import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowsLeftRight, Check, Copy, Database, DeviceMobile } from '@phosphor-icons/react';
import { articleForPath, articlePath, articles } from './content';
import { readingGuides } from './articleContent';
import { PetalAtmosphere } from './Experience';
import { useAmbientScene } from './experienceHooks';
import { IdeaArtwork } from './IdeaArtwork';

export function ArticlePage({ motion }) {
  const article = articleForPath(window.location.pathname);
  const slug = articlePath(article).split('/').pop();
  const guide = readingGuides[slug];
  const body = useRef(null);
  const scene = useAmbientScene(motion);
  const [progress, setProgress] = useState(0);
  const [shareState, setShareState] = useState('idle');
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setShareState('copied'); }
    catch { setShareState('manual'); }
  };
  const next = articles[(articles.indexOf(article) + 1) % articles.length];
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = body.current?.getBoundingClientRect();
      if (box) setProgress(Math.round(Math.max(0, Math.min(1, (window.innerHeight * .7 - box.top) / box.height)) * 100));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(body.current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <article className="route-page article-page">
    <header ref={scene} className="article-intro">
      <PetalAtmosphere variant="page-art" />
      <div className="article-heading-wrap">
        <nav className="article-breadcrumb" aria-label="Breadcrumb"><a href="/blog">Blog</a><span aria-hidden="true">/</span><span>{article.category.toLowerCase()}</span></nav>
        <div className="reading-meter"><progress value={progress} max="100" aria-label="Reading progress" /><span>{progress}% read</span></div>
        <h1 tabIndex={-1}>{article.title}</h1>
        <p className="article-deck serif">{guide.lead}</p>
        <div className="article-meta"><span>Reading guide · 1 min</span><a href="https://www.hyperbloomhacks.com/profile/kashvi172964630/profile" target="_blank" rel="noopener noreferrer">Original by kashvi1729 <ArrowUpRight size={15} aria-hidden="true" /></a></div>
        <div className="reader-origin"><span>A concise editorial guide to the original post.</span><a href={article.href} target="_blank" rel="noopener noreferrer">Read the complete original · {article.time} <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </div>
    </header>
    <div ref={body} className="article-body">
      <IdeaArtwork title={article.title} reader />
      <nav className="article-contents" aria-label="In this guide"><span>IN THIS GUIDE</span>{guide.sections.map(section => <a key={section.id} href={'#' + section.id}>{section.title}</a>)}</nav>
      {guide.sections.map((section, index) => <section key={section.id} id={section.id}><h2>{section.title}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{guide.diagram && index === 0 && <figure className="api-exchange"><div><DeviceMobile size={34} aria-hidden="true" /><span>Your app</span></div><div className="exchange-label"><span>Request</span><ArrowsLeftRight size={46} aria-hidden="true" /><span>Response</span></div><div><Database size={34} aria-hidden="true" /><span>A service</span></div><figcaption>An app sends a request. The service sends a response.</figcaption></figure>}</section>)}
      <aside className="article-source-note"><p>Continue with the original article, or join its conversation on the official Hyperbloom blog.</p><div className="reader-actions"><a className="release-text-link" href={article.href} target="_blank" rel="noopener noreferrer">Open original article <ArrowUpRight size={17} aria-hidden="true" /></a><button className="release-text-link" onClick={copyLink}>{shareState === 'copied' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />} {shareState === 'copied' ? 'Link copied' : 'Copy guide link'}</button></div><span className="sr-only" role="status">{shareState === 'copied' ? 'Guide link copied to clipboard.' : shareState === 'manual' ? 'Select and copy the guide link below.' : ''}</span>{shareState === 'manual' && <label className="manual-share">Guide link<input readOnly value={window.location.href} onFocus={event => event.currentTarget.select()} /></label>}</aside>
      <a className="next-article" href={articlePath(next)}><span><small>NEXT READ</small><strong>{next.title}</strong></span><ArrowRight size={24} aria-hidden="true" /></a>
      <a className="release-text-link" href="/blog"><ArrowLeft size={17} aria-hidden="true" /> Back to all articles</a>
    </div>
  </article>;
}
