const CHECK_URL = process.env.CHECK_URL || 'http://localhost:3000/api/check-items';
const NOTIFY_URL = process.env.NOTIFY_URL || 'http://localhost:3000/api/notify';

async function runCheck() {
  try {
    const res = await fetch(CHECK_URL, { method: 'POST' });
    const data = await res.json();
    console.log(new Date().toISOString(), `checked: ${data.newItems} new`);
    if (data.items && data.items.length) {
      await fetch(NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: data.items }),
      });
    }
  } catch (err) {
    console.error('Error running check-items cron', err);
  }
}

runCheck();
setInterval(runCheck, 30 * 1000);
