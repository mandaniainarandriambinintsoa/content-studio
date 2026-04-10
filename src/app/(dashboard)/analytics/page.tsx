export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      <div className="card p-6">
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Vues, likes, commentaires, shares par plateforme. Import CSV ou webhook n8n (phase 2).
        </p>
      </div>
    </div>
  );
}
