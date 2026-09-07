import { useState } from 'react';
import { Recipe } from '@/types';
import apiClient from '@/api/client';
import { FiEdit2 } from 'react-icons/fi';
import styles from '@/styles/EditRecipeButton.module.css';

interface Props {
  recipe: Recipe;
  onSave: (r: Recipe) => void;
}

export default function EditRecipeButton({ recipe, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: recipe.title,
    description: recipe.description || '',
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    prep_time: recipe.prep_time ?? '',
    cook_time: recipe.cook_time ?? '',
    servings: recipe.servings ?? '',
    image_url: recipe.image_url || '',
    category: recipe.category || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiClient.put(`/api/recipes/${recipe.id}`, {
        ...form,
        prep_time: form.prep_time === '' ? null : Number(form.prep_time),
        cook_time: form.cook_time === '' ? null : Number(form.cook_time),
        servings: form.servings === '' ? null : Number(form.servings),
      });
      onSave(res.data);
      setOpen(false);
    } catch { /* keep modal open */ }
    setSaving(false);
  };

  if (!open) {
    return (
      <button className={styles.editBtn} onClick={() => setOpen(true)}>
        <FiEdit2 /> Edit
      </button>
    );
  }

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Edit Recipe</h3>
        <div className={styles.fields}>
          <input className={styles.input} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className={styles.input} placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <div className={styles.row}>
            <input className={styles.input} placeholder="Prep (min)" type="number" value={form.prep_time} onChange={e => setForm({ ...form, prep_time: e.target.value })} />
            <input className={styles.input} placeholder="Cook (min)" type="number" value={form.cook_time} onChange={e => setForm({ ...form, cook_time: e.target.value })} />
            <input className={styles.input} placeholder="Servings" type="number" value={form.servings} onChange={e => setForm({ ...form, servings: e.target.value })} />
          </div>
          <textarea className={styles.textarea} placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Ingredients (one per line)" rows={4} value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Steps (one per line)" rows={4} value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}