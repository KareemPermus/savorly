import { Recipe } from '@/types';
import Link from 'next/link';
import { FiClock } from 'react-icons/fi';
import styles from '@/styles/Home.module.css';

const fallbackImages = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80',
];

interface Props {
  recipes: Recipe[];
}

export default function FeaturedRecipes({ recipes }: Props) {
  if (recipes.length === 0) {
    return <p className={styles.emptyText}>No recipes yet. Add your first one!</p>;
  }

  return (
    <div className={styles.recipeGrid}>
      {recipes.map((r, i) => (
        <Link key={r.id} href={`/recipes/${r.id}`} className={styles.recipeCard}>
          <div
            className={styles.recipeImg}
            style={{ backgroundImage: `url(${r.image_url || fallbackImages[i % fallbackImages.length]})` }}
          />
          <div className={styles.recipeBody}>
            {r.category && <p className={styles.recipeCat}>{r.category}</p>}
            <h4 className={styles.recipeTitle}>{r.title}</h4>
            <div className={styles.recipeMeta}>
              {(r.cook_time || r.prep_time) && (
                <span><FiClock size={13} /> {r.cook_time || r.prep_time} min</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}