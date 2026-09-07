import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe, MealPlan } from '@/types';
import HeroSection from '@/components/HeroSection';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import QuickActions from '@/components/QuickActions';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [recRes, mpRes] = await Promise.all([
          apiClient.get('/api/recipes'),
          apiClient.get('/api/meal-plans'),
        ]);
        setRecipes(recRes.data);
        setMealPlans(mpRes.data);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading your kitchen…</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorWrap}><p>{error}</p></div>;
  }

  const categories = ['All', 'Breakfast', 'Mains', 'Salads', 'Soups', 'Desserts'];
  const featured = recipes.slice(0, 3);
  const hero = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className={styles.page}>
      <HeroSection recipe={hero} />

      {/* Category pills */}
      <section className={styles.categories}>
        {categories.map((c) => (
          <Link
            key={c}
            href="/recipes"
            className={`${styles.pill} ${c === 'All' ? styles.pillActive : styles.pillDefault}`}
          >
            {c}
          </Link>
        ))}
      </section>

      {/* Trending */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending this week</h2>
          <Link href="/recipes" className={styles.seeAll}>See all →</Link>
        </div>
        <FeaturedRecipes recipes={featured} />
      </section>

      {/* Meal plan + quick actions */}
      <section className={styles.bottomGrid}>
        <div className={styles.mealPlanCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.cardTitle}>This week's meal plan</h3>
            <Link href="/meal-planner" className={styles.seeAll}>Edit</Link>
          </div>
          {mealPlans.length === 0 ? (
            <p className={styles.emptyText}>No meals planned yet.</p>
          ) : (
            <div className={styles.mealList}>
              {mealPlans.slice(0, 4).map((mp) => (
                <div key={mp.id} className={styles.mealRow}>
                  <span className={styles.mealType}>{mp.meal_type}</span>
                  <span className={styles.mealTitle}>{mp.recipe_title || `Recipe #${mp.recipe_id}`}</span>
                  <span className={styles.mealDate}>{mp.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <QuickActions totalRecipes={recipes.length} totalPlans={mealPlans.length} />
      </section>

      <footer className={styles.footer}>
        Savorly · Cook something wonderful today
      </footer>
    </div>
  );
}