import { ArrowRight, Brain, BracketsCurly, Database, FlowArrow, Lightning, Robot, Sparkle } from '@phosphor-icons/react';

export function IdeaArtwork({ title = '', reader = false }) {
  const isAutomation = title.includes('n8n');
  const isApi = title.includes('API');
  const isAgent = title.includes('Agents');
  const parts = isAutomation ? [[Lightning, 'Trigger'], [FlowArrow, 'Workflow'], [Sparkle, 'Action']] : isApi ? [[BracketsCurly, 'Request'], [ArrowRight, 'API'], [Database, 'Response']] : isAgent ? [[Sparkle, 'Goal'], [Robot, 'Agent'], [FlowArrow, 'Tools']] : [[Database, 'Data'], [Brain, 'Network'], [Sparkle, 'Prediction']];
  return <div className={`idea-artwork ${reader ? 'reader-artwork' : ''}`} aria-hidden="true"><div className="idea-orbit orbit-one" /><div className="idea-orbit orbit-two" /><div className="idea-nodes">{parts.map(([Icon, label], index) => <div className="idea-node" key={label}><span className={index === 1 ? 'node-icon node-heart' : 'node-icon'}><Icon size={index === 1 ? 30 : 24} weight="light" /></span><span>{label}</span></div>)}</div><span className="idea-art-label">{isAutomation ? 'Connect the possibilities' : isApi ? 'A conversation between systems' : isAgent ? 'From intention to action' : 'Patterns become possibilities'}</span></div>;
}
