import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe, MealPlan } from '@/types';
import { FiClock, FiStar, FiArrowRight, FiShoppingCart, FiPlus } from 'react-icons/fi';
import styles from '@/components/HomePage.module.css';

const HERO_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80';
const CATEGORIES = ['All', 'Breakfast', 'Soups', 'Mains', 'Salads', 'Desserts'];
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80',
];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<(MealPlan & { recipe_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/recipes').then(r => r.data),
      apiClient.get('/api/meal-plans').then(r => r.data),
    ])
      .then(([r, m]) => {
        setRecipes(Array.isArray(r) ? r : []);
        setMealPlans(Array.isArray(m) ? m : []);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const featured = recipes[0];
  const trending = recipes.slice(0, 3);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url('${featured?.image_url || HERO_IMG}')` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Recipe of the day</span>
          <h2 className={styles.heroTitle}>{featured?.title || 'Charred Harissa Bowl with Herbed Yogurt'}</h2>
          <p className={styles.heroMeta}>
            <span className={styles.metaItem}><FiClock /> {featured?.cook_time || 35} min</span>
            <span className={styles.metaItem}><FiStar /> 4.9</span>
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        {CATEGORIES.map((c, i) => (
          <Link
            key={c}
            href="/recipes"
            className={i === 0 ? styles.catActive : styles.catPill}
          >
            {c}
          </Link>
        ))}
      </section>

      {/* Trending */}
      <section>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Trending this week</h3>
          <Link href="/recipes" className={styles.seeAll}>See all <FiArrowRight /></Link>
        </div>
        <div className={styles.trendingGrid}>
          {(trending.length > 0 ? trending : [null, null, null]).map((r, i) => (
            <Link
              key={r?.id ?? i}
              href={r ? `/recipes/${r.id}` : '/recipes'}
              className={styles.card}
            >
              <div
                className={styles.cardImg}
                style={{ backgroundImage: `url('${r?.image_url || FALLBACK_IMAGES[i]}')` }}
              />
              <div className={styles.cardBody}>
                <p className={styles.cardCategory}>{r?.category || 'Recipe'}</p>
                <h4 className={styles.cardTitle}>{r?.title || 'Delicious Recipe'}</h4>
                <div className={styles.cardMeta}>
                  <span><FiClock size={14} /> {r?.cook_time || '—'} min</span>
                  <span><FiStar size={14} color="#f59e0b" /> 4.8</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two column: Meal plan + CTA */}
      <section className={styles.twoCol}>
        <div className={styles.mealPlanCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>This week's meal plan</h3>
            <Link href="/meal-planner" className={styles.seeAll}>Edit</Link>
          </div>
          <div className={styles.mealList}>
            {(mealPlans.length > 0 ? mealPlans.slice(0, 5) : []).map((mp, i) => (
              <div key={mp.id} className={styles.mealRow}>
                <span className={styles.mealDay}>{days[i] || '—'}</span>
                <span className={styles.mealName}>{mp.recipe_title || `Recipe #${mp.recipe_id}`}</span>
                <span className={styles.mealTime}>{mp.meal_type}</span>
              </div>
            ))}
            {mealPlans.length === 0 && <p className={styles.empty}>No meal plans yet.</p>}
          </div>
        </div>
        <div className={styles.ctaCard}>
          <FiShoppingCart size={32} />
          <h3 className={styles.ctaTitle}>Plan your meals</h3>
          <p className={styles.ctaDesc}>Add recipes to your weekly meal plan and stay organized.</p>
          <Link href="/meal-planner" className={styles.ctaBtn}>
            Go to Planner <FiArrowRight />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        Savorly · Cook something wonderful today
      </footer>
    </div>
  );
}