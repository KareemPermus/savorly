import Link from 'next/link';
import { Recipe } from '@/types';
import { FiClock } from 'react-icons/fi';
import styles from '@/styles/quick.module.css';

interface Props {
  recipes: Recipe[];
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
];

export default function QuickActions({ recipes }: Props) {
  return (
    <div className={styles.grid}>
      {recipes.map((r, i) => {
        const totalTime = (r.prep_time || 0) + (r.cook_time || 0);
        return (
          <Link href={`/recipes/${r.id}`} key={r.id} className={styles.card}>
            <div className={styles.thumb} style={{ backgroundImage: `url('${r.image_url || placeholderImages[i % placeholderImages.length]}')` }} />
            <div className={styles.info}>
              <h3 className={styles.title}>{r.title}</h3>
              {r.description && <p className={styles.desc}>{r.description}</p>}
              {totalTime > 0 && <span className={styles.time}><FiClock size={14} /> {totalTime}m</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}