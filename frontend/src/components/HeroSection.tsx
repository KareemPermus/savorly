import Link from 'next/link';
import { Recipe } from '@/types';
import { FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';
import styles from '@/styles/hero.module.css';

interface Props {
  recipe: Recipe | null;
}

export default function HeroSection({ recipe }: Props) {
  if (!recipe) {
    return (
      <section className={styles.hero} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')` }}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <span className={styles.badge}>Welcome</span>
          <h1 className={styles.title}>Discover Delicious Recipes</h1>
          <p className={styles.desc}>Start exploring and plan your meals with Savorly.</p>
          <Link href="/recipes" className={styles.cta}>
            Browse recipes <FiArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <section className={styles.hero} style={{ backgroundImage: recipe.image_url ? `url('${recipe.image_url}')` : `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')` }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.badge}>Recipe of the day</span>
        <h1 className={styles.title}>{recipe.title}</h1>
        {recipe.description && <p className={styles.desc}>{recipe.description}</p>}
        <div className={styles.meta}>
          {totalTime > 0 && <span className={styles.metaItem}><FiClock /> {totalTime}m</span>}
          {recipe.servings && <span className={styles.metaItem}><FiUsers /> {recipe.servings} servings</span>}
        </div>
        <Link href={`/recipes/${recipe.id}`} className={styles.cta}>
          View recipe <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}