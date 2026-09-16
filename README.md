# SplitSimple

SplitSimple is a friendly, mobile-first app for sharing expenses without daily
limits or spreadsheet maintenance.

## MVP

- Create groups and invite people with a private link
- Add, edit, search, and categorize expenses
- Split equally or by exact amounts
- Track balances and simplify repayments
- Attach receipts and create expenses by scanning a receipt
- Record and convert expenses in multiple currencies
- Export a group to CSV
- Use the app without creating an account

## Local development

Requirements: Node.js 24+, npm 11+, and PostgreSQL.

1. Copy `.env.example` to `.env` and configure both database URLs.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

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
