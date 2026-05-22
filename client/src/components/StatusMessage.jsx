export function Loading({ text = "加载中..." }) {
  return <div className="status-box">{text}</div>;
}

export function EmptyState({ text = "暂无数据" }) {
  return <div className="status-box muted">{text}</div>;
}

export function ErrorMessage({ error }) {
  if (!error) return null;
  return <div className="error-box">{error}</div>;
}
