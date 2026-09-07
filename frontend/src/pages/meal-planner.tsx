import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';
import { Recipe, MealPlan } from '@/types';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '@/components/meal-planner/MealPlanner.module.css';

interface MealPlanWithTitle {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  created_at: string;
  recipe_title: string;
}

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

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlanner() {
  const [plans, setPlans] = useState<MealPlanWithTitle[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalMealType, setModalMealType] = useState('Dinner');
  const [modalRecipeId, setModalRecipeId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const weekDates = getWeekDates(weekOffset);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, recipesRes] = await Promise.all([
        apiClient.get('/api/meal-plans'),
        apiClient.get('/api/recipes'),
      ]);
      setPlans(plansRes.data);
      setRecipes(recipesRes.data);
    } catch {
      setError('Failed to load meal plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!modalRecipeId || !modalDate) return;
    setSaving(true);
    try {
      await apiClient.post('/api/meal-plans', {
        recipe_id: Number(modalRecipeId),
        date: modalDate,
        meal_type: modalMealType,
      });
      setShowModal(false);
      fetchData();
    } catch {
      setError('Failed to add meal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/api/meal-plans/${id}`);
      setPlans((p) => p.filter((m) => m.id !== id));
    } catch {
      setError('Failed to remove meal.');
    }
  };

  const openModal = (date: string, mealType: string) => {
    setModalDate(date);
    setModalMealType(mealType);
    setModalRecipeId(recipes[0]?.id ?? '');
    setShowModal(true);
  };

  const weekLabel = `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading meal planner…</p>
      </div>
    );
  }

  if (error && plans.length === 0) {
    return (
      <div className={styles.errorWrap}>
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Meal Planner</h1>
          <p className={styles.subtitle}>Plan your week, cook with confidence</p>
        </div>
      </div>

      {/* Week nav */}
      <div className={styles.weekNav}>
        <button onClick={() => setWeekOffset((o) => o - 1)} className={styles.navBtn}>
          <FiChevronLeft />
        </button>
        <span className={styles.weekLabel}>
          <FiCalendar className={styles.calIcon} /> {weekLabel}
        </span>
        <button onClick={() => setWeekOffset((o) => o + 1)} className={styles.navBtn}>
          <FiChevronRight />
        </button>
        <button onClick={() => setWeekOffset(0)} className={styles.todayBtn}>Today</button>
      </div>

      {error && <p className={styles.inlineError}>{error}</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {/* Header row */}
        <div className={styles.cornerCell} />
        {weekDates.map((d, i) => {
          const isToday = formatDate(d) === formatDate(new Date());
          return (
            <div key={i} className={`${styles.dayHeader} ${isToday ? styles.todayHeader : ''}`}>
              <span className={styles.dayName}>{DAY_NAMES[i]}</span>
              <span className={styles.dayNum}>{d.getDate()}</span>
            </div>
          );
        })}

        {/* Meal type rows */}
        {MEAL_TYPES.map((mt) => (
          <>
            <div key={mt} className={styles.mealLabel}>{mt}</div>
            {weekDates.map((d, i) => {
              const dateStr = formatDate(d);
              const cellPlans = plans.filter(
                (p) => p.date === dateStr && p.meal_type.toLowerCase() === mt.toLowerCase()
              );
              return (
                <div key={`${mt}-${i}`} className={styles.cell}>
                  {cellPlans.map((p) => (
                    <div key={p.id} className={styles.mealCard}>
                      <span className={styles.mealTitle}>{p.recipe_title || `Recipe #${p.recipe_id}`}</span>
                      <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn} title="Remove">
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => openModal(dateStr, mt)} className={styles.addCellBtn} title="Add meal">
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
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add to Meal Plan</h3>
            <p className={styles.modalSub}>
              {new Date(modalDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {modalMealType}
            </p>
            <label className={styles.label}>Recipe</label>
            <select
              value={modalRecipeId}
              onChange={(e) => setModalRecipeId(Number(e.target.value))}
              className={styles.select}
            >
              <option value="">Select a recipe</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
            <label className={styles.label}>Meal Type</label>
            <select value={modalMealType} onChange={(e) => setModalMealType(e.target.value)} className={styles.select}>
              {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleAdd} disabled={saving || !modalRecipeId} className={styles.saveBtn}>
                {saving ? 'Saving…' : 'Add Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}