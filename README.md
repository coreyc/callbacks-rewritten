# callbacks-rewritten

## Install Postgres (homebrew)
(You'll need Homebrew installed)


`brew install postgres`

## Start Postgres
`pg_ctl -D /usr/local/var/postgres start`

## Create database and table
`createdb books`

Then: `psql books` followed by: `CREATE TABLE books (bookTitle text, isbn text)`