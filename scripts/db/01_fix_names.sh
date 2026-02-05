#!/bin/sh
set -e

echo "🔄 Renaming tables to snake_case plural..."

# Variables available in postgres container
# POSTGRES_USER, POSTGRES_DB

DB_USER="$POSTGRES_USER"
DB_NAME="$POSTGRES_DB"

# Function to execute SQL queries
exec_sql() {
    psql -U "$DB_USER" -d "$DB_NAME" -tAc "$1"
}

exec_cmd() {
    psql -U "$DB_USER" -d "$DB_NAME" -c "$1"
}

# 1. Rename Tables (PascalCase -> snake_case + plural)
TABLES=$(exec_sql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name ~ '^[A-Z]';")

for pascal_name in $TABLES; do
    # Convert PascalCase to snake_case
    snake_name=$(echo "$pascal_name" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
    
    # Pluralize
    if [[ $snake_name == *y ]]; then
        snake_name="${snake_name%y}ies"
    elif [[ ! $snake_name == *s ]]; then
        snake_name="${snake_name}s"
    fi
    
    echo "  Renaming table $pascal_name -> $snake_name"
    exec_cmd "ALTER TABLE \"$pascal_name\" RENAME TO \"$snake_name\";"
done

# 2. Rename Columns (camelCase -> snake_case)
echo "🔄 Renaming columns to snake_case..."
ALL_TABLES=$(exec_sql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")

for table in $ALL_TABLES; do
     COLUMNS=$(exec_sql "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '$table' AND column_name ~ '[A-Z]';")
     
     if [ ! -z "$COLUMNS" ]; then
        echo "  Processing table: $table"
        for camel_col in $COLUMNS; do
            snake_col=$(echo "$camel_col" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
            echo "    Renaming col: $camel_col -> $snake_col"
            exec_cmd "ALTER TABLE \"$table\" RENAME COLUMN \"$camel_col\" TO \"$snake_col\";"
        done
     fi
done

echo "✅ Database normalization complete."
