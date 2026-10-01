import React from 'react';
import { format } from 'date-fns';
import { MealPlan } from '../types';
import DayColumn from './DayColumn';
import styles from './WeekView.module.css';

interface Props {
  weekDates: Date[];
  mealPlans: MealPlan[];
  onAddMeal: (date: string, mealType: string) => void;
  onDeleteMeal: (id: number) => void;
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

export default function WeekView({ weekDates, mealPlans, onAddMeal, onDeleteMeal }: Props) {
  return (
    <div className={styles.grid}>
      {weekDates.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayPlans = mealPlans.filter(mp => mp.date === dateStr);
        return (
          <DayColumn
            key={dateStr}
            date={date}
            dateStr={dateStr}
            mealTypes={MEAL_TYPES}
            plans={dayPlans}
            onAddMeal={onAddMeal}
            onDeleteMeal={onDeleteMeal}
          />
        );
      })}
    </div>
  );
}