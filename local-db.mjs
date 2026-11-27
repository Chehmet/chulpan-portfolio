import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function localDatabase() {
  const sqlite = new DatabaseSync(':memory:');
  const migration = readFileSync(new URL('./drizzle/0000_portfolio.sql', import.meta.url), 'utf8');
  sqlite.exec(migration);
  return {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      function prepared(args) {
        return {
          bind: (...values) => prepared(values),
          async all() { return { results: statement.all(...args) }; },
          async run() { return statement.run(...args); },
        };
      }
      return prepared([]);
    },
  };
}
