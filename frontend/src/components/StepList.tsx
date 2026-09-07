import styles from '@/styles/StepList.module.css';

export default function StepList({ steps }: { steps: string[] }) {
  return (
    <div>
      <h3 className={styles.heading}>Steps</h3>
      {steps.length === 0 ? (
        <p className={styles.empty}>No steps listed.</p>
      ) : (
        <ol className={styles.list}>
          {steps.map((step, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.num}>{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}