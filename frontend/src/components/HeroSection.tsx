import { Recipe } from '@/types';
import Link from 'next/link';
import { FiClock, FiUsers } from 'react-icons/fi';
import styles from '@/styles/Home.module.css';

interface Props {
  recipe: Recipe | null;
}

export default function HeroSection({ recipe }: Props) {
  const bgImage = recipe?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80';
  const title = recipe?.title || 'Discover Amazing Recipes';
  const time = recipe?.cook_time || recipe?.prep_time;

  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>Recipe of the day</span>
        <h2 className={styles.heroTitle}>{title}</h2>
        <div className={styles.heroMeta}>
          {time && (
            <span className={styles.heroMetaItem}>
              <FiClock size={14} /> {time} min
            </span>
          )}
          {recipe?.servings && (
            <span className={styles.heroMetaItem}>
              <FiUsers size={14} /> {recipe.servings} servings
            </span>
          )}
        </div>
        {recipe && (
          <Link href={`/recipes/${recipe.id}`} className={styles.heroBtn}>
            View Recipe
          </Link>
        )}
      </div>
    </section>
  );
}