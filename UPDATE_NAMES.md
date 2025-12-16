# Update Names List in Database

## Instructions

1. **Go to Supabase Dashboard:**
   - Open your Supabase project
   - Navigate to **SQL Editor** (left sidebar)

2. **Run the SQL Script:**
   - Click **New Query**
   - Open `update-names.sql` from this project
   - Copy the entire SQL content
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify:**
   - Go to **Table Editor** → `names_list`
   - You should see all 100 names listed

## Alternative: Clear and Re-insert

If you want to replace all existing names:

1. First run:
   ```sql
   DELETE FROM names_list;
   ```

2. Then run the INSERT statements from `update-names.sql`

## Notes

- The script uses `ON CONFLICT (name) DO NOTHING` to avoid duplicates
- Names are case-sensitive
- All names are formatted as "Last Name, First Name"


