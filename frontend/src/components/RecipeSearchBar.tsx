import { FiSearch } from 'react-icons/fi';
import styles from '@/styles/recipeSearchBar.module.css';

export default function RecipeSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.wrap}>
      <FiSearch className={styles.icon} size={16} />
      <input
        placeholder="Search recipes…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}