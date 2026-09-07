import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import RecipeSearchBar from '@/components/RecipeSearchBar';
import RecipeFilterBar from '@/components/RecipeFilterBar';
import AddRecipeButton from '@/components/AddRecipeButton';
import styles from '@/styles/recipes.module.css';
import { FiClock, FiUsers, FiPlus, FiX } from 'react-icons/fi';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Salads', 'Soups', 'Mains'];

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '', prep_time: '', cook_time: '', servings: '', category: '', image_url: '' });

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await apiClient.get('/api/recipes', { params });
      setRecipes(data);
    } catch {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const filtered = recipes.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (r.category || '').toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const handleSave = async () => {
    if (!form.title || !form.ingredients || !form.steps) return;
    setSaving(true);
    try {
      await apiClient.post('/api/recipes', {
        ...form,
        prep_time: form.prep_time ? parseInt(form.prep_time) : null,
        cook_time: form.cook_time ? parseInt(form.cook_time) : null,
        servings: form.servings ? parseInt(form.servings) : null,
      });
      setShowModal(false);
      setForm({ title: '', description: '', ingredients: '', steps: '', prep_time: '', cook_time: '', servings: '', category: '', image_url: '' });
      fetchRecipes();
    } catch {
      setError('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Recipes</h1>
          <p className={styles.subtitle}>Browse and manage your collection</p>
        </div>
        <div className={styles.headerActions}>
          <RecipeSearchBar value={search} onChange={setSearch} />
          <AddRecipeButton onClick={() => setShowModal(true)} />
        </div>
      </div>

      {/* Category filters */}
      <RecipeFilterBar categories={CATEGORIES} active={category} onChange={setCategory} />

      {/* Content */}
      {loading ? (
        <div className={styles.center}><p className={styles.muted}>Loading recipes…</p></div>
      ) : error ? (
        <div className={styles.center}><p className={styles.errorText}>{error}</p></div>
      ) : filtered.length === 0 ? (
        <div className={styles.center}>
          <p className={styles.muted}>No recipes found</p>
          <button className={styles.addBtnSmall} onClick={() => setShowModal(true)}>
            <FiPlus /> Add your first recipe
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((r, i) => (
            <Link href={`/recipes/${r.id}`} key={r.id} className={styles.card}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${r.image_url || defaultImages[i % defaultImages.length]})` }} />
              <div className={styles.cardBody}>
                {r.category && <span className={styles.categoryBadge}>{r.category}</span>}
                <h4 className={styles.cardTitle}>{r.title}</h4>
                {r.description && <p className={styles.cardDesc}>{r.description}</p>}
                <div className={styles.cardMeta}>
                  {r.cook_time != null && (
                    <span className={styles.metaItem}><FiClock size={14} /> {r.cook_time} min</span>
                  )}
                  {r.servings != null && (
                    <span className={styles.metaItem}><FiUsers size={14} /> {r.servings}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}><FiX size={20} /></button>
            <h3 className={styles.modalTitle}>Add a new recipe</h3>
            <div className={styles.form}>
              <input placeholder="Recipe title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={styles.input} />
              <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={styles.input} />
              <div className={styles.row2}>
                <input placeholder="Prep time (min)" value={form.prep_time} onChange={e => setForm({ ...form, prep_time: e.target.value })} className={styles.input} />
                <input placeholder="Cook time (min)" value={form.cook_time} onChange={e => setForm({ ...form, cook_time: e.target.value })} className={styles.input} />
              </div>
              <div className={styles.row2}>
                <input placeholder="Servings" value={form.servings} onChange={e => setForm({ ...form, servings: e.target.value })} className={styles.input} />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={styles.input}>
                  <option value="">Category</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={styles.input} />
              <textarea placeholder="Ingredients *" rows={3} value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} className={styles.input} />
              <textarea placeholder="Steps *" rows={3} value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} className={styles.input} />
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save recipe'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}