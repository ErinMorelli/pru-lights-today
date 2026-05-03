(async () => {
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
    } else {
      show('no-event');
    }
  } catch (err) {
    console.error('Failed to load data.json:', err);
    show('error');
  }
})();
