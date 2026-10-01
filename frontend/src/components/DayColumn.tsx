import React from 'react';
import { format, isToday } from 'date-fns';
import { MealPlan } from '../types';
import MealSlot from './MealSlot';
import styles from './DayColumn.module.css';

interface Props {
  date: Date;
  dateStr: string;
  mealTypes: string[];
  plans: MealPlan[];
  onAddMeal: (date: string, mealType: string) => void;
  onDeleteMeal: (id: number) => void;
}

export default function DayColumn({ date, dateStr, mealTypes, plans, onAddMeal, onDeleteMeal }: Props) {
  const today = isToday(date);
  return (
    <div className={`${styles.column} ${today ? styles.today : ''}`}>
      <div className={styles.dayHeader}>
        <span className={styles.dayName}>{format(date, 'EEE')}</span>
        <span className={`${styles.dayNum} ${today ? styles.dayNumToday : ''}`}>{format(date, 'd')}</span>
      </div>
      <div className={styles.slots}>
        {mealTypes.map(mt => {
          const plan = plans.find(p => p.meal_type === mt);
          return (
            <MealSlot
              key={mt}
              mealType={mt}
              plan={plan}
              onAdd={() => onAddMeal(dateStr, mt)}
              onDelete={plan ? () => onDeleteMeal(plan.id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}