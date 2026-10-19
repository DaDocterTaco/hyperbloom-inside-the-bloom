import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import { links, media } from './content';

const MediaContext = createContext(null);
export const useMedia = () => useContext(MediaContext);

export function MediaProvider({ children }) {
  const [item, setItem] = useState(null);
  const [failed, setFailed] = useState(false);
  const dialog = useRef(null);
  const opener = useRef(null);
  const open = (kind, event) => { opener.current = event?.currentTarget || document.activeElement; setFailed(false); setItem(kind); };
  const close = () => { dialog.current?.close(); setItem(null); opener.current?.focus({ preventScroll: true }); };
  useEffect(() => { if (item) dialog.current?.showModal(); }, [item]);
  const title = item === 'winner' ? 'Hyperbloom V1 winner announcement' : item === 'recap' ? 'Hyperbloom V1 recap' : 'V1 finalist presentations';
  return <MediaContext.Provider value={{ open }}>
    {children}
    {item && <dialog ref={dialog} className={`release-media-dialog ${item === 'winner' ? 'announcement-dialog' : ''}`} aria-labelledby="media-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="release-media-heading"><h2 id="media-title">{title}</h2><button onClick={close} aria-label="Close media"><X size={24} /></button></div>
      {item === 'winner' ? <img className="winner-full" src="/source/v1-winner.avif" alt="Original Hyperbloom V1 announcement congratulating winner Deep" /> : <video key={item} controls autoPlay playsInline src={media[item]} poster={item === 'recap' ? '/source/v1-recap.avif' : '/source/v1-presentations.avif'} onError={() => setFailed(true)} />}
      {failed && <p className="media-error" role="status">The video couldn’t load. You can watch it in the original event gallery below.</p>}
      <a className="media-source" href={links.recap} target="_blank" rel="noopener noreferrer">Original event gallery <ArrowUpRight size={16} /></a>
    </dialog>}
  </MediaContext.Provider>;
}
