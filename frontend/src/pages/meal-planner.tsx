import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';
import { Recipe, MealPlan } from '@/types';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '@/components/meal-planner/MealPlanner.module.css';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function getWeekDates(offset: number): Date[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDayNum(d: Date): string {
  return d.getDate().toString();
}

function formatMonthYear(dates: Date[]): string {
  const first = dates[0];
  const last = dates[6];
  if (first.getMonth() === last.getMonth()) {
    return first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return `${first.toLocaleDateString('en-US', { month: 'short' })} – ${last.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

interface MealPlanWithRecipe {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  recipe?: { id: number; title: string; image_url?: string };
}

export default function MealPlanner() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [mealPlans, setMealPlans] = useState<MealPlanWithRecipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const weekDates = getWeekDates(weekOffset);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [mpRes, rRes] = await Promise.all([
        apiClient.get('/api/meal-plans'),
        apiClient.get('/api/recipes'),
      ]);
      setMealPlans(mpRes.data);
      setRecipes(rRes.data);
    } catch {
      setError('Failed to load meal plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getMealsForDateType = (date: string, mealType: string) =>
    mealPlans.filter(mp => mp.date === date && mp.meal_type === mealType);

  const handleAdd = async () => {
    if (!selectedRecipeId || !selectedDate) return;
    setAdding(true);
    try {
      const res = await apiClient.post('/api/meal-plans', {
        recipe_id: selectedRecipeId,
        date: selectedDate,
        meal_type: selectedMealType,
      });
      // Enrich with recipe info
      const recipe = recipes.find(r => r.id === selectedRecipeId);
      const newPlan: MealPlanWithRecipe = {
        ...res.data,
        recipe: recipe ? { id: recipe.id, title: recipe.title, image_url: recipe.image_url } : undefined,
      };
      setMealPlans(prev => [...prev, newPlan]);
      setShowModal(false);
      setSelectedRecipeId(null);
    } catch {
      setError('Failed to add meal.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/api/meal-plans/${id}`);
      setMealPlans(prev => prev.filter(mp => mp.id !== id));
    } catch {
      setError('Failed to remove meal.');
    }
  };

  const openAddModal = (date: string, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setSelectedRecipeId(recipes[0]?.id ?? null);
    setShowModal(true);
  };

  const isToday = (d: Date) => formatDate(d) === formatDate(new Date());

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading meal planner…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Meal Planner</h1>
          <p className={styles.subtitle}>Plan your week with delicious recipes</p>
        </div>
        <button className={styles.addBtn} onClick={() => openAddModal(formatDate(new Date()), 'Lunch')}>
          <FiPlus size={16} /> Add Meal
        </button>
      </div>

      {/* Week nav */}
      <div className={styles.weekNav}>
        <button className={styles.navBtn} onClick={() => setWeekOffset(o => o - 1)}>
          <FiChevronLeft size={18} />
        </button>
        <span className={styles.monthLabel}>
          <FiCalendar size={16} /> {formatMonthYear(weekDates)}
        </span>
        <button className={styles.navBtn} onClick={() => setWeekOffset(o => o + 1)}>
          <FiChevronRight size={18} />
        </button>
        {weekOffset !== 0 && (
          <button className={styles.todayBtn} onClick={() => setWeekOffset(0)}>Today</button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {/* Header row */}
        <div className={styles.cornerCell} />
        {weekDates.map(d => (
          <div key={formatDate(d)} className={`${styles.dayHeader} ${isToday(d) ? styles.todayHeader : ''}`}>
            <span className={styles.dayName}>{formatDay(d)}</span>
            <span className={`${styles.dayNum} ${isToday(d) ? styles.todayNum : ''}`}>{formatDayNum(d)}</span>
          </div>
        ))}

        {/* Meal type rows */}
        {MEAL_TYPES.map(mt => (
          <>
            <div key={mt} className={styles.mealTypeLabel}>{mt}</div>
            {weekDates.map(d => {
              const dateStr = formatDate(d);
              const meals = getMealsForDateType(dateStr, mt);
              return (
                <div key={`${dateStr}-${mt}`} className={`${styles.cell} ${isToday(d) ? styles.todayCell : ''}`}>
                  {meals.map(mp => (
                    <div key={mp.id} className={styles.mealCard}>
                      {mp.recipe?.image_url && (
                        <img src={mp.recipe.image_url} alt="" className={styles.mealImg} />
                      )}
                      <span className={styles.mealTitle}>{mp.recipe?.title || 'Recipe'}</span>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(mp.id)} title="Remove">
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button className={styles.addCellBtn} onClick={() => openAddModal(dateStr, mt)}>
                    <FiPlus size={14} />
                  </button>
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Meal</h2>
            <label className={styles.label}>Date</label>
            <input type="date" className={styles.input} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />

            <label className={styles.label}>Meal Type</label>
            <div className={styles.chipRow}>
              {MEAL_TYPES.map(mt => (
                <button key={mt} className={`${styles.chip} ${selectedMealType === mt ? styles.chipActive : ''}`} onClick={() => setSelectedMealType(mt)}>
                  {mt}
                </button>
              ))}
            </div>

            <label className={styles.label}>Recipe</label>
            {recipes.length === 0 ? (
              <p className={styles.emptyText}>No recipes yet. Create one first!</p>
            ) : (
              <div className={styles.recipeList}>
                {recipes.map(r => (
                  <button key={r.id} className={`${styles.recipeOption} ${selectedRecipeId === r.id ? styles.recipeOptionActive : ''}`} onClick={() => setSelectedRecipeId(r.id)}>
                    {r.image_url && <img src={r.image_url} alt="" className={styles.recipeOptImg} />}
                    <div>
                      <div className={styles.recipeOptTitle}>{r.title}</div>
                      {(r.prep_time || r.cook_time) && (
                        <span className={styles.recipeOptTime}>
                          <FiClock size={12} /> {(r.prep_time || 0) + (r.cook_time || 0)}m
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleAdd} disabled={adding || !selectedRecipeId}>
                {adding ? 'Adding…' : 'Add to Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}