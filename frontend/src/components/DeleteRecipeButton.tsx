import { useState } from 'react';
import apiClient from '@/api/client';
import { FiTrash2 } from 'react-icons/fi';
import styles from '@/styles/DeleteRecipeButton.module.css';

interface Props {
  recipeId: number;
  onDeleted: () => void;
}

export default function DeleteRecipeButton({ recipeId, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/api/recipes/${recipeId}`);
      onDeleted();
    } catch { setDeleting(false); }
  };

  if (confirming) {
    return (
      <div className={styles.confirmWrap}>
        <span className={styles.confirmText}>Delete this recipe?</span>
        <button className={styles.yesBtn} onClick={handleDelete} disabled={deleting}>{deleting ? '…' : 'Yes'}</button>
        <button className={styles.noBtn} onClick={() => setConfirming(false)}>No</button>
      </div>
    );
  }

  return (
    <button className={styles.deleteBtn} onClick={() => setConfirming(true)}>
      <FiTrash2 /> Delete
    </button>
  );
}