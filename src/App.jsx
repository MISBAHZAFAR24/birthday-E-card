import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Gift,
  Heart,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

const HEART_FILL_DURATION = 8500;
const JOURNEY_STEPS = [
  { id: 'birthday', label: 'Birthday cake' },
  { id: 'heart', label: 'Fill my heart' },
  { id: 'message', label: 'Birthday message' },
  { id: 'letter', label: 'Love letter' },
  { id: 'memories', label: 'Photo memories' },
  { id: 'gift', label: 'Birthday gift' },
  { id: 'final-cake', label: 'Final cake' },
  { id: 'final', label: 'Birthday wishes' },
];
const galleryPhotos = Array.from({ length: 6 }, (_, index) => ({
  src: `/images/photo-${index + 1}.jpg`,
  number: String(index + 1).padStart(2, '0'),
  label: ['A little sunshine', 'One for the heart', 'A favorite feeling', 'Golden-hour you', 'Just because', 'A day to keep'][index],
  caption: [
    'You make even the softest moments glow.',
    'This is a moment I wish I could pause.',
    'Your smile is still my favorite view.',
    'I love this playful side of you.',
    'With you, even an ordinary day feels special.',
    'Keep smiling, Qalbi. It suits your heart.',
  ][index],
}));

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Sparkles({ count = 12, className = '' }) {
  return (
    <div aria-hidden="true" className={`sparkle-field ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <span
          className="sparkle"
          key={index}
          style={{
            '--x': `${(index * 37 + 11) % 100}%`,
            '--y': `${(index * 59 + 8) % 100}%`,
            '--delay': `${(index % 7) * -0.43}s`,
            '--size': `${2 + (index % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

function Confetti({ active, count = 54 }) {
  if (!active) return null;
  return (
    <div className="confetti-layer" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i
          className={`confetti-piece confetti-piece--${index % 5}`}
          key={index}
          style={{
            '--left': `${(index * 53 + 7) % 100}%`,
            '--delay': `${(index % 12) * -0.13}s`,
            '--duration': `${2.8 + (index % 7) * 0.24}s`,
            '--drift': `${((index * 31) % 160) - 80}px`,
          }}
        />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: 0.7 }}>
      <Sparkles count={22} />
      <motion.div className="loading-heart" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
        <Heart fill="currentColor" strokeWidth={1.4} />
      </motion.div>
      <p className="eyebrow loading-eyebrow">A little something, just for you</p>
      <h1>Wait... I made something<br />special for you <span>❤️</span></h1>
      <p className="loading-copy">Just a little surprise from my heart...</p>
      <div className="loading-dots" aria-label="Loading"><i /><i /><i /></div>
    </motion.div>
  );
}

function WelcomeScreen({ onOpen }) {
  return (
    <motion.main className="welcome-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.035 }} transition={{ duration: 0.85 }}>
      <Sparkles count={26} />
      <div aria-hidden="true" className="welcome-orbit welcome-orbit--one" />
      <div aria-hidden="true" className="welcome-orbit welcome-orbit--two" />
      <motion.span className="welcome-flower" aria-hidden="true" animate={{ rotate: [0, 8, -6, 0], y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }}>✳</motion.span>
      <div className="welcome-content">
        <p className="eyebrow">A little love note, wrapped in a surprise</p>
        <h1>Hey <span>Qalbi</span> <span className="welcome-heart">♥</span></h1>
        <p className="welcome-lede">Today isn't just another day...</p>
        <p className="welcome-sub">Today is the day someone very special<br className="desktop-break" /> came into this world.</p>
        <motion.button className="button button--light" onClick={onOpen} whileTap={{ scale: 0.96 }}>
          <span>Open your surprise</span><Gift size={17} strokeWidth={1.8} />
        </motion.button>
        <span className="welcome-note"><Heart size={12} fill="currentColor" /> made with you in mind</span>
      </div>
      <span className="welcome-bottom">SOMETHING LOVELY IS WAITING</span>
    </motion.main>
  );
}

function SectionHeading({ eyebrow, children, light = false, className = '' }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''} ${className}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{children}</h2>
      <span className="heading-flourish" aria-hidden="true">✳</span>
    </div>
  );
}

function JourneyProgress() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const sections = JOURNEY_STEPS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const activeSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => Math.abs(first.boundingClientRect.top) - Math.abs(second.boundingClientRect.top))[0];
      if (!activeSection) return;
      const step = JOURNEY_STEPS.findIndex(({ id }) => id === activeSection.target.id);
      if (step >= 0) setActiveStep(step);
    }, { rootMargin: '-38% 0px -48% 0px' });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="journey-progress"
      role="progressbar"
      aria-label="Birthday surprise progress"
      aria-valuemin={1}
      aria-valuemax={JOURNEY_STEPS.length}
      aria-valuenow={activeStep + 1}
      aria-valuetext={`${JOURNEY_STEPS[activeStep].label}, chapter ${activeStep + 1} of ${JOURNEY_STEPS.length}`}
    >
      <span className="journey-progress__count">{String(activeStep + 1).padStart(2, '0')} / {String(JOURNEY_STEPS.length).padStart(2, '0')}</span>
      <span className="journey-progress__dots" aria-hidden="true">
        {JOURNEY_STEPS.map((step, index) => <i className={index === activeStep ? 'journey-progress__dot journey-progress__dot--active' : 'journey-progress__dot'} key={step.id} />)}
      </span>
      <Heart className="journey-progress__heart" size={12} fill="currentColor" aria-hidden="true" />
    </div>
  );
}

function Cake({ large = false, extinguished = false, candlesOff = 0 }) {
  return (
    <div className={`cake-art ${large ? 'cake-art--large' : ''}`}>
      <span className="cake-shadow" />
      <div className="cake-topper">Happy Birthday Eva Bukht Qalbuu <span>♥</span></div>
      <div className="cake-candles" aria-hidden="true">
        {Array.from({ length: large ? 5 : 3 }, (_, index) => (
          <span className="cake-candle" key={index} style={{ '--candle-index': index }}>
            <i className={`candle-flame ${extinguished || index < candlesOff ? 'candle-flame--out' : ''}`} />
          </span>
        ))}
      </div>
      <div className="cake-tier cake-tier--top"><i className="cake-drip" /><span className="cake-heart cake-heart--one">♥</span><span className="cake-heart cake-heart--two">♥</span></div>
      <div className="cake-tier cake-tier--middle"><i className="cake-drip" /><span className="cake-frosting-dot" /><span className="cake-frosting-dot" /><span className="cake-frosting-dot" /></div>
      <div className="cake-tier cake-tier--bottom"><span className="cake-bottom-heart">♥</span><span className="cake-bottom-heart">♥</span><span className="cake-bottom-heart">♥</span></div>
      <span className="cake-plate" />
      <span className="cake-twinkle cake-twinkle--one">✦</span><span className="cake-twinkle cake-twinkle--two">✧</span>
    </div>
  );
}

function BirthdayCake({ onWish, wished }) {
  const [wishDim, setWishDim] = useState(false);
  const handleWish = () => {
    onWish();
    setWishDim(true);
    window.setTimeout(() => setWishDim(false), 1400);
  };
  return (
    <section className={`chapter chapter--birthday ${wishDim ? 'chapter--birthday-wish-dim' : ''}`} id="birthday" aria-labelledby="birthday-title">
      <Sparkles count={18} />
      <div className="chapter-content birthday-content">
        <SectionHeading eyebrow="Chapter one · your day" className="birthday-heading">A whole day,<br />just for you.</SectionHeading>
        <motion.div className="birthday-cake-wrap" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.85 }}>
          <Confetti active={!wished} count={34} />
          <Confetti active={wished} count={60} />
          <Cake extinguished={wished} />
        </motion.div>
        <div className="birthday-caption">
          <p id="birthday-title" className="birthday-caption__line">Today, the whole universe is celebrating you.</p>
          <p className="birthday-caption__name">Happy Birthday, Qalbi! <span>❤️</span></p>
          <AnimatePresence>
            {wished ? (
              <motion.p className="wish-message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                I hope every little wish in your heart finds its way to you. <span>❤️</span>
              </motion.p>
            ) : (
              <motion.button className="button button--rose" onClick={handleWish} whileTap={{ scale: 0.96 }}>
                Make a wish <span>✧</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <button className="chapter-next" onClick={() => scrollTo('heart')} aria-label="Continue to the next chapter"><ArrowDown size={17} /><span>keep going</span></button>
      </div>
    </section>
  );
}

function FillHeart({ onComplete }) {
  const [fill, setFill] = useState(0);
  const [holding, setHolding] = useState(false);
  const frameRef = useRef(0);
  const fillRef = useRef(0);
  const completedRef = useRef(false);

  const stopFilling = useCallback(() => {
    setHolding(false);
    cancelAnimationFrame(frameRef.current);
  }, []);

  const startFilling = useCallback((event) => {
    if (completedRef.current || event.button > 0) return;
    event.preventDefault();
    if (Number.isInteger(event.pointerId)) event.currentTarget.setPointerCapture?.(event.pointerId);
    setHolding(true);
    let previous = performance.now();
    const advance = (now) => {
      if (!fillRef.current && fillRef.current !== 0) fillRef.current = 0;
      const elapsed = Math.min(now - previous, 48);
      previous = now;
      fillRef.current = Math.min(100, fillRef.current + (elapsed / HEART_FILL_DURATION) * 100);
      setFill(fillRef.current);
      if (fillRef.current >= 100) {
        completedRef.current = true;
        setHolding(false);
        onComplete();
      } else {
        frameRef.current = requestAnimationFrame(advance);
      }
    };
    frameRef.current = requestAnimationFrame(advance);
  }, [onComplete]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <div
      className={`fill-heart ${holding ? 'fill-heart--holding' : ''} ${fill >= 100 ? 'fill-heart--full' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Hold to fill my heart with your love. ${Math.round(fill)} percent filled.`}
      onPointerDown={startFilling}
      onPointerUp={stopFilling}
      onPointerCancel={stopFilling}
      onLostPointerCapture={stopFilling}
      onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') startFilling({ ...event, button: 0, preventDefault: () => event.preventDefault(), currentTarget: event.currentTarget, pointerId: 'keyboard' }); }}
      onKeyUp={(event) => { if (event.key === ' ' || event.key === 'Enter') stopFilling(); }}
      style={{ '--fill-offset': `${fill * 2.24}px` }}
    >
      <svg className="heart-vessel" viewBox="0 0 240 224" role="img" aria-label="A glowing heart slowly filling with rosy light">
        <defs>
          <clipPath id="heart-clip"><path d="M120 211 104 197C44 144 13 116 13 77 13 45 38 20 70 20c18 0 36 9 50 24 14-15 32-24 50-24 32 0 57 25 57 57 0 39-31 67-91 120l-16 14Z" /></clipPath>
          <linearGradient id="heart-liquid" x1="0" y1="0" x2=".9" y2="1"><stop offset="0%" stopColor="#ff7889" /><stop offset="52%" stopColor="#f32f52" /><stop offset="100%" stopColor="#c4133b" /></linearGradient>
          <radialGradient id="heart-gloss" cx="35%" cy="20%"><stop offset="0%" stopColor="#fff" stopOpacity=".55" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        <g clipPath="url(#heart-clip)">
          <rect x="0" y="0" width="240" height="224" fill="rgba(255,255,255,.055)" />
          <rect className="heart-liquid-fill" x="0" y="224" width="240" height="224" fill="url(#heart-liquid)" />
          <path className="heart-wave heart-wave--one" d="M0 0 Q30 -10 60 0 T120 0 T180 0 T240 0 V224 H0Z" fill="rgba(255,255,255,.22)" />
          <path className="heart-wave heart-wave--two" d="M0 0 Q30 8 60 0 T120 0 T180 0 T240 0 V224 H0Z" fill="rgba(255,255,255,.13)" />
          <ellipse cx="91" cy="81" rx="115" ry="135" fill="url(#heart-gloss)" />
        </g>
        <path className="heart-outline" d="M120 211 104 197C44 144 13 116 13 77 13 45 38 20 70 20c18 0 36 9 50 24 14-15 32-24 50-24 32 0 57 25 57 57 0 39-31 67-91 120l-16 14Z" />
      </svg>
      <span className="fill-heart-shine" aria-hidden="true" />
      <span className="fill-heart-particle fill-heart-particle--one" aria-hidden="true">♥</span>
      <span className="fill-heart-particle fill-heart-particle--two" aria-hidden="true">✦</span>
      <span className="fill-heart-particle fill-heart-particle--three" aria-hidden="true">♥</span>
      <span className="fill-heart-particle fill-heart-particle--four" aria-hidden="true">✧</span>
      <span className="fill-heart-progress" aria-hidden="true">{Math.round(fill)}%</span>
    </div>
  );
}

function FillMyHeart({ onContinue }) {
  const [full, setFull] = useState(false);
  const complete = useCallback(() => setFull(true), []);

  useEffect(() => {
    if (!full) return undefined;
    const timer = window.setTimeout(() => scrollTo('message'), 2200);
    return () => window.clearTimeout(timer);
  }, [full]);

  return (
    <section className="chapter chapter--heart" id="heart" aria-labelledby="heart-title">
      <Sparkles count={22} />
      <div className="chapter-content heart-content">
        <SectionHeading eyebrow="Chapter two · a tiny confession" light>One little<br />thing, first.</SectionHeading>
        <h3 id="heart-title" className="heart-prompt">Qalbi... fill my heart<br />with your love <span>❤️</span></h3>
        <FillHeart onComplete={complete} />
        <p className="hold-instruction">{full ? 'Oh, there you are.' : 'Touch & hold the heart'} <span>{full ? '♥' : '· press and keep holding ·'}</span></p>
        <AnimatePresence>
          {full && (
            <motion.div className="heart-reveal" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Confetti active count={45} />
              <p>You filled my heart with love, Qalbi. <span>❤️</span></p>
              <span className="heart-reveal__soft">Maybe that's where you have always belonged.</span>
              <button className="button button--light" onClick={onContinue}>Continue <Heart size={15} fill="currentColor" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function BirthdayMessage() {
  return (
    <section className="chapter chapter--message" id="message">
      <Sparkles count={15} />
      <div className="message-inner">
        <span className="message-stamp"><Heart fill="currentColor" size={19} /></span>
        <p className="eyebrow">A little note for your new year</p>
        <h2>Happy Birthday,<br /><span>Qalbi!</span> <span className="message-cake">🎂</span></h2>
        <span className="message-rule" aria-hidden="true" />
        <p className="message-copy">Happy Birthday to the most special person in my life. I hope your day is filled with happiness, smiles and beautiful memories. You deserve all the love and happiness in the world.</p>
        <p className="message-signoff">And this little surprise is just for you... <span>♡</span></p>
        <div className="message-floating-heart message-floating-heart--one" aria-hidden="true">♥</div>
        <div className="message-floating-heart message-floating-heart--two" aria-hidden="true">♥</div>
      </div>
    </section>
  );
}

function LoveLetter() {
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  const [voiceFinished, setVoiceFinished] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const voiceRef = useRef(null);

  const toggleLetterSpeech = async () => {
    const voice = voiceRef.current;
    if (!voice) return;
    setVoiceError(false);
    if (!voice.paused) {
      voice.pause();
      return;
    }

    try {
      await voice.play();
    } catch {
      setVoiceError(true);
    }
  };

  return (
    <section className="chapter chapter--letter" id="letter">
      <div className="letter-side-note" aria-hidden="true">WITH ALL MY HEART</div>
      <motion.article className="letter-paper" initial={{ opacity: 0, y: 32, rotate: 1 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.85 }}>
        <div className="letter-paper__top"><span>Just for you</span><Heart size={16} fill="currentColor" /></div>
        <p className="letter-date">On your very special day</p>
        <h2>For My Qalbi <span>❤️</span></h2>
        <div className="letter-copy">
          <p>There are some people who quietly become a beautiful part of your life without even trying. Somehow, you became one of those people for me.</p>
          <p>Your smile has a way of making ordinary moments feel a little brighter. I hope today brings you that same kind of joy, in a hundred little ways, and reminds you just how much your happiness matters.</p>
          <p>May the year ahead bring you closer to all the dreams you keep tucked in your heart. I’m so grateful you’re here, and I hope life gives you every reason to keep looking at it with that lovely smile.</p>
          <p>Always keep smiling, Qalbi. <span>❤️</span></p>
        </div>
        <div className="letter-audio">
          <button className="letter-audio__button" type="button" onClick={toggleLetterSpeech} aria-label={speaking ? 'Stop the birthday message' : 'Listen to the birthday message'}>
            {speaking ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            <span>{speaking ? 'Stop listening' : 'Listen to my message'}</span>
          </button>
          <span className="letter-audio__status" aria-live="polite">
            {voiceError ? 'The voice message could not be played' : speaking ? 'A little message, just for you' : voiceFinished ? 'Thank you for listening, Qalbi' : 'Tap to hear a little birthday note'}
          </span>
          <audio
            ref={voiceRef}
            src="/music/voice.mp3"
            preload="metadata"
            onPlay={() => { setSpeaking(true); setVoiceFinished(false); setSecretOpen(false); }}
            onPause={() => setSpeaking(false)}
            onEnded={() => { setSpeaking(false); setVoiceFinished(true); }}
            onError={() => { setSpeaking(false); setVoiceError(true); }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="secret-note" key={secretOpen ? 'open' : 'closed'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {secretOpen ? (
              <motion.div className="secret-note__reveal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <span className="eyebrow">Just between us</span>
                <p>Qalbi, I hope you never forget how much happiness you bring to the little, everyday parts of my life. I’ll always be cheering for your dreams, celebrating your smile, and wishing you a year as lovely as you are.</p>
                <span className="secret-note__signoff">With all my heart, always. <Heart size={13} fill="currentColor" /></span>
              </motion.div>
            ) : (
              <button className="secret-note__button" type="button" onClick={() => setSecretOpen(true)}>
                <Heart size={15} />
                <span>One last thing...<small>A little note, just for you</small></span>
                <ArrowRight size={15} />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="letter-signature"><span>With love, always</span><span className="signature-heart">♥</span></div>
        <span className="letter-seal" aria-hidden="true">Q</span>
      </motion.article>
    </section>
  );
}

function PhotoCard({ photo, index, onSelect }) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.button
      className={`photo-card photo-card--${index + 1}`}
      onClick={() => !failed && onSelect(photo)}
      aria-label={failed ? `Photo ${photo.number}: add your picture at public/images/photo-${index + 1}.jpg` : `View photo ${photo.number}: ${photo.label}`}
      whileHover={{ y: -7, rotate: 0 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className={`photo-card__image ${failed ? 'photo-card__image--empty' : ''}`}>
        <img src={photo.src} alt={photo.label} loading="lazy" onError={() => setFailed(true)} />
        {failed && <span className="photo-placeholder"><Heart size={27} strokeWidth={1.2} /><span>A place for<br />your moment</span></span>}
        {!failed && <span className="photo-heart-overlay" aria-hidden="true">♥</span>}
      </span>
      <span className="photo-card__caption"><span>{photo.label}</span><span className="photo-card__number">{photo.number}</span></span>
    </motion.button>
  );
}

function MemoryGallery({ onSelect }) {
  return (
    <section className="chapter chapter--gallery" id="memories">
      <div className="gallery-content">
        <SectionHeading eyebrow="Chapter three · little keepsakes">A few moments worth<br />keeping forever <span>✧</span></SectionHeading>
        <p className="gallery-intro">Every memory becomes a little more beautiful when it has you in it.</p>
        <div className="photo-grid">
          {galleryPhotos.map((photo, index) => <PhotoCard photo={photo} index={index} key={photo.number} onSelect={onSelect} />)}
        </div>
      </div>
    </section>
  );
}

function GiftSurprise({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onOpen();
  };
  return (
    <section className="chapter chapter--gift" id="gift">
      <Sparkles count={17} />
      <div className="gift-content">
        <SectionHeading eyebrow="Chapter four · just one more thing" light>Because you<br />deserve more.</SectionHeading>
        <p className="gift-prompt">I have one more surprise for you...</p>
        <div className={`gift-illustration ${opened ? 'gift-illustration--open' : ''}`} aria-label={opened ? 'Opened birthday gift box' : 'Closed birthday gift box'}>
          <span className="gift-rays" aria-hidden="true" />
          <span className="gift-spark gift-spark--one">✦</span><span className="gift-spark gift-spark--two">✧</span>
          <span className="gift-box-lid"><i className="gift-ribbon" /></span>
          <span className="gift-box-body"><i className="gift-ribbon" /><span className="gift-box-heart">♥</span></span>
          <span className="gift-bow" aria-hidden="true"><i /><b /></span>
          <span className="gift-box-glow" aria-hidden="true">♥</span>
        </div>
        <Confetti active={opened} count={72} />
        <AnimatePresence mode="wait">
          {opened ? (
            <motion.div className="gift-reveal" initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
              <p>Happy Birthday, My Qalbi! <span>❤️🎂</span></p>
              <h3>Eva Bukht Qalbuu</h3>
              <button className="button button--light" onClick={() => scrollTo('final-cake')}>One last wish <ArrowRight size={16} /></button>
            </motion.div>
          ) : (
            <motion.button className="button button--light" onClick={handleOpen} whileTap={{ scale: 0.96 }}>Open gift <Heart size={15} fill="currentColor" /></motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FinalCake({ blown, onBlow }) {
  const [candlesOff, setCandlesOff] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const blow = () => {
    if (blown) return;
    onBlow();
    setCelebrating(true);
    [1, 2, 3, 4, 5].forEach((step) => window.setTimeout(() => setCandlesOff(step), step * 220));
  };
  return (
    <section className={`chapter chapter--final-cake ${blown ? 'chapter--final-cake-blown' : ''}`} id="final-cake">
      <Sparkles count={25} />
      <div className="chapter-content final-cake-content">
        <SectionHeading eyebrow="A final little celebration">One more candle.<br />One more wish.</SectionHeading>
          <Cake large candlesOff={candlesOff} />
        <Confetti active={celebrating} count={55} />
        <AnimatePresence mode="wait">
          {blown ? (
            <motion.p className="final-wish" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>Your wish is on its way... <span>❤️</span></motion.p>
          ) : (
            <motion.button className="button button--rose" onClick={blow} whileTap={{ scale: 0.96 }}>
              Blow the candles <span>🕯️✨</span>
            </motion.button>
          )}
        </AnimatePresence>
        <span className="final-candle-count" aria-live="polite">{blown && candlesOff < 5 ? `A little wish, ${candlesOff} of 5...` : ''}</span>
      </div>
    </section>
  );
}

function FinalScreen({ onReplay }) {
  return (
    <footer className="chapter chapter--final" id="final">
      <Sparkles count={26} />
      <div className="final-content">
        <span className="eyebrow">Once again...</span>
        <h2>Happy Birthday,<br /><span>Qalbi</span> <span className="final-title-heart">♥</span></h2>
        <p className="final-name">Happy Birthday Eva Bukht Qalbuu <span>🎂❤️</span></p>
        <p className="final-message">May every wish you make today come true. May your smile stay bright, your heart stay happy, and the coming year bring you countless beautiful memories.</p>
        <div className="final-big-heart" aria-hidden="true"><Heart fill="currentColor" strokeWidth={0} /><span>♥</span><i>♥</i><b>✧</b></div>
        <p className="final-promise">You are special. Never forget that. <span>❤️</span></p>
        <button className="button button--light" onClick={onReplay}><RotateCcw size={15} /> Replay surprise</button>
        <span className="final-footer">Made with <Heart size={12} fill="currentColor" /> especially for Qalbi</span>
      </div>
    </footer>
  );
}

function MusicController({ enabled, onToggle }) {
  return (
    <button className={`music-controller ${enabled ? 'music-controller--on' : ''}`} onClick={onToggle} aria-label={enabled ? 'Turn music off' : 'Turn music on'} title={enabled ? 'Music on' : 'Music off'}>
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span>{enabled ? 'Music on' : 'Music off'}</span>
      <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}

function PhotoLightbox({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('has-lightbox');
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('has-lightbox');
    };
  }, [photo, onClose]);
  return (
    <AnimatePresence>
      {photo && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button className="lightbox-close" onClick={onClose} aria-label="Close photo"><X size={20} /></button>
          <motion.div className="lightbox-frame" initial={{ scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} onClick={(event) => event.stopPropagation()}>
            <img src={photo.src} alt={photo.label} />
            <p>
              <strong>{photo.label}</strong>
              <span className="lightbox-caption">{photo.caption}</span>
              <span className="lightbox-heart">♥</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [opened, setOpened] = useState(false);
  const [wished, setWished] = useState(false);
  const [finalBlown, setFinalBlown] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (loaded) return undefined;
    const timer = window.setTimeout(() => setLoaded(true), 2000);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicEnabled) {
      audioRef.current.pause();
      setMusicEnabled(false);
      return;
    }
    try {
      await audioRef.current.play();
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  const startExperience = () => {
    setOpened(true);
    window.setTimeout(() => scrollTo('birthday'), 120);
  };

  const replay = () => {
    setSelectedPhoto(null);
    setWished(false);
    setFinalBlown(false);
    setOpened(false);
    setLoaded(false);
    if (audioRef.current) audioRef.current.pause();
    setMusicEnabled(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaded ? <LoadingScreen key="loading" /> : !opened ? <WelcomeScreen key="welcome" onOpen={startExperience} /> : (
          <motion.main className="story" key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
            <div className="story-topline"><span>Q</span><span>A LITTLE STORY FOR YOU</span><span>♥</span></div>
            <JourneyProgress />
            <BirthdayCake onWish={() => setWished(true)} wished={wished} />
            <FillMyHeart onContinue={() => scrollTo('message')} />
            <BirthdayMessage />
            <LoveLetter />
            <MemoryGallery onSelect={setSelectedPhoto} />
            <GiftSurprise onOpen={() => {}} />
            <FinalCake blown={finalBlown} onBlow={() => setFinalBlown(true)} />
            <FinalScreen onReplay={replay} />
          </motion.main>
        )}
      </AnimatePresence>
      {loaded && <MusicController enabled={musicEnabled} onToggle={toggleMusic} />}
      <audio ref={audioRef} src="/music/birthday.mp3" loop preload="none" />
      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}