-- Schedule daily recurring invoice generation at 8am UTC
SELECT cron.schedule(
  'generate-recurring-invoices-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qwlezodyzpiqegoajvpg.supabase.co/functions/v1/generate-recurring-invoices',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
