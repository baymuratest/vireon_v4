import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';
import {
  getLatest, getOngoing, getTopAnime, getTopMovies, getTopSerials, getTopAll,
  getPoster, getTitle, getRating, getDescription, getGenres,
  deduplicate, CATEGORIES
} from '../utils/kodik';
import s from './Home.module.css';

function HeroBanner({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const item   = items[idx];
  const poster = getPoster(item);
  const title  = getTitle(item);
  const desc   = getDescription(item);
  const rating = getRating(item);
  const genres = getGenres(item).slice(0, 4);
  const id     = item?.id;
  const ext    = item?.shikimori_id || item?.kinopoisk_id || id;

  return (
    <div className={s.hero}>
      {poster && <div className={s.heroBg} style={{ backgroundImage: `url(${poster})` }} />}
      <div className={s.heroOverlay} />

      <div className={s.heroContent}>
        <div className={s.heroMeta}>
          {item?.year && <span className={s.heroChip}>{item.year}</span>}
          {rating && <span className={s.heroChip}>⭐ {Number(rating).toFixed(1)}</span>}
          {item?.material_data?.anime_status === 'ongoing' && (
            <span className={s.heroChipLive}>● Онгоинг</span>
          )}
        </div>

        <h1 className={s.heroTitle}>{title}</h1>
        {genres.length > 0 && (
          <div className={s.heroGenres}>
            {genres.map(g => <span key={g}>{g}</span>)}
          </div>
        )}
        {desc && <p className={s.heroDesc}>{desc.slice(0, 220)}{desc.length > 220 ? '…' : ''}</p>}

        <div className={s.heroActions}>
          <Link to={`/watch/${encodeURIComponent(id)}?ext=${ext}`} className={s.heroPlay}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
            Смотреть
          </Link>
          <Link to="/catalog" className={s.heroGhost}>
            Перейти в каталог →
          </Link>
        </div>
      </div>

      <div className={s.heroDots}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`${s.heroDot} ${i === idx ? s.heroDotActive : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryNav() {
  return (
    <div className={s.catNav}>
      {CATEGORIES.map(c => (
        <Link
          key={c.id}
          to={c.id === 'all' ? '/catalog' : `/catalog?cat=${c.id}`}
          className={s.catChip}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}

function Section({ title, items, loading, seeAllHref }) {
  return (
    <section className={s.section}>
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot" />
          {title}
        </h2>
        {seeAllHref && <Link to={seeAllHref} className="see-all">Смотреть все</Link>}
      </div>
      <MediaGrid items={items} loading={loading} skeletonCount={10} />
    </section>
  );
}

export default function Home() {
  const [heroItems,  setHeroItems]  = useState([]);
  const [latest,     setLatest]     = useState([]);
  const [topAll,     setTopAll]     = useState([]);
  const [ongoing,    setOngoing]    = useState([]);
  const [topAnime,   setTopAnime]   = useState([]);
  const [topMovies,  setTopMovies]  = useState([]);
  const [topSerials, setTopSerials] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [topAllR, latestR, ongoingR, topAnimeR, topMovR, topSerR] = await Promise.all([
          getTopAll(12),
          getLatest(20),
          getOngoing(20),
          getTopAnime(20),
          getTopMovies(20),
          getTopSerials(20),
        ]);
        const top = deduplicate(topAllR.results || []);
        setTopAll(top);
        setHeroItems(top.slice(0, 5));
        setLatest(deduplicate(latestR.results || []));
        setOngoing(deduplicate(ongoingR.results || []));
        setTopAnime(deduplicate(topAnimeR.results || []));
        setTopMovies(deduplicate(topMovR.results || []));
        setTopSerials(deduplicate(topSerR.results || []));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className={s.page}>
      {heroItems.length > 0
        ? <HeroBanner items={heroItems} />
        : <div className={s.heroSkeleton}><div className="skeleton" style={{ width: '100%', height: '100%' }}/></div>
      }

      <div className={s.content}>
        <CategoryNav />

        <Section
          title="Топ по рейтингу"
          items={topAll}
          loading={loading}
          seeAllHref="/catalog?sort=kinopoisk_rating"
        />
        <Section
          title="Топ аниме"
          items={topAnime}
          loading={loading}
          seeAllHref="/catalog?cat=anime&sort=shikimori_rating"
        />
        <Section
          title="Топ фильмы"
          items={topMovies}
          loading={loading}
          seeAllHref="/catalog?cat=movies&sort=imdb_rating"
        />
        <Section
          title="Топ сериалы"
          items={topSerials}
          loading={loading}
          seeAllHref="/catalog?cat=serials&sort=kinopoisk_rating"
        />
        {ongoing.length > 0 && (
          <Section
            title="Сейчас выходят"
            items={ongoing}
            loading={false}
            seeAllHref="/catalog?cat=anime&status=ongoing"
          />
        )}
        <Section
          title="Новые поступления"
          items={latest}
          loading={loading}
          seeAllHref="/catalog"
        />

        <div className={s.bigCta}>
          <div>
            <h3>Не нашёл что искал?</h3>
            <p>Тысячи фильмов, сериалов, аниме и мультфильмов в каталоге.</p>
          </div>
          <Link to="/catalog" className="btn-primary">Открыть каталог</Link>
        </div>

        {error && <div className="error-box"><p>{error}</p></div>}
      </div>
    </div>
  );
}
