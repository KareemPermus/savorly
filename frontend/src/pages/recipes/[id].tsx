import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import Link from 'next/link';
import { FiClock, FiUsers, FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '@/styles/RecipeDetail.module.css';

interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: { id: number; name: string; quantity: string; unit: string }[];
  steps: { id: number; instruction: string; step_number: number }[];
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError('Recipe not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/recipes/${id}`);
      router.push('/recipes');
    } catch {
      setDeleting(false);
      alert('Failed to delete');
    }
  };

  if (loading) return <div className={styles.center}><div className={styles.spinner} /></div>;
  if (error || !recipe) return <div className={styles.center}><p className={styles.errorText}>{error || 'Not found'}</p><Link href="/recipes" className={styles.backLink}><FiArrowLeft /> Back to recipes</Link></div>;

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero} style={{ backgroundImage: recipe.image_url ? `url(${recipe.image_url})` : undefined }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link href="/recipes" className={styles.backBtn}><FiArrowLeft size={16} /> Back</Link>
          <h1 className={styles.title}>{recipe.title}</h1>
          {recipe.description && <p className={styles.desc}>{recipe.description}</p>}
          <div className={styles.meta}>
            {totalTime > 0 && <span className={styles.metaItem}><FiClock size={14} /> {totalTime}m</span>}
            {recipe.servings && <span className={styles.metaItem}><FiUsers size={14} /> {recipe.servings} servings</span>}
          </div>
          <div className={styles.actions}>
            <Link href={`/recipes/${recipe.id}?edit=1`} className={styles.editBtn}><FiEdit2 size={14} /> Edit</Link>
            <button onClick={handleDelete} disabled={deleting} className={styles.deleteBtn}><FiTrash2 size={14} /> {deleting ? 'Deleting…' : 'Delete'}</button>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Ingredients */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map(ing => (
                <li key={ing.id} className={styles.ingredientItem}>
                  <span className={styles.dot} />
                  <span>{ing.quantity && `${ing.quantity} `}{ing.unit && `${ing.unit} `}{ing.name}</span>
                </li>
              ))}
            </ul>
          ) : <p className={styles.empty}>No ingredients listed.</p>}
        </section>

        {/* Steps */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Steps</h2>
          {recipe.steps && recipe.steps.length > 0 ? (
            <ol className={styles.stepList}>
              {recipe.steps.sort((a, b) => a.step_number - b.step_number).map(step => (
                <li key={step.id} className={styles.stepItem}>
                  <span className={styles.stepNum}>{step.step_number}</span>
                  <p>{step.instruction}</p>
                </li>
              ))}
            </ol>
          ) : <p className={styles.empty}>No steps listed.</p>}
        </section>
      </div>
    </div>
  );
}