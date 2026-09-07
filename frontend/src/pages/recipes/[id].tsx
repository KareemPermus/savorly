import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import RecipeHeader from '@/components/RecipeHeader';
import IngredientList from '@/components/IngredientList';
import StepList from '@/components/StepList';
import EditRecipeButton from '@/components/EditRecipeButton';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import styles from '@/styles/RecipeDetail.module.css';

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError('Recipe not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading recipe…</div>;
  }

  if (error || !recipe) {
    return (
      <div className={styles.error}>
        <p>{error || 'Recipe not found'}</p>
        <button className={styles.backBtn} onClick={() => router.push('/recipes')}>← Back to recipes</button>
      </div>
    );
  }

  const ingredients = recipe.ingredients ? recipe.ingredients.split('\n').filter(Boolean) : [];
  const steps = recipe.steps ? recipe.steps.split('\n').filter(Boolean) : [];

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.push('/recipes')}>← Back to recipes</button>
      <RecipeHeader recipe={recipe} />
      <div className={styles.actions}>
        <EditRecipeButton recipe={recipe} onSave={setRecipe} />
        <DeleteRecipeButton recipeId={recipe.id} onDeleted={() => router.push('/recipes')} />
      </div>
      <div className={styles.body}>
        <div className={styles.ingredientsCol}>
          <IngredientList ingredients={ingredients} />
        </div>
        <div className={styles.stepsCol}>
          <StepList steps={steps} />
        </div>
      </div>
    </div>
  );
}