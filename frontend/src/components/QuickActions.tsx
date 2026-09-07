import Link from 'next/link';
import { FiBookOpen, FiCalendar, FiPlus } from 'react-icons/fi';
import styles from '@/styles/Home.module.css';

interface Props {
  totalRecipes: number;
  totalPlans: number;
}

export default function QuickActions({ totalRecipes, totalPlans }: Props) {
  return (
    <div className={styles.quickCard}>
      <div className={styles.quickTop}>
        <FiBookOpen size={28} />
        <h3 className={styles.quickTitle}>Your Kitchen</h3>
        <p className={styles.quickSub}>{totalRecipes} recipes · {totalPlans} planned meals</p>
      </div>
      <div className={styles.quickBtns}>
        <Link href="/recipes" className={styles.quickBtnOutline}>
          <FiBookOpen size={14} /> Browse Recipes
        </Link>
        <Link href="/meal-planner" className={styles.quickBtnOutline}>
          <FiCalendar size={14} /> Meal Planner
        </Link>
      </div>
    </div>
  );
}