import { Recipe } from '@/types';
import { FiClock, FiUsers } from 'react-icons/fi';
import styles from '@/styles/RecipeHeader.module.css';

export default function RecipeHeader({ recipe }: { recipe: Recipe }) {
  return (
    <div className={styles.header}>
      {recipe.image_url && (
        <div className={styles.imageWrap}>
          <img src={recipe.image_url} alt={recipe.title} className={styles.image} />
        </div>
      )}
      <div className={styles.info}>
        {recipe.category && <span className={styles.category}>{recipe.category}</span>}
        <h1 className={styles.title}>{recipe.title}</h1>
        {recipe.description && <p className={styles.desc}>{recipe.description}</p>}
        <div className={styles.meta}>
          {recipe.prep_time != null && (
            <span className={styles.metaItem}><FiClock /> Prep: {recipe.prep_time} min</span>
          )}
          {recipe.cook_time != null && (
            <span className={styles.metaItem}><FiClock /> Cook: {recipe.cook_time} min</span>
          )}
          {recipe.servings != null && (
            <span className={styles.metaItem}><FiUsers /> {recipe.servings} servings</span>
          )}
        </div>
      </div>
    </div>
  );
}