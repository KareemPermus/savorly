import Link from 'next/link';
import { Recipe } from '@/types';
import { FiClock } from 'react-icons/fi';
import styles from '@/styles/featured.module.css';

interface Props {
  recipes: Recipe[];
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
  'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600',
];

export default function FeaturedRecipes({ recipes }: Props) {
  if (recipes.length === 0) {
    return <p className={styles.empty}>No recipes yet. Add your first one!</p>;
  }

  return (
    <div className={styles.grid}>
      {recipes.map((r, i) => {
        const totalTime = (r.prep_time || 0) + (r.cook_time || 0);
        return (
          <Link href={`/recipes/${r.id}`} key={r.id} className={styles.card}>
            <div className={styles.imgWrap} style={{ backgroundImage: `url('${r.image_url || placeholderImages[i % placeholderImages.length]}')` }} />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <div className={styles.cardMeta}>
                {totalTime > 0 && <span><FiClock size={14} /> {totalTime}m</span>}
                {r.servings && <span>{r.servings} servings</span>}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}