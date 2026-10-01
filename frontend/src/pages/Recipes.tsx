import { useState, useEffect, useCallback } from 'react';
import { FiClock, FiUsers, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { Recipe } from '../types';
import apiClient from '../api/client';
import styles from './Recipes.module.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', instructions: '', image_url: '', prep_time: '', servings: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/recipes');
      setRecipes(res.data);
    } catch { setError('Failed to load recipes'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/api/recipes', {
        ...form,
        prep_time: form.prep_time ? Number(form.prep_time) : null,
        servings: form.servings ? Number(form.servings) : null,
      });
      setForm({ title: '', description: '', ingredients: '', instructions: '', image_url: '', prep_time: '', servings: '' });
      setShowForm(false);
      fetchRecipes();
    } catch { setError('Failed to create recipe'); }
    finally { setSubmitting(false); }
  };

  const heroRecipe = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            placeholder="Search recipes, ingredients…"
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>
          <FiPlus /> New Recipe
        </button>
      </div>

      <div className={styles.content}>
        {/* Hero */}
        {heroRecipe && (
          <section className={styles.hero} onClick={() => setSelectedRecipe(heroRecipe)}>
            <div className={styles.heroImg} style={{ backgroundImage: heroRecipe.image_url ? `url(${heroRecipe.image_url})` : `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200)` }} />
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>Recipe of the day</span>
              <h1 className={styles.heroTitle}>{heroRecipe.title}</h1>
              <p className={styles.heroDesc}>{heroRecipe.description || 'A delicious recipe waiting to be explored.'}</p>
              <div className={styles.heroMeta}>
                {heroRecipe.prep_time && <span className={styles.metaItem}><FiClock /> {heroRecipe.prep_time} min</span>}
                {heroRecipe.servings && <span className={styles.metaItem}><FiUsers /> {heroRecipe.servings} servings</span>}
              </div>
              <button className={styles.heroBtn}>View recipe</button>
            </div>
          </section>
        )}

        {/* Error */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Grid */}
        <section>
          <h2 className={styles.sectionTitle}>All Recipes</h2>
          {loading ? (
            <p className={styles.muted}>Loading recipes…</p>
          ) : filtered.length === 0 ? (
            <p className={styles.muted}>No recipes found. Add your first recipe!</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map(r => (
                <div key={r.id} className={styles.card} onClick={() => setSelectedRecipe(r)}>
                  <div className={styles.cardImg} style={{ backgroundImage: r.image_url ? `url(${r.image_url})` : `url(https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500)` }} />
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{r.title}</h3>
                    <div className={styles.cardMeta}>
                      {r.prep_time != null && <span><FiClock /> {r.prep_time} min</span>}
                      {r.servings != null && <span><FiUsers /> {r.servings}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* New Recipe Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>New Recipe</h3>
              <button onClick={() => setShowForm(false)} className={styles.closeBtn}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={styles.input} />
              <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={styles.input} />
              <textarea required placeholder="Ingredients (one per line)" rows={3} value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} className={styles.input} />
              <textarea required placeholder="Instructions" rows={3} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} className={styles.input} />
              <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={styles.input} />
              <div className={styles.row}>
                <input placeholder="Prep time (min)" type="number" value={form.prep_time} onChange={e => setForm({ ...form, prep_time: e.target.value })} className={styles.input} />
                <input placeholder="Servings" type="number" value={form.servings} onChange={e => setForm({ ...form, servings: e.target.value })} className={styles.input} />
              </div>
              <button type="submit" disabled={submitting} className={styles.submitBtn}>{submitting ? 'Saving…' : 'Create Recipe'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedRecipe && (
        <div className={styles.overlay} onClick={() => setSelectedRecipe(null)}>
          <aside className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader} style={{ backgroundImage: selectedRecipe.image_url ? `url(${selectedRecipe.image_url})` : `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800)` }}>
              <button className={styles.drawerClose} onClick={() => setSelectedRecipe(null)}><FiX /></button>
              <div className={styles.drawerHeaderContent}>
                <h2>{selectedRecipe.title}</h2>
                <div className={styles.heroMeta}>
                  {selectedRecipe.prep_time != null && <span className={styles.metaItem}><FiClock /> {selectedRecipe.prep_time} min</span>}
                  {selectedRecipe.servings != null && <span className={styles.metaItem}><FiUsers /> {selectedRecipe.servings}</span>}
                </div>
              </div>
            </div>
            <div className={styles.drawerBody}>
              {selectedRecipe.description && <p className={styles.descText}>{selectedRecipe.description}</p>}
              <h4 className={styles.subTitle}>Ingredients</h4>
              <pre className={styles.preBlock}>{selectedRecipe.ingredients}</pre>
              <h4 className={styles.subTitle}>Instructions</h4>
              <pre className={styles.preBlock}>{selectedRecipe.instructions}</pre>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}