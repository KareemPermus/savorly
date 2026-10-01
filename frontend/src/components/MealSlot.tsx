import React from 'react';
import { MealPlan } from '../types';
import { FiPlus, FiX } from 'react-icons/fi';
import styles from './MealSlot.module.css';

interface Props {
  mealType: string;
  plan?: MealPlan;
  onAdd: () => void;
  onDelete?: () => void;
}

export default function MealSlot({ mealType, plan, onAdd, onDelete }: Props) {
  const label = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  if (!plan) {
    return (
      <button className={styles.empty} onClick={onAdd} title={`Add ${label}`}>
        <FiPlus size={14} />
        <span>{label}</span>
      </button>
    );
  }

  const recipe = (plan as any).recipe;
  const title = recipe?.title || `Recipe #${plan.recipe_id}`;

  return (
    <div className={styles.filled}>
      <div className={styles.mealLabel}>{label}</div>
      <div className={styles.recipeName}>{title}</div>
      {onDelete && (
        <button className={styles.deleteBtn} onClick={onDelete} title="Remove">
          <FiX size={12} />
        </button>
      )}
    </div>
  );
}