import styles from '@/styles/recipeFilterBar.module.css';

export default function RecipeFilterBar({ categories, active, onChange }: { categories: string[]; active: string; onChange: (c: string) => void }) {
  return (
    <div className={styles.bar}>
      {categories.map(c => (
        <button key={c} className={`${styles.pill} ${active === c ? styles.active : ''}`} onClick={() => onChange(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}