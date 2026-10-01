import { FiHelpCircle } from 'react-icons/fi';
import styles from './SupportFab.module.css';

export default function SupportFab() {
  return (
    <button className={styles.fab} title="Help & Support">
      <FiHelpCircle />
    </button>
  );
}