interface FeedStateProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
}

export function FeedState({
  loading,
  error,
  isEmpty,
  onRetry,
}: FeedStateProps) {
  if (loading) {
    return <p role="status">Загружаем публикации...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>Не удалось загрузить ленту: {error}</p>
        <button type="button" onClick={onRetry}>Попробовать ещё раз</button>
      </div>
    );
  }

  if (isEmpty) {
    return <p>Пока нет опубликованных маршрутов.</p>;
  }

  return null;
}