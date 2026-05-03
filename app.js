(async () => {
  const applyColors = (colors) => {
    if (!colors?.length) return;

    const valid = colors.filter((c) => {
      const el = document.createElement('div');
      el.style.backgroundColor = c;
      return el.style.backgroundColor !== '';
    });

    if (!valid.length) return;

    const positions =
      valid.length === 1
        ? ['50% 50%']
        : valid.length === 2
        ? ['30% 50%', '70% 50%']
        : ['20% 50%', '50% 50%', '80% 50%'];

    const size = valid.length === 1 ? '100% 80%' : '70% 80%';

    document.body.style.backgroundImage = valid
      .slice(0, 3)
      .map(
        (c, i) =>
          `radial-gradient(ellipse ${size} at ${positions[i]}, color-mix(in srgb, ${c} 25%, transparent) 0%, transparent 70%)`
      )
      .join(', ');
  };

  const show = (id) => {
    document.querySelectorAll('.state').forEach((el) => (el.hidden = true));
    document.getElementById(id).hidden = false;
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/New_York',
    });

  try {
    // Cache-bust so GitHub Pages CDN doesn't serve stale data.json
    const res = await fetch(`data.json?v=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const genEl = document.getElementById('generated-at');
    if (genEl && data.generated_at) {
      genEl.textContent = `Last updated: ${new Date(data.generated_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/New_York',
      })} ET`;
    }

    if (data.has_event && data.event) {
      document.getElementById('event-purpose').textContent = data.event.purpose;
      document.getElementById('event-date').textContent =
        `${fmtDate(data.event.start)} – ${fmtDate(data.event.end)}`;
      document.title = `${data.event.purpose} | Prudential Center Lights Tonight`;
      show('event');
      applyColors(data.colors);
    } else {
      show('no-event');
    }
  } catch (err) {
    console.error('Failed to load data.json:', err);
    show('error');
  }
})();
