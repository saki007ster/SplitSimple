# SplitSimple

SplitSimple is a friendly, mobile-first app for sharing expenses without daily
limits or spreadsheet maintenance.

## MVP

- Create private groups with account-based access
- Invite editors or read-only viewers with expiring, one-use links
- Add, edit, search, and categorize expenses
- Split equally or by exact amounts
- Track balances and simplify repayments
- Attach receipts and create expenses by scanning a receipt
- Record and convert expenses in multiple currencies
- Export a group to CSV
- Delete an account and the groups/data it owns

## Local development

Requirements: Node.js 24+, npm 11+, and PostgreSQL.

1. Copy `.env.example` to `.env` and configure both database URLs.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

Generate a local authentication secret with `openssl rand -base64 32` and set
`BETTER_AUTH_SECRET`. Production also requires `BETTER_AUTH_URL` to match the
public app URL.

## Production operations

- Set `BETTER_AUTH_SECRET` to a unique random value and
  `BETTER_AUTH_URL=https://splitsimple.up.railway.app` in Railway.
- Set `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` to enable server and browser
  error monitoring. The browser DSN must also be passed to Docker as the
  `NEXT_PUBLIC_SENTRY_DSN` build argument; Railway build variables can supply
  it when the image is rebuilt.
- Set `SUPPORT_EMAIL` to show a contact in the legal pages.
- Configure the `BACKUP_DATABASE_URL` GitHub Actions secret with a dedicated,
  least-privilege PostgreSQL backup connection. The scheduled workflow creates
  a verified daily dump retained for 14 days. Test a downloaded archive with
  `npm run db:verify-backup -- path/to/file.dump` and periodically rehearse a
  restore into a separate database.
- Database dumps contain private user data. Limit access to workflow artifacts
  and delete downloaded copies when they are no longer needed.
- Keep Railway's own database backups enabled as a second recovery layer when
  available on the selected plan.

Receipt attachments require an S3-compatible bucket. Receipt extraction and
automatic category suggestions require an OpenAI API key. The relevant
environment variables are documented in `.env.example`.

## Checks

```sh
npm run check-types
npm run lint
npm test
npm run build
```

## Open-source attribution

SplitSimple is based on the MIT-licensed
[Spliit project](https://github.com/spliit-app/spliit). Copyright and license
notices for the upstream work are retained in [LICENSE](./LICENSE).
