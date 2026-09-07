import styles from '@/styles/IngredientList.module.css';

export default function IngredientList({ ingredients }: { ingredients: string[] }) {
  return (
    <div>
      <h3 className={styles.heading}>Ingredients</h3>
      {ingredients.length === 0 ? (
        <p className={styles.empty}>No ingredients listed.</p>
      ) : (
        <ul className={styles.list}>
          {ingredients.map((item, i) => (
            <li key={i} className={styles.item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}