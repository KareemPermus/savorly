import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiClock, FiArrowRight, FiHeart } from 'react-icons/fi';
import apiClient from '@/api/client';
import type { Recipe } from '@/types';
import styles from '@/components/HomePage.module.css';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(() => setError('Failed to load recipes'))
      .finally(() => setLoading(false));
  }, []);

  const featured = recipes[0];
  const trending = recipes.slice(0, 4);
  const quick = recipes.filter(r => (r.prep_time || 0) + (r.cook_time || 0) <= 30).slice(0, 3);

  const formatTime = (r: Recipe) => {
    const total = (r.prep_time || 0) + (r.cook_time || 0);
    return total > 0 ? `${total}m` : '—';
  };

  if (loading) return <div className={styles.loading}>Loading recipes…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!recipes.length) return <div className={styles.empty}>No recipes yet. <Link href="/recipes">Add one!</Link></div>;

  return (
    <div className={styles.page}>
      {/* Hero */}
      {featured && (
        <section className={styles.hero}>
          <div className={styles.heroImg} style={{ backgroundImage: featured.image_url ? `url(${featured.image_url})` : undefined }} />
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>Recipe of the day</span>
            <h1 className={styles.heroTitle}>{featured.title}</h1>
            {featured.description && <p className={styles.heroDesc}>{featured.description}</p>}
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}><FiClock size={14} /> {formatTime(featured)}</span>
              {featured.servings && <span className={styles.metaItem}>Serves {featured.servings}</span>}
            </div>
            <Link href={`/recipes/${featured.id}`} className={styles.heroBtn}>
              View recipe <FiArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending this week</h2>
            <Link href="/recipes" className={styles.seeAll}>See all</Link>
          </div>
          <div className={styles.trendingGrid}>
            {trending.map(r => (
              <Link key={r.id} href={`/recipes/${r.id}`} className={styles.card}>
                <div className={styles.cardImg} style={{ backgroundImage: r.image_url ? `url(${r.image_url})` : undefined }}>
                  <button className={styles.favBtn} onClick={e => e.preventDefault()}><FiHeart size={14} /></button>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <div className={styles.cardMeta}>
                    <span><FiClock size={12} /> {formatTime(r)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick picks */}
      {quick.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>30 minutes or less</h2>
          <div className={styles.quickGrid}>
            {quick.map(r => (
              <Link key={r.id} href={`/recipes/${r.id}`} className={styles.quickCard}>
                <div className={styles.quickImg} style={{ backgroundImage: r.image_url ? `url(${r.image_url})` : undefined }} />
                <div>
                  <h3 className={styles.quickTitle}>{r.title}</h3>
                  {r.description && <p className={styles.quickDesc}>{r.description}</p>}
                  <span className={styles.quickTime}><FiClock size={12} /> {formatTime(r)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}