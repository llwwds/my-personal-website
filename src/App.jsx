import { useEffect, useState } from 'react';
import FluidGlass from './components/FluidGlass/FluidGlass.jsx';
import ReflectiveCard from './components/ReflectiveCard/ReflectiveCard.jsx';
import reflectionVideo from './assets/reflection-night.mp4';
import './styles/hero.css';
import './styles/cards.css';

// 卡片原型数据：暂时沿用 Reflective Card 官方示例自带内容，后续替换为真实经历与作品。
const CARDS = [
  {
    key: 'card-1',
    name: 'Alexander Doe',
    role: 'Senior Developer',
    badge: 'Verified',
    status: 'Active',
    idLabel: 'ID number',
    idValue: '8901 2345 6789',
  },
  {
    key: 'card-2',
    name: 'Alexander Doe',
    role: 'Senior Developer',
    badge: 'Verified',
    status: 'Active',
    idLabel: 'ID number',
    idValue: '8901 2345 6789',
  },
  {
    key: 'card-3',
    name: 'Alexander Doe',
    role: 'Senior Developer',
    badge: 'Verified',
    status: 'Active',
    idLabel: 'ID number',
    idValue: '8901 2345 6789',
  },
  {
    key: 'card-4',
    name: 'Alexander Doe',
    role: 'Senior Developer',
    badge: 'Verified',
    status: 'Active',
    idLabel: 'ID number',
    idValue: '8901 2345 6789',
  },
];

const CARD_RATIO = 500 / 320;
const CARD_GAP = 20;
const CARD_MAX_WIDTH = 320;

function useCardSize() {
  const [size, setSize] = useState(() => measure());

  useEffect(() => {
    const onResize = () => setSize(measure());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return size;
}

function measure() {
  if (typeof window === 'undefined') {
    return { width: CARD_MAX_WIDTH, height: CARD_MAX_WIDTH * CARD_RATIO, portrait: false };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const portrait = vh > vw;
  const pad = Math.min(64, Math.max(20, vw * 0.04));

  if (portrait) {
    // 9:16：横排 4 卡改为可横向滚动，卡片保持可读尺寸。
    const width = Math.round(Math.min(CARD_MAX_WIDTH, vw * 0.66));
    return { width, height: Math.round(width * CARD_RATIO), portrait };
  }

  // 16:9：4 卡同排一屏内完整可见，同时不超出屏幕高度。
  const available = vw - pad * 2 - CARD_GAP * 3;
  const byWidth = available / 4;
  // 预留标题区与上下留白，矮屏时进一步压缩，保证第二屏不溢出。
  const chrome = vh < 520 ? 88 : vh < 620 ? 104 : vh < 800 ? 132 : 168;
  const byHeight = Math.max(120, vh - chrome) / CARD_RATIO;
  const width = Math.round(Math.max(132, Math.min(CARD_MAX_WIDTH, byWidth, byHeight)));
  return { width, height: Math.round(width * CARD_RATIO), portrait };
}

export default function App() {
  const card = useCardSize();

  return (
    <main className="site">
      <section className="section section--hero" aria-label="Hero">
        <div className="hero">
          <div className="hero__stage">
            <FluidGlass
              text="llwwds"
              shape="torus"
              size={260}
              refraction={1}
              dispersion={0.35}
              interaction="follow"
              frost={0}
              color="#ffffff"
              tint={0}
              reflection={1}
              shadow={0.5}
              elevation={0.4}
              smoothness={0.5}
              wobble={0.5}
              spin={0.3}
              idle
              morphOnClick
              intro
            />
          </div>
          <div className="hero__footer">
            <span className="hero__hint">
              <span className="hero__spark" aria-hidden="true" />
              Scroll
            </span>
          </div>
        </div>
      </section>

      <section className="section section--work" aria-label="Experience and work">
        <header className="work__head">
          <p className="work__eyebrow">Experience &amp; Work</p>
          <h2 className="work__title">经历与作品</h2>
        </header>

        <div
          className={`work__row${card.portrait ? ' work__row--scroll' : ''}`}
          role="list"
        >
          {CARDS.map((item) => (
            <div className="work__cell" role="listitem" key={item.key}>
              <ReflectiveCard
                name={item.name}
                role={item.role}
                badge={item.badge}
                status={item.status}
                idLabel={item.idLabel}
                idValue={item.idValue}
                videoSrc={reflectionVideo}
                webcam={false}
                tint="#ffffff"
                metalness={1}
                roughness={0.3}
                blurStrength={6}
                shine={1}
                glare={0.5}
                grayscale={1}
                warp={0.6}
                warpScale={1}
                bevel={3}
                tiltStrength={12}
                radius={24}
                enableTilt
                intro
                width={card.width}
                height={card.height}
              />
            </div>
          ))}
        </div>

        {card.portrait ? (
          <p className="work__hint">← 横向滑动查看 4 张卡片 →</p>
        ) : (
          <p className="work__hint">Hover a card · 4 pieces</p>
        )}
      </section>
    </main>
  );
}
