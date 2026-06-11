-- Enable pg_net extension (needed for HTTP calls from DB)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Enable pg_cron for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Schedule daily summary generation at 8am UTC (9am UK time)
SELECT cron.schedule(
  'daily-project-summaries',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qwlezodyzpiqegoajvpg.supabase.co/functions/v1/daily-summaries',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
