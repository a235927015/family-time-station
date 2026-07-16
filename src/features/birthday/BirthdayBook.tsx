import { useEffect, useRef, useState, type TouchEvent } from 'react';
import type { BirthdayConfig } from './trips';
import './birthday.css';

interface Props { config: BirthdayConfig; onFinish: () => void }
type Stage = 'cover' | 'stops' | 'summary' | 'gift';

export function BirthdayBook({ config, onFinish }: Props) {
  const [stage, setStage] = useState<Stage>('cover'); const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); const [playing, setPlaying] = useState(false); const [imageFailed, setImageFailed] = useState(false);
  const audio = useRef<HTMLAudioElement>(null); const touchStart = useRef<number | null>(null);
  const stop = config.stops[index];

  function next() {
    if (stage === 'stops' && index < config.stops.length - 1) { setIndex((value) => value + 1); setImageFailed(false); }
    else if (stage === 'stops') setStage('summary');
    else if (stage === 'summary') setStage('gift');
  }
  function previous() { if (stage === 'stops' && index > 0) { setIndex((value) => value - 1); setImageFailed(false); } }
  async function toggleMusic() {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else { try { await audio.current.play(); setPlaying(true); } catch { setPlaying(false); } }
  }
  function finish() { window.localStorage.setItem('laoba:birthday-seen', '1'); audio.current?.pause(); onFinish(); }
  function endTouch(event: TouchEvent) {
    if (touchStart.current === null) return; const delta = event.changedTouches[0].clientX - touchStart.current; touchStart.current = null;
    if (delta < -45) next(); else if (delta > 45) previous();
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (stage !== 'stops' || paused || reduceMotion) return;
    const timer = window.setTimeout(next, 6500); return () => window.clearTimeout(timer);
  }, [stage, index, paused]);
  useEffect(() => { if (stage === 'stops' && index + 1 < config.stops.length) { const image = new Image(); image.src = config.stops[index + 1].image; } }, [stage, index, config.stops]);

  return <main className="birthday-book" onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={endTouch}>
    {config.music && <audio ref={audio} src={config.music} loop preload="none" />}
    <div className="birthday-tools"><span>家庭旅行册</span><div>{stage !== 'cover' && stage !== 'gift' && <button onClick={() => setPaused((value) => !value)} aria-label={paused ? '继续自动翻页' : '暂停自动翻页'}>{paused ? '继续' : '暂停'}</button>}<button onClick={toggleMusic}>{playing ? '关闭音乐' : '播放音乐'}</button>{stage !== 'cover' && stage !== 'gift' && <button onClick={() => setStage('gift')} aria-label="跳过旅行照片">跳过</button>}</div></div>
    {stage === 'cover' && <section className="birthday-cover"><div className="travel-stamp">07 · 17<br />专属行程</div><div className="cover-copy"><p>今天的行程，你不用做攻略</p><h1>{config.coverTitle}</h1><p>{config.coverBody}</p><button className="birthday-cta" onClick={() => setStage('stops')}>出发</button><small>大约 45 秒 · 随时可跳过</small></div></section>}
    {stage === 'stops' && <section className="trip-slide" key={index}><div className="trip-photo">{!imageFailed ? <img src={stop.image} alt={`${stop.place}旅行照片`} style={{ objectPosition: stop.objectPosition ?? 'center' }} onError={() => setImageFailed(true)} /> : <div className="photo-placeholder"><span>请替换旅行照片</span><strong>{stop.place}</strong></div>}</div><div className="trip-copy"><div><p>第 {String(index + 1).padStart(2, '0')} 站</p><h1>{stop.place}</h1><p className="memory-line">{stop.memory}</p></div><span>{String(index + 1).padStart(2, '0')} / {String(config.stops.length).padStart(2, '0')}</span></div><div className="trip-controls"><button disabled={index === 0} onClick={previous}>上一张</button><button className="birthday-cta" onClick={next}>下一张</button></div><div className="trip-progress"><i style={{ width: `${((index + 1) / config.stops.length) * 100}%` }} /></div></section>}
    {stage === 'summary' && <section className="trip-summary"><p>这几年去过的地方</p><h1>{config.stops.map((item) => item.place.split(' · ')[0]).join('、')}</h1><p>风景看了不少，下一站继续出发。</p><button className="birthday-cta" onClick={next}>最后一站</button></section>}
    {stage === 'gift' && <section className="birthday-gift"><p>照片看完了</p><h1>爸，生日快乐。<br />礼物在这儿。</h1><p>以后收房租、浇花、纪念日，它帮你记。你只管安排下一次旅行。</p><div className="gift-ticket"><strong>家庭时光局</strong><span>每周、每月、每年提醒<br />重要事项可加入手机日历</span></div><button className="birthday-cta" onClick={finish}>打开我的提醒工具</button></section>}
  </main>;
}
