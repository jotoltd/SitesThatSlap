import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Commit {
  commit: { message: string }
}

function toPlainEnglish(msg: string): string {
  let text = msg
    .replace(/^\[.*?\]\s*/, '')
    .replace(/^[a-z]+(\(.*?\))?!?:\s*/i, '')
    .replace(/\(#\d+\)/g, '')
    .trim()
  if (text.length < 4) return ''

  const replacements: [RegExp, string][] = [
    [/\brefactor(ed|ing)?\b/gi, 'Improved'],
    [/\bimpl(ement|emented|ementing)?\b/gi, 'Added'],
    [/\bRLS\b/gi, 'security settings'],
    [/\bCRUD\b/gi, 'data management'],
    [/\bAPI\b/gi, 'backend'],
    [/\bCSS\b/gi, 'styling'],
    [/\bUI\b/gi, 'interface'],
    [/\bUX\b/gi, 'user experience'],
    [/\bSEO\b/gi, 'search engine visibility'],
    [/\bCI\/CD\b/gi, 'deployment pipeline'],
    [/\bdeps?\b/gi, 'dependencies'],
    [/\bnpm\b/gi, 'package'],
    [/\bcomponent(s)?\b/gi, 'section$1'],
    [/\bendpoint(s)?\b/gi, 'feature$1'],
    [/\bmigration(s)?\b/gi, 'database update$1'],
    [/\bschema\b/gi, 'database structure'],
    [/\bwebhook(s)?\b/gi, 'notification$1'],
    [/\bmerge(d)?\s+(branch|pr|pull\s*request)\b/gi, 'Combined latest changes'],
    [/\blint(ing|er)?\b/gi, 'code quality'],
    [/\btsx?\b/gi, 'code'],
    [/\benv\b/gi, 'configuration'],
  ]
  replacements.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement)
  })

  return text.charAt(0).toUpperCase() + text.slice(1)
}

function summarizeCommits(commits: Commit[]): string {
  if (commits.length === 0) return 'No updates today — the team is planning the next steps.'

  const buckets: Record<string, string[]> = {
    'New features': [],
    'Design & visual improvements': [],
    'Bugs fixed': [],
    'Performance improvements': [],
    'General improvements': [],
  }

  commits.forEach(c => {
    const raw = c.commit.message.split('\n')[0]
    const friendly = toPlainEnglish(raw)
    if (!friendly) return
    const lower = raw.toLowerCase()

    if (lower.match(/fix|bug|issue|resolve|patch|crash|error/)) {
      buckets['Bugs fixed'].push(friendly)
    } else if (lower.match(/style|css|ui|design|layout|color|font|responsive|mobile|animation/)) {
      buckets['Design & visual improvements'].push(friendly)
    } else if (lower.match(/feat|add|new|create|implement|introduce|build/)) {
      buckets['New features'].push(friendly)
    } else if (lower.match(/perf|speed|optimi|cache|lazy|bundle|compress|fast/)) {
      buckets['Performance improvements'].push(friendly)
    } else {
      buckets['General improvements'].push(friendly)
    }
  })

  const lines: string[] = []
  const totalAreas = Object.values(buckets).filter(b => b.length > 0).length

  if (commits.length === 1) {
    lines.push('We made a focused update to your project today.')
  } else if (commits.length <= 5) {
    lines.push(`Good progress today — ${commits.length} updates across ${totalAreas} area${totalAreas === 1 ? '' : 's'} of your project.`)
  } else {
    lines.push(`Big day! ${commits.length} updates shipped across ${totalAreas} area${totalAreas === 1 ? '' : 's'} of your project.`)
  }

  Object.entries(buckets).forEach(([label, items]) => {
    if (items.length === 0) return
    lines.push('')
    lines.push(`${label}:`)
    items.forEach(item => {
      lines.push(`  • ${item}`)
    })
  })

  return lines.join('\n')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const githubToken = Deno.env.get('GITHUB_TOKEN') || ''

    // Get all projects with GitHub repos
    const { data: projects, error: projErr } = await supabase
      .from('projects')
      .select('id, name, client_id, github_repo_url, github_branch')
      .not('github_repo_url', 'is', null)
      .neq('github_repo_url', '')

    if (projErr || !projects?.length) {
      return new Response(JSON.stringify({ message: 'No projects with GitHub repos', error: projErr }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]
    const since = new Date(dateStr + 'T00:00:00Z').toISOString()
    const until = new Date(dateStr + 'T23:59:59Z').toISOString()

    const results: string[] = []

    for (const project of projects) {
      // Check if summary already exists for this date
      const { data: existing } = await supabase
        .from('project_summaries')
        .select('id')
        .eq('project_id', project.id)
        .eq('date', dateStr)
        .limit(1)

      if (existing?.length) {
        results.push(`${project.name}: already summarised`)
        continue
      }

      // Extract owner/repo from URL
      const match = project.github_repo_url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/)
      if (!match) {
        results.push(`${project.name}: invalid GitHub URL`)
        continue
      }

      const [, owner, repo] = match
      const branch = project.github_branch || 'main'

      // Fetch commits
      const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' }
      if (githubToken) headers['Authorization'] = `token ${githubToken}`

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&since=${since}&until=${until}&per_page=100`,
        { headers }
      )

      if (!res.ok) {
        results.push(`${project.name}: GitHub API error ${res.status}`)
        continue
      }

      const commits: Commit[] = await res.json()

      if (commits.length === 0) {
        results.push(`${project.name}: no commits yesterday`)
        continue
      }

      const summary = summarizeCommits(commits)

      // Save summary
      const { error: insertErr } = await supabase.from('project_summaries').insert({
        project_id: project.id,
        summary,
        commit_count: commits.length,
        commits_data: commits.slice(0, 50),
        date: dateStr,
      })

      if (insertErr) {
        results.push(`${project.name}: save failed - ${insertErr.message}`)
      } else {
        results.push(`${project.name}: ${commits.length} commits summarised`)

        // Notify the client
        if (project.client_id) {
          await supabase.from('notifications').insert({
            user_id: project.client_id,
            title: 'Daily Project Update',
            message: `New update for "${project.name}" — ${commits.length} change${commits.length === 1 ? '' : 's'} yesterday.`,
            type: 'info',
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
