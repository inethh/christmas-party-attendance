# How to Manage Names in the Database

## Reset Names List

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Run this SQL to clear all names:

```sql
DELETE FROM names_list;
```

5. Click **Run**

## Add Names Manually

### Option 1: Using Supabase Table Editor

1. Go to **Table Editor** → `names_list`
2. Click **Insert** → **Insert row**
3. Enter the name in the `name` field
4. Click **Save**
5. Repeat for each name

### Option 2: Using SQL

1. Go to **SQL Editor**
2. Run this SQL for each name:

```sql
INSERT INTO names_list (name) VALUES ('Last Name, First Name');
```

Or insert multiple at once:

```sql
INSERT INTO names_list (name) VALUES
('Alajas, Elmer'),
('Alajas, Ezaganie'),
('Alcober, Neil');
```

### Option 3: Bulk Import from SQL File

1. Go to **SQL Editor**
2. Open `update-names.sql` from this project
3. Copy all the INSERT statements
4. Paste into SQL Editor
5. Click **Run**

## View Current Names

1. Go to **Table Editor** → `names_list`
2. You'll see all names listed
3. You can edit or delete individual names here

## Delete Specific Names

### Using Table Editor:
1. Go to **Table Editor** → `names_list`
2. Find the name you want to delete
3. Click the row and select **Delete**

### Using SQL:
```sql
DELETE FROM names_list WHERE name = 'Name to delete';
```

## Notes

- Names are case-sensitive
- Format: "Last Name, First Name"
- The `name` field has a UNIQUE constraint, so duplicates won't be allowed
- After making changes, refresh the app to see updates

