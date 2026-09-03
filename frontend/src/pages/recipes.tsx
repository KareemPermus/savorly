import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiClock, FiSliders, FiX } from 'react-icons/fi';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import styles from '@/styles/recipes.module.css';

const CATEGORIES = ['All', 'Breakfast', 'Vegetarian', 'Pasta', 'Desserts', 'Quick & Easy', 'Comfort Food'];

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
  'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
];

function formatTime(mins?: number | null): string {
  if (!mins) return '';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/recipes');
      setRecipes(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const filtered = recipes.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const hero = filtered[0];
  const trending = filtered.slice(0, 4);
  const quick = filtered.filter(r => (r.prep_time || 0) + (r.cook_time || 0) <= 30).slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search recipes…"
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.topbarActions}>
          <button className={styles.filterBtn} onClick={() => setFilterOpen(true)}>
            <FiSliders size={16} /> Filters
          </button>
          <Link href="/recipes/new" className={styles.newBtn}>
            <FiPlus size={16} /> New Recipe
          </Link>
        </div>
      </div>

      {loading && <div className={styles.center}>Loading recipes…</div>}
      {error && <div className={styles.center}>{error}</div>}

      {!loading && !error && (
        <div className={styles.content}>
          {/* Hero */}
          {hero && (
            <Link href={`/recipes/${hero.id}`} className={styles.hero}>
              <div
                className={styles.heroBg}
                style={{ backgroundImage: `url(${hero.image_url || PLACEHOLDER_IMAGES[0]})` }}
              />
              <div className={styles.heroContent}>
                <span className={styles.heroLabel}>Recipe of the day</span>
                <h1 className={styles.heroTitle}>{hero.title}</h1>
                {hero.description && <p className={styles.heroDesc}>{hero.description}</p>}
                <div className={styles.heroMeta}>
                  {(hero.prep_time || hero.cook_time) && (
                    <span className={styles.metaItem}><FiClock size={14} /> {formatTime((hero.prep_time || 0) + (hero.cook_time || 0))}</span>
                  )}
                  {hero.servings && <span className={styles.metaItem}>{hero.servings} servings</span>}
                </div>
              </div>
            </Link>
          )}

          {/* Categories */}
          <div className={styles.categories}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.catBtn} ${activeCategory === c ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Trending */}
          {trending.length > 0 && (
            <section>
              <h2 className={styles.sectionTitle}>Trending this week</h2>
              <div className={styles.trendingGrid}>
                {trending.map((r, i) => (
                  <Link key={r.id} href={`/recipes/${r.id}`} className={styles.card}>
                    <div
                      className={styles.cardImg}
                      style={{ backgroundImage: `url(${r.image_url || PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]})` }}
                    />
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{r.title}</h3>
                      <div className={styles.cardMeta}>
                        {(r.prep_time || r.cook_time) && (
                          <span className={styles.metaItem}><FiClock size={13} /> {formatTime((r.prep_time || 0) + (r.cook_time || 0))}</span>
                        )}
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
                {quick.map((r, i) => (
                  <Link key={r.id} href={`/recipes/${r.id}`} className={styles.quickCard}>
                    <div
                      className={styles.quickImg}
                      style={{ backgroundImage: `url(${r.image_url || PLACEHOLDER_IMAGES[(i + 3) % PLACEHOLDER_IMAGES.length]})` }}
                    />
                    <div>
                      <h3 className={styles.quickTitle}>{r.title}</h3>
                      {r.description && <p className={styles.quickDesc}>{r.description}</p>}
                      <span className={styles.metaItem}><FiClock size={13} /> {formatTime((r.prep_time || 0) + (r.cook_time || 0))}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && !loading && (
            <div className={styles.empty}>No recipes found. Try a different search or add a new recipe!</div>
          )}
        </div>
      )}

      {/* Filter Drawer */}
      {filterOpen && <div className={styles.overlay} onClick={() => setFilterOpen(false)} />}
      <div className={`${styles.filterPanel} ${filterOpen ? styles.filterOpen : ''}`}>
        <div className={styles.filterHeader}>
          <h3 className={styles.filterTitle}>Filters</h3>
          <button className={styles.filterClose} onClick={() => setFilterOpen(false)}><FiX size={18} /></button>
        </div>
        <div className={styles.filterBody}>
          <div>
            <div className={styles.filterLabel}>Max time</div>
            <input type="range" min="10" max="120" defaultValue="45" className={styles.range} />
            <div className={styles.rangeHint}>Under 45 minutes</div>
          </div>
          <button className={styles.applyBtn} onClick={() => setFilterOpen(false)}>Apply filters</button>
        </div>
      </div>
    </div>
  );
}