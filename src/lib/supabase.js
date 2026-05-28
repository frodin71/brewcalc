import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://hkzavsbpxkgkyddpqmne.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhremF2c2JweGtna3lkZHBxbW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzQxOTQsImV4cCI6MjA5NTU1MDE5NH0.ULL6vGQGmVZfkRBUxS7R7LTa9lp641qIu_MTmnFaD-U'
)
