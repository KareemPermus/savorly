import React, { useState } from 'react';
import { Recipe } from '../types';
import { FiX, FiSearch } from 'react-icons/fi';
import styles from './AddMealModal.module.css';

interface Props {
  recipes: Recipe[];
  mealType: string;
  date: string;
  onSubmit: (recipeId: number) => void;
  onClose: () => void;
}

export default function AddMealModal({ recipes, mealType, date, onSubmit, onClose }: Props) {
  const [search, setSearch] = useState('');
  const filtered = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  const label = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Add {label}</h2>
            <p className={styles.modalSub}>{date}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className={styles.searchWrap}>
          <FiSearch size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search recipes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.list}>
          {filtered.length === 0 && <p className={styles.empty}>No recipes found</p>}
          {filtered.map(r => (
            <button key={r.id} className={styles.recipeItem} onClick={() => onSubmit(r.id)}>
              {r.image_url && <img src={r.image_url} alt="" className={styles.thumb} />}
              <div className={styles.recipeInfo}>
                <span className={styles.recipeTitle}>{r.title}</span>
                {r.prep_time != null && <span className={styles.recipeMeta}>{r.prep_time} min</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}