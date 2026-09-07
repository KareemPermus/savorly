import { FiPlus } from 'react-icons/fi';
import styles from '@/styles/addRecipeButton.module.css';

export default function AddRecipeButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      <FiPlus size={16} /> Add Recipe
    </button>
  );
}