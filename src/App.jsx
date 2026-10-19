import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  List,
  X,
  Monitor,
  CalendarBlank,
  Plus,
  Minus,
  Play,
  Pause,
  DiscordLogo,
  InstagramLogo,
  LinkedinLogo,
  ChatCircle,
  EnvelopeSimple,
  ArrowUp,
} from "@phosphor-icons/react";
import { links, offerings } from "./content";
import { Community, EventArchive, Journal, About, Partners, Questions, Footer, BlogPage, GalleryPage, V1GalleryPage, RecoveryPage } from "./Experience";
import { MediaProvider } from "./MediaDialog";
import { useSiteNavigation } from "./navigation";
import { BloomChapter } from "./BloomChapter";
import { useJourneyMotion } from "./journeyMotion";
import { useClock } from './experienceHooks';
import { octoberState } from './siteLogic.mjs';
import { ArticlePage } from './ArticlePage';
import { BloomContinuity } from './BloomContinuity';
import { LegalPage } from './LegalPage';

function Action({ href, children, ...props }) {
  return (
    <a className="button" href={href} {...props}>
      {children}
      <ArrowRight size={23} aria-hidden="true" />
    </a>
  );
}
function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? "light" : ""}`}>{children}</p>;
}
function Brand() {
  return (
    <a className="brand" href="/#home" aria-label="Hyperbloom redesign home — independent design mockup">
      <img src="/brand/hyperbloom-mark.svg" alt="" />
      <span>Hyperbloom Hacks<small>Independent design mockup</small></span>
    </a>
  );
}

function Header({ open, setOpen, route, motionControl }) {
  const header = useRef(null);
  const toggle = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 70);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const nav = [
    ["Events", "/#events"],
    ["Blog", "/blog"],
    ["Gallery", "/gallery"],
    ["Discord", links.discord],
    ["Contact", "#contact"],
  ];
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, setOpen]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const dismissAtDesktop = e => { if (e.matches) setOpen(false); };
    const dismissOutside = e => { if (open && !header.current?.contains(e.target)) setOpen(false); };
    desktop.addEventListener('change', dismissAtDesktop);
    document.addEventListener('pointerdown', dismissOutside);
    return () => { desktop.removeEventListener('change', dismissAtDesktop); document.removeEventListener('pointerdown', dismissOutside); };
  }, [open, setOpen]);
  return (
    <header ref={header} className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([label, href]) => (
          <a key={label} href={href} aria-current={(label === "Blog" && ['blog','article'].includes(route)) || (label === "Gallery" && ["gallery", "v1"].includes(route)) ? "page" : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="/#october">
        Explore October <ArrowRight size={20} />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <List size={24} />}
      </button>
        <nav
          id="mobile-menu"
          hidden={!open}
          inert={!open}
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {[["Home", "/#home"], ["Current challenge", "/#october"], ...nav].map(
            ([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={22} />
              </a>
            ),
          )}
          <div className="menu-utilities">{motionControl}</div>
        </nav>
    </header>
  );
}
function BloomHero() {
  const state = octoberState(useClock());
  return (
    <section
      id="home"
      className="hero"
      tabIndex={-1}
      aria-labelledby="hero-heading"
    >
      <div className="hero-static-art" aria-hidden="true">
        <img src="/art/bloom-scene.webp" alt="" fetchPriority="high" decoding="async" onError={e => { if (!e.currentTarget.src.endsWith('.png')) e.currentTarget.src='/art/bloom-scene.png'; }} />
      </div>
      <div className="hero-content">
        <div className="masthead" aria-hidden="true">
          hyperbloom
        </div>
        <p className="motto">Empower. Engage. Innovate.</p>
        <p className="hero-project-notice">Not affiliated with or endorsed by Hyperbloom Hacks. <a href="/terms">Project notice</a></p>
        <div className="hero-intro">
          <h1 id="hero-heading">
            Make
            <br />
            something
            <br />
            bloom.
          </h1>
          <p>
            Student-led hackathons for curious minds.
          </p>
          <div className="hero-actions"><Action href="/#october">Explore October</Action><p className="hero-deadline"><CalendarBlank size={20} aria-hidden="true" /><span>{state === 'closed' ? 'Submissions closed · Oct 19, 2026 · 5 PM EDT' : 'Submit by Oct 19, 2026 · 5 PM EDT'}</span></p><a className="hero-all-events" href="/#events">All events <ArrowRight size={18} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  );
}
function October() {
  const state = octoberState(useClock());
  return (
    <section
      className="october section-center"
      id="october"
      tabIndex={-1}
      aria-labelledby="october-heading"
    >
      <div className="event-petals" aria-hidden="true">
        <img src="/art/event-stage-blend.webp" alt="" loading="lazy" />
      </div>
      <div className="challenge-content">
      <Eyebrow>{state === 'closed' ? 'October challenge' : 'Current challenge'}</Eyebrow>
      <h2 id="october-heading">Hyperbloom October</h2>
      <p className="serif event-theme">UI/UX &amp; Web Design</p>
      <p className="section-description">
        Design a website, interface, or prototype.
      </p>
      <div className="event-facts">
        <p>
          <Monitor size={25} aria-hidden="true" />
          <span className="fact-copy">
            <span>Online</span>{" "}<span className="fact-divider" aria-hidden="true">·</span>{" "}<span>Beginner-friendly</span>
          </span>
        </p>
        <p className="event-deadline">
          <CalendarBlank size={25} aria-hidden="true" />
          <span className="fact-copy">
            <time dateTime="2026-10-19T17:00:00-04:00">{state === 'closed' ? 'Closed Oct 19, 2026' : 'Submit by Oct 19, 2026'}</time>{" "}
            <span className="fact-divider" aria-hidden="true">·</span>{" "}<span className="event-time">5 PM EDT</span>
          </span>
        </p>
      </div>
      <p className="event-dates">Event dates: <time dateTime="2026-10-01">Oct 1</time>–<time dateTime="2026-10-20">20, 2026</time></p>
      <Action href={links.october}>View challenge on Devpost</Action>
      <div className="challenge-links"><a className="quiet-link" href={links.rules} target="_blank" rel="noopener noreferrer">Official rules <ArrowUpRight size={15} aria-hidden="true" /></a><a className="quiet-link" href="/#eligibility-answer">Student eligibility <ArrowRight size={15} aria-hidden="true" /></a></div>
      <p className="eligibility-note">Check the event’s eligibility rules before entering.</p>
      <div className="section-thread" aria-hidden="true" />
      </div>
    </section>
  );
}
function JourneyScene({ className, onLoad, onError }) {
  return (
    <picture className={className}>
      <source media="(max-width: 760px)" srcSet="/art/journey-interior-mobile-v2.webp" />
      <img className="journey-interior" src="/art/journey-interior-desktop-v2.webp" alt="" loading="lazy" decoding="async" onLoad={onLoad} onError={onError} />
    </picture>
  );
}
function Journey({ motion }) {
  const root = useRef(null);
  const [artReady, setArtReady] = useState(false);
  useJourneyMotion(root, motion);
  return (
    <section ref={root} id="journey" className="journey section-center" aria-labelledby="journey-heading" tabIndex={-1} data-motion={motion ? 'on' : 'off'} data-art={artReady ? 'ready' : 'loading'}>
      <div className="journey-art" aria-hidden="true">
        <div className="journey-camera">
          <JourneyScene className="journey-rear-view" onLoad={() => setArtReady(true)} onError={() => setArtReady(false)} />
          <JourneyScene className="journey-wall journey-wall-left" />
          <JourneyScene className="journey-wall journey-wall-right" />
        </div>
        <div className="journey-foreground">
          <img className="journey-front journey-front-left" src="/art/petals-left.webp" alt="" loading="lazy" decoding="async" />
          <img className="journey-front journey-front-right" src="/art/petals-right.webp" alt="" loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="journey-copy">
        <h2 className="serif" id="journey-heading">What we offer.</h2>
        <p className="section-description">Support for your next big idea.</p>
        <ul className="journey-steps">
          {offerings.map(item => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        <div className="journey-actions"><Action href="/#events">See events</Action></div>
      </div>
    </section>
  );
}
function ContactPanel() {
  const panel = useRef(null);
  const trigger = useRef(null);
  const close = () => { panel.current?.close(); trigger.current?.focus({ preventScroll: true }); };
  return <>
    <button ref={trigger} className="footer-utility" aria-label="Contact Hyperbloom" aria-haspopup="dialog" onClick={() => panel.current?.showModal()}><ChatCircle size={19} aria-hidden="true" /> Contact options</button>
    <dialog ref={panel} className="contact-dialog" aria-labelledby="contact-heading" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <button className="contact-close" aria-label="Close contact options" onClick={close}><X size={23} /></button>
      <p className="eyebrow">Original organization</p>
      <h2 id="contact-heading">Talk to Hyperbloom.</h2>
      <p className="contact-intro">These links reach the original Hyperbloom team. This independent mockup is maintained separately.</p>
      <div className="contact-options">
        <a href={links.email}><EnvelopeSimple size={24} /><span><strong>Email</strong><small>hyperbloomhacks@gmail.com</small></span><ArrowUpRight size={20} /></a>
        <a href={links.discord} target="_blank" rel="noopener noreferrer"><DiscordLogo size={24} /><span><strong>Discord</strong><small>Visit the Hyperbloom community</small></span><ArrowUpRight size={20} /></a>
        <a href={links.official} target="_blank" rel="noopener noreferrer"><ChatCircle size={24} /><span><strong>Official live chat</strong><small>Use “Let’s Chat!” on their website</small></span><ArrowUpRight size={20} /></a>
      </div>
      <p className="contact-origin-note">For this prototype or rights concerns, <a href="/terms#rights-contact" onClick={close}>contact the creator</a>.</p>
    </dialog>
  </>;
}
export function App() {
  const { route, routeKey, onLinkClick } = useSiteNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionRequested, setMotionRequested] = useState(() => {
    try { return localStorage.getItem("hyperbloom:motion") !== "off"; } catch { return true; }
  });
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const motion = motionRequested && !reducedMotion;
  useEffect(() => { setMenuOpen(false); }, [routeKey]);
  useEffect(() => {
    try { localStorage.setItem("hyperbloom:motion", motionRequested ? "on" : "off"); } catch { /* Preferences are optional in private browsing. */ }
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motionRequested, motion]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <MediaProvider key={route}><div className={`${motion ? 'app' : 'app motion-paused'} premium-experience`} onClick={onLinkClick}>
      <BloomContinuity motion={motion} route={route} />
      <a className="skip-link" href={route === "home" ? "#october" : "#main-content"}>
        {route === "home" ? "Skip to the current challenge" : "Skip to main content"}
      </a>
      <Header open={menuOpen} setOpen={setMenuOpen} route={route} motionControl={<MotionControl motion={motion} reducedMotion={reducedMotion} toggle={() => setMotionRequested(!motionRequested)} />} />
      <main id="main-content" tabIndex={-1}>
        {route === "home" ? <>
          <BloomChapter motion={motion}><BloomHero /><October /></BloomChapter>
          <Partners motion={motion} />
          <Journey motion={motion} />
          <Community motion={motion} />
          <EventArchive motion={motion} />
          <Journal motion={motion} />
          <About motion={motion} />
          <Questions />
        </> : route === "terms" ? <LegalPage /> : route === "blog" ? <BlogPage motion={motion} /> : route === 'article' ? <ArticlePage key={routeKey} motion={motion} /> : route === "gallery" ? <GalleryPage motion={motion} /> : route === "v1" ? <V1GalleryPage motion={motion} /> : <RecoveryPage closed={route === "closed"} />}
      </main>
      <Footer motion={motion} compact={route !== "home"} controls={<><MotionControl motion={motion} reducedMotion={reducedMotion} toggle={() => setMotionRequested(!motionRequested)} /><ContactPanel /></>} />
    </div></MediaProvider>
  );
}

function MotionControl({ motion, reducedMotion, toggle }) {
  return <button
        className="footer-utility"
        disabled={reducedMotion}
        aria-pressed={!motion}
        onClick={toggle}
        aria-label={
          reducedMotion ? "Decorative motion off: reduced-motion preference" : motion ? "Pause decorative motion" : "Enable decorative motion"
        }
        title={reducedMotion ? "Uses your system’s reduced-motion preference" : motion ? "Pause motion" : "Enable motion"}
      >
        {motion ? (
          <Pause size={15} weight="fill" />
        ) : (
          <Play size={15} weight="fill" />
        )}
        <span>{reducedMotion ? 'Reduced motion' : motion ? 'Pause motion' : 'Enable motion'}</span>
      </button>;
}
