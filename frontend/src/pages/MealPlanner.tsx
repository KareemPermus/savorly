import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { MealPlan, Recipe } from '../types';
import { getMealPlans, deleteMealPlan, getRecipes, createMealPlan } from '../api/client';
import WeekView from '../components/WeekView';
import AddMealModal from '../components/AddMealModal';
import styles from './MealPlanner.module.css';

export default function MealPlanner() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalMealType, setModalMealType] = useState('breakfast');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [mp, r] = await Promise.all([getMealPlans(), getRecipes()]);
      setMealPlans(mp);
      setRecipes(r);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleAddMeal = (date: string, mealType: string) => {
    setModalDate(date);
    setModalMealType(mealType);
    setModalOpen(true);
  };

  const handleSubmitMeal = async (recipeId: number) => {
    try {
      await createMealPlan({ recipe_id: recipeId, date: modalDate, meal_type: modalMealType });
      setModalOpen(false);
      fetchData();
    } catch {
      setError('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (id: number) => {
    try {
      await deleteMealPlan(id);
      fetchData();
    } catch {
      setError('Failed to remove meal');
    }
  };

  const prevWeek = () => setWeekStart(prev => addDays(prev, -7));
  const nextWeek = () => setWeekStart(prev => addDays(prev, 7));
  const today = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Meal Planner</h1>
          <p className={styles.subtitle}>Plan your week, one meal at a time</p>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={prevWeek}>← Prev</button>
          <button className={styles.todayBtn} onClick={today}>Today</button>
          <button className={styles.navBtn} onClick={nextWeek}>Next →</button>
        </div>
      </div>

      <div className={styles.weekLabel}>
        {format(weekDates[0], 'MMM d')} — {format(weekDates[6], 'MMM d, yyyy')}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading meal plans…</div>
      ) : (
        <WeekView
          weekDates={weekDates}
          mealPlans={mealPlans}
          onAddMeal={handleAddMeal}
          onDeleteMeal={handleDeleteMeal}
        />
      )}

      {modalOpen && (
        <AddMealModal
          recipes={recipes}
          mealType={modalMealType}
          date={modalDate}
          onSubmit={handleSubmitMeal}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}