export default function StudioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Studio</h1>
      <div className="card p-6">
        <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>
          Editor script + preview. À implémenter phase 1 : formulaire (titre, hook, body, CTA, projet) + Server Action save.
        </p>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Phase suivante : intégration Claude pour générer le script depuis un brief, estimation durée, export vers ElevenLabs.
        </p>
      </div>
    </div>
  );
}
