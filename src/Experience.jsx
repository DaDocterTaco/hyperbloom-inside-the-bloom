import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, ArrowUpRight, DiscordLogo, EnvelopeSimple, InstagramLogo, LinkedinLogo, MagnifyingGlass, Play, Plus, X } from '@phosphor-icons/react';
import { articlePath, articles, events, faq, founders, links, teamProfiles } from './content';
import { eventIsOpen, octoberEventPhase, octoberState, selectArticles, selectEvents } from './siteLogic.mjs';
import { useAmbientScene, useClock } from './experienceHooks';
import { useMedia } from './MediaDialog';
import { FlowerAccent } from './FlowerAccent';

function Button({ href, children, secondary = false, ...props }) {
  return <a href={href} className={secondary ? 'release-button secondary' : 'release-button'} {...props}>{children}<ArrowRight size={21} aria-hidden="true" /></a>;
}
function TextLink({ href, children, external = false, ...props }) {
  return <a href={href} className="release-text-link" target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...props}>{children}{external ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}</a>;
}
function ChapterHead({ eyebrow, title, accent, children, page = false }) {
  const Heading = page ? 'h1' : 'h2';
  return <div className="chapter-head"><p className="chapter-kicker">{eyebrow}</p><Heading tabIndex={page ? -1 : undefined}>{title}{accent && <><br /><span className="serif">{accent}</span></>}</Heading>{children && <p className="chapter-lead">{children}</p>}</div>;
}
export function PetalAtmosphere({ variant = '' }) {
  // The document-wide bloom now supplies the glass. Avoid resetting it per chapter.
  if (variant === 'page-art') return null;
  return <div className={`chapter-art ${variant}`} aria-hidden="true" />;
}

export function Community({ motion }) {
  const scene = useAmbientScene(motion);
  const { open } = useMedia();
  return <section ref={scene} className="release-community release-chapter" id="showcase" aria-labelledby="community-heading">
    <PetalAtmosphere variant="community-art" />
    <div className="chapter-head has-flower"><FlowerAccent variant="first" /><p className="chapter-kicker">Our first chapter</p><h2 id="community-heading" className="serif">The first bloom.</h2><p className="chapter-lead">A real community. A first chapter worth remembering.</p></div>
    <figure className="community-winner"><button onClick={event => open('winner', event)} aria-label="View full winner announcement"><img src="/source/v1-winner.avif" alt="Original Hyperbloom V1 announcement congratulating Deep" width="464" height="620" loading="lazy" /></button><figcaption>Deep · Hyperbloom V1 winner</figcaption></figure>
    <div className="chapter-action"><Button href="/v1-gallery">Explore the V1 gallery</Button></div>
    <div className="community-links"><button className="release-text-link" onClick={event => open('recap', event)}><Play size={17} aria-hidden="true" /> Watch the recap</button><button className="release-text-link" onClick={event => open('presentations', event)}><Play size={17} aria-hidden="true" /> Finalist presentations · 9:36</button></div>
  </section>;
}

export function EventArchive({ motion }) {
  const scene = useAmbientScene(motion);
  const now = useClock();
  const phase = octoberEventPhase(now);
  const [filter, setFilter] = useState('all');
  const visible = selectEvents(events, filter, now);
  return <section ref={scene} className="release-events release-chapter" id="events" aria-labelledby="events-heading">
    <PetalAtmosphere variant="events-art" />
    <div className="chapter-head"><p className="chapter-kicker">Upcoming &amp; past events</p><h2 id="events-heading">Find your next challenge.</h2><p className="chapter-lead">{phase === 'grading' ? 'October is being graded. Explore the challenge and our past events.' : phase === 'open' ? 'One open challenge. A community ready to help.' : 'Explore our past challenges. Stay for what comes next.'}</p></div>
    <div className="release-filters" role="group" aria-label="Filter events">{[['all', 'All events'], ['current', phase === 'grading' ? 'Grading' : phase === 'upcoming' ? 'Coming soon' : 'Open now'], ['past', 'Past events']].map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    <p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'event' : 'events'}</p>
    <div className="release-event-list">
      {visible.map((event, index) => {
        const isOpen = eventIsOpen(event, now);
        const status = event.current ? phase === 'grading' ? 'Grading' : phase === 'upcoming' ? 'Coming soon' : 'Open now' : 'Registrations closed';
        return <Fragment key={event.title}>{!event.current && (index === 0 || visible[index - 1].current) && <h3 className="past-challenges-heading">Past challenges</h3>}<article className={`release-event ${event.current ? 'featured' : ''}`}>
          <div className="release-event-meta"><span>{event.date}</span><span className={`release-event-status ${isOpen ? 'is-open' : ''}`}>{isOpen && <span aria-hidden="true" />}{status}</span></div>
          <div className="release-event-body"><div><h3><a href={event.title === 'Hyperbloom V1' ? '/reg-closed' : event.href}>{event.title === 'Beginner Friendly' ? 'Hyperbloom Beginner Friendly' : event.title}</a></h3>{event.theme && <p className={event.current ? 'featured-theme serif' : ''}>{event.theme}</p>}{event.current && <><p className="release-event-deadline">{isOpen ? 'Submit by' : 'Submission deadline:'} Oct 19, 2026 · 5 PM EDT</p><p>Online · Beginner-friendly</p><a className="release-button event-primary" href={event.href}>View challenge on Devpost <ArrowRight size={20} aria-hidden="true" /></a></>}</div>{!event.current && <a className="event-destination" href={event.title === 'Hyperbloom V1' ? '/reg-closed' : event.href}>{event.title === 'Hyperbloom V1' ? 'Event details' : 'View event'}<ArrowUpRight size={20} aria-hidden="true" /></a>}</div>
          {(event.brochure || event.gallery || event.current) && <div className="event-resources">{event.current && <><TextLink href={links.rules} external>Official rules</TextLink><TextLink href="/hyperbloom-october.ics" download="hyperbloom-october.ics">Save the deadline</TextLink></>}{event.brochure && <TextLink href={event.brochure} external>V2 brochure</TextLink>}{event.gallery && <TextLink href="/v1-gallery">V1 gallery &amp; videos</TextLink>}</div>}
        </article></Fragment>;
      })}
      {!visible.length && <div className="release-empty"><h3>No open events right now.</h3><p>Explore past challenges, or join the community for the next announcement.</p><button className="release-text-link" onClick={() => setFilter('all')}>See all events <ArrowRight size={18} /></button><TextLink href={links.discord} external>Join Discord</TextLink></div>}
    </div>
  </section>;
}

function ArticleEntry({ article, level = 2 }) {
  const Heading = `h${level}`;
  return <article className="journal-entry">
    <div className="journal-entry-meta"><span>{article.category}</span><span>Original · {article.time}</span></div>
    <Heading><a href={articlePath(article)}>{article.title}<ArrowRight size={24} aria-hidden="true" /></a></Heading>
    <p>{article.intro}</p>
    <div className="journal-entry-bottom"><a href="https://www.hyperbloomhacks.com/profile/kashvi172964630/profile" target="_blank" rel="noopener noreferrer" className="journal-author">Original by kashvi1729 <ArrowUpRight size={12} aria-hidden="true" /></a></div>
  </article>;
}
export function Journal({ motion }) {
  const scene = useAmbientScene(motion);
  return <section ref={scene} className="release-journal release-chapter" id="journal" aria-labelledby="journal-heading">
    <PetalAtmosphere variant="journal-art" />
    <div className="chapter-head has-flower"><FlowerAccent variant="journal" /><p className="chapter-kicker">The Hyperbloom journal</p><h2 id="journal-heading">Stay curious.</h2><p className="chapter-lead">Ideas, tools, and fresh perspectives from the community.</p></div>
    <div className="journal-preview">{articles.slice(0, 2).map(article => <ArticleEntry key={article.href} article={article} level={3} />)}</div>
    <div className="chapter-action"><Button href="/blog" secondary>Explore all articles</Button></div>
  </section>;
}

export function About({ motion }) {
  const scene = useAmbientScene(motion);
  return <section ref={scene} className="release-about release-chapter" id="about" aria-labelledby="about-heading">
    <PetalAtmosphere variant="about-art" />
    <div className="chapter-head"><p className="chapter-kicker">Our mission</p><h2 id="about-heading">For high schoolers.<br />By high schoolers.</h2><p className="chapter-lead serif">Room to create, learn new skills, and build with people who understand your ambition.</p></div>
    <div className="mission-statement"><p>Give high school students the space to collaborate and turn curiosity into useful ideas.</p><TextLink href={links.discord} external>Meet the community</TextLink></div>
    <div className="release-team"><div className="team-intro"><p className="chapter-kicker">The people behind the bloom</p><h3>Students building <span className="serif">for students.</span></h3></div><div className="release-team-list">{founders.map((person, index) => <article key={person.name}><span className="team-index" aria-hidden="true">0{index + 1}</span><div><h4>{person.name}</h4><p>{person.bio}</p><details className="team-profile"><summary><span className="bio-open-label">Read full bio</span><span className="bio-close-label">Hide full bio</span><Plus size={18} aria-hidden="true" /></summary><div>{teamProfiles[index].map(p => <p key={p}>{p}</p>)}</div></details></div></article>)}</div></div>
    <p className="team-source">Profiles adapted from the original biographies. <a href={links.official} target="_blank" rel="noopener noreferrer">Read the originals <ArrowUpRight size={14} aria-hidden="true" /></a></p>
  </section>;
}

const partners = [
  ['Deployxa', 'https://deployxa.com/', '6e5905c016119001.png'], ['Adaption Labs', 'https://adaptionlabs.ai/', '9f97ecf92b4b035a.png'], ['Y2 Labs', 'https://y2labs.co/', '9cd168bc3c7f08d4.png'], ['.xyz', 'https://gen.xyz/', 'ecca4a56100a0238.png'], ['YRI Science', 'https://yriscience.com/?ref=HYPERBLOOM', '643eee15370aedd6.png'], ['CodeCrafters', 'https://codecrafters.io/', '4cff1a117a363e52.jpg'], ['RBN Education', 'https://rbnedu.com/', '9d5140fd810d87aa.jpg'],
];
export function Partners({ motion }) {
  const root = useRef(null);
  const [keyboardView, setKeyboardView] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const expanded = !motion || keyboardView;
  const running = motion && !expanded && inView && pageVisible;
  return <section ref={root} className={`release-partners sponsor-carousel ${expanded ? 'is-expanded' : ''}`} id="partners" aria-label="Past sponsors and partners" data-running={running}>
    <div className="sponsor-heading"><div><p className="chapter-kicker">Past sponsors &amp; partners</p><p>Good ideas grow with good company.</p></div></div>
    <div className="sponsor-window" id="sponsor-logos" onFocusCapture={() => setKeyboardView(true)}><div className="sponsor-track"><ul className="sponsor-group">{partners.map(([name, href, file]) => <li key={name}><a href={href} aria-label={name} target="_blank" rel="noopener noreferrer"><img src={'/source/' + file} alt={name} loading="lazy" /></a></li>)}</ul>{!expanded && <div className="sponsor-group sponsor-duplicate" aria-hidden="true">{partners.map(([name, , file]) => <span key={name}><img src={'/source/' + file} alt="" loading="lazy" /></span>)}</div>}</div></div>
    <p className="sponsor-source-note">Past Hyperbloom partners · No endorsement of this mockup.</p>
  </section>;
}
export function Questions() {
  return <section className="release-questions release-chapter" id="questions" aria-labelledby="questions-heading"><div className="chapter-head"><p className="chapter-kicker">FAQ</p><h2 id="questions-heading">A few things to know.</h2></div><div className="release-faq">{faq.map(item => <details key={item.q} name="hyperbloom-questions"><summary>{item.q}<Plus size={21} aria-hidden="true" /></summary><div id={item.q === 'Who is eligible?' ? 'eligibility-answer' : undefined} tabIndex={item.q === 'Who is eligible?' ? -1 : undefined}><p>{item.a}</p><TextLink href={item.link} external>{item.label}</TextLink></div></details>)}</div></section>;
}

export function Footer({ motion, compact = false, controls }) {
  const scene = useAmbientScene(motion);
  const state = octoberState(useClock());
  return <footer className={`release-footer ${compact ? 'compact' : ''}`}>
    <section ref={scene} className={`release-closing ${compact ? 'compact-contact' : ''}`} id="contact" aria-labelledby="contact-title">
      {!compact && <PetalAtmosphere variant="closing-art" />}
      {!compact && <div className="closing-hero-art" aria-hidden="true"><img src="/art/event-stage-blend.webp" alt="" loading="lazy" decoding="async" /></div>}
      <div className={`closing-copy ${compact ? '' : 'has-flower'}`}>{!compact && <FlowerAccent variant="closing" />}<p className="chapter-kicker">Contact the original organization</p><h2 id="contact-title">{compact ? 'Talk to Hyperbloom.' : <>Let’s make<br />something bloom.</>}</h2>{!compact && <p className="contact-subtitle serif">Talk to Hyperbloom.</p>}
        {!compact && <div className="closing-buttons"><Button href="/#october">Explore October</Button><p>{state === 'closed' ? 'Submissions closed' : 'Submit by'} Oct 19, 2026 · 5 PM EDT</p></div>}
        <div className="closing-contact-methods"><a href={links.email}><EnvelopeSimple size={21} aria-hidden="true" />hyperbloomhacks@gmail.com</a><a href={links.discord} target="_blank" rel="noopener noreferrer"><DiscordLogo size={22} aria-hidden="true" />Join the Discord community <ArrowUpRight size={15} aria-hidden="true" /></a><div><a href={links.official} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={22} aria-hidden="true" />Official website &amp; live chat</a><p>Chat opens on the original Hyperbloom website.</p></div></div>
        <p className="contact-origin-note">{compact ? 'These links reach Hyperbloom, not this mockup’s creator.' : 'Contact links reach the original team.'} <a href="/terms#rights-contact">{compact ? 'Contact the creator about this prototype' : 'Prototype creator contact'}</a>.</p>
      </div>
    </section>
    <div className="release-footer-main"><div className="release-footer-brand"><a href="/#home" className="brand"><img src="/brand/hyperbloom-mark.svg" alt="" /><span>Hyperbloom Hacks</span></a><p>Empower. Engage. Innovate.</p></div><nav aria-label="Footer navigation"><a href="/#events">Events</a><a href="/#journey">What we offer</a><a href="/blog">Blog</a><a href="/gallery">Gallery</a><a href="/#about">Mission &amp; team</a><a href="/#questions">Questions</a></nav><div className="footer-social-links"><a href={links.instagram} target="_blank" rel="noopener noreferrer"><InstagramLogo size={21} aria-hidden="true" />Instagram</a><a href={links.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinLogo size={21} aria-hidden="true" />LinkedIn</a><a href="/#home"><ArrowUp size={20} aria-hidden="true" />Back to top</a></div></div>
    <aside className="prototype-disclosure" aria-label="Independent project disclaimer"><p><strong>Independent design mockup by Victor Velazquez.</strong> Victor does not own Hyperbloom Hacks. This concept is not affiliated with, sponsored by or endorsed by Hyperbloom Hacks or the organizations shown. Hyperbloom branding, original content and third-party marks belong to their respective owners.</p><nav aria-label="Legal and project information"><a href="/terms">Terms &amp; disclaimer</a><a href="/terms#privacy">Privacy notice</a><a href="/terms#rights-contact">Rights &amp; creator contact</a></nav></aside>
    <div className="release-footer-bottom"><span>2026 · Independent redesign by Victor Velazquez</span><span>Original brand &amp; content: respective owners</span><div className="footer-utilities">{controls}</div></div>
  </footer>;
}

export function BlogPage({ motion }) {
  const scene = useAmbientScene(motion);
  const search = useRef(null);
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [category, setCategory] = useState('all');
  const results = selectArticles(articles, query, category);
  useEffect(() => { const url = new URL(window.location.href); if (query.trim()) url.searchParams.set('q', query); else url.searchParams.delete('q'); window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash); }, [query]);
  const clear = () => { setQuery(''); setCategory('all'); search.current?.focus(); };
  return <div className="route-page blog-page">
    <section ref={scene} className="page-intro"><PetalAtmosphere variant="page-art" /><a className="page-back" href="/#home"><ArrowRight size={16} className="back-arrow" /> Home</a><ChapterHead page eyebrow="The Hyperbloom journal" title="Stay curious.">Ideas, tools, and fresh perspectives from the community.</ChapterHead></section>
    <section className="blog-catalogue" aria-label="All blog articles"><form role="search" className="journal-search" onSubmit={event => event.preventDefault()}><div className="journal-search-field"><MagnifyingGlass size={22} aria-hidden="true" /><label className="sr-only" htmlFor="journal-search">Search articles</label><input ref={search} id="journal-search" type="search" autoComplete="off" placeholder="Find an idea, topic, or tool…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" onClick={clear} aria-label="Clear search"><X size={19} /></button>}</div><label className="topic-filter"><span>Topic</span><select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter by topic"><option value="all">All topics</option><option value="AUTOMATION">Automation</option><option value="ARTIFICIAL INTELLIGENCE">Artificial intelligence</option><option value="DEVELOPMENT">Development</option></select></label></form><p className="catalogue-count" role="status">{results.length} {results.length === 1 ? 'article' : 'articles'}{query.trim() ? ` for “${query.trim()}”` : ''}</p><div className="blog-results">{results.map(article => <ArticleEntry key={article.href} article={article} />)}</div>{!results.length && <div className="release-empty"><h2>No ideas found just yet.</h2><p>Try “AI”, “API”, or “automation”, or explore all four articles.</p><button className="release-button secondary" onClick={clear}>Show all articles <ArrowRight size={20} /></button></div>}<p className="journal-service-note">Read concise guides here. Each one links to its complete original article, author profile, and conversation on the official blog.</p><TextLink href={links.blog} external>Visit the original blog</TextLink></section>
  </div>;
}

export function GalleryPage({ motion }) {
  const scene = useAmbientScene(motion);
  return <div className="route-page gallery-page">
    <section ref={scene} className="page-intro"><PetalAtmosphere variant="page-art" /><a className="page-back" href="/#home"><ArrowRight size={16} className="back-arrow" /> Home</a><ChapterHead page eyebrow="The Hyperbloom gallery" title="Ideas take shape." accent="Moments stay with us.">A look back at the people and projects that made it happen.</ChapterHead></section>
    <section className="gallery-catalogue" aria-label="Event galleries"><a className="gallery-entry" href="/v1-gallery">
      <div className="gallery-entry-copy"><div><span className="chapter-kicker">October 10–12, 2025</span><h2>Hyperbloom V1</h2><p>The first chapter. A winner, a community,<br className="desktop-break" /> and a whole lot of possibility.</p></div><span className="gallery-entry-action">Explore the gallery <ArrowRight size={24} /></span></div>
      <div className="gallery-entry-image"><img src="/source/v1-winner.avif" alt="Original Hyperbloom V1 winner announcement congratulating Deep" width="464" height="620" /><span><ArrowUpRight size={28} aria-hidden="true" /></span></div>
    </a></section>
  </div>;
}

export function V1GalleryPage({ motion }) {
  const scene = useAmbientScene(motion);
  const { open } = useMedia();
  return <div className="route-page v1-page"><section ref={scene} className="page-intro"><PetalAtmosphere variant="page-art" /><a className="page-back" href="/gallery"><ArrowRight size={16} className="back-arrow" /> All galleries</a><ChapterHead page eyebrow="Hyperbloom V1 · October 10–12, 2025" title="The first bloom.">Meet the winner. Watch the moments that started it.</ChapterHead><nav className="gallery-jumps" aria-label="Explore V1"><a href="#v1-winner">Winner</a><a href="#v1-recap">Recap</a><a href="#v1-presentations">Finalist presentations</a></nav></section>
    <div className="v1-story">
      <section id="v1-winner" className="v1-winner-feature"><button className="winner-image-button" onClick={event => open('winner', event)} aria-label="View full winner announcement"><img src="/source/v1-winner.avif" alt="Original Hyperbloom V1 winner announcement congratulating Deep" width="464" height="620" /><span>View announcement <ArrowUpRight size={18} aria-hidden="true" /></span></button><div className="gallery-section-heading"><p className="chapter-kicker">The recognition</p><h2>Hyperbloom V1 winner<br /><span className="winner-name">Deep</span></h2><p>Winner announcement from the original Hyperbloom V1 gallery.</p><TextLink href={links.recap} external>View the original gallery</TextLink></div></section>
      <section className="v1-recording" id="v1-recap"><div className="recording-preview"><img src="/source/v1-recap.avif" alt="Still from the official V1 recap" width="386" height="686" loading="lazy" /><button onClick={event => open('recap', event)} aria-label="Watch Hyperbloom V1 recap"><Play size={32} weight="fill" aria-hidden="true" /><span>Watch recap</span></button></div><div className="gallery-section-heading"><p className="chapter-kicker">The moments</p><h2>Event recap</h2><p className="recording-duration">27 seconds</p><p>A quick look back at the first Hyperbloom event.</p><button className="release-text-link" onClick={event => open('recap', event)}>Play the recording <Play size={17} aria-hidden="true" /></button></div></section>
      <section className="v1-recording" id="v1-presentations"><div className="recording-preview"><img src="/source/v1-presentations.avif" alt="Still from the original V1 finalist presentations" width="708" height="304" loading="lazy" /><button onClick={event => open('presentations', event)} aria-label="Watch Hyperbloom V1 finalist presentations"><Play size={32} weight="fill" aria-hidden="true" /><span>Watch presentations</span></button></div><div className="gallery-section-heading"><p className="chapter-kicker">The ideas</p><h2>Finalist presentations</h2><p className="recording-duration">9 min 36 sec</p><p>Watch the original presentations from Hyperbloom V1.</p><button className="release-text-link" onClick={event => open('presentations', event)}>Play the recording <Play size={17} aria-hidden="true" /></button></div></section>
      <p className="recording-access-note">Original event recordings. Captions and transcripts are not supplied.</p>
    </div><div className="v1-bottom"><Button href="/gallery" secondary>Back to all galleries</Button><TextLink href="/#events">Find your next challenge</TextLink></div></div>;
}

export function RecoveryPage({ closed = false }) {
  return <section className="recovery-page"><img src="/art/bloom-sculpture-v1.webp" alt="" className="recovery-bloom" /><p className="chapter-kicker">{closed ? 'Hyperbloom V1' : 'A little off the path'}</p><h1 tabIndex={-1}>{closed ? 'This chapter has closed.' : 'Let’s find your way back.'}</h1><p>{closed ? 'Registration for Hyperbloom V1 is closed. You can still explore its winner, recap, and presentations — or find your next event.' : 'We couldn’t find that page. Your next idea is still waiting to bloom.'}</p><div><Button href={closed ? '/v1-gallery' : '/#home'}>{closed ? 'Explore the V1 gallery' : 'Back to the beginning'}</Button><TextLink href="/#events">See all events</TextLink></div></section>;
}
