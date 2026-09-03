import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import HeroSection from '@/components/HeroSection';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import QuickActions from '@/components/QuickActions';
import styles from '@/styles/home.module.css';

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading recipes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  const featured = recipes.slice(0, 4);
  const quick = recipes.filter(r => (r.prep_time || 0) + (r.cook_time || 0) <= 30).slice(0, 3);
  const hero = recipes[0] || null;

  return (
    <div className={styles.page}>
      <HeroSection recipe={hero} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Recipes</h2>
          <Link href="/recipes" className={styles.seeAll}>See all →</Link>
        </div>
        <FeaturedRecipes recipes={featured} />
      </section>

      {quick.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>30 minutes or less</h2>
          <QuickActions recipes={quick} />
        </section>
      )}

      <footer className={styles.footer}>
        Made with ❤️ by the Savorly kitchen team
      </footer>
    </div>
  );
}