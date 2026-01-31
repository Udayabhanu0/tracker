#+ Expense Tracker

Minimal full-stack expense tracker built for the assignment. Includes a small API and a simple UI for creating, listing, filtering, sorting, and totaling expenses.

## ✅ Assignment Summary

**User Story**

As a user, I can record and review my personal expenses so I can understand where my money is going.
The tool is assumed to be used in real-world conditions (unreliable networks, browser refreshes, retries).

**Acceptance Criteria (core)**
1. Create a new expense entry (amount, category, description, date)
2. View a list of expenses
3. Filter expenses by category
4. Sort expenses by date (newest first)
5. See total of currently visible expenses (e.g., “Total: ₹X”)

## Architecture & Data

**Persistence choice:** SQLite via Prisma.

**Why:** SQLite is lightweight, local to the repo, and supports correct money handling with numeric/decimal types. It also provides safe persistence across reloads/retries without external dependencies.

**Data model (minimum):**
- id
- amount
- category
- description
- date
- created_at

## API

### `POST /expenses`
Create a new expense.

**Request body**
```json
{
  "amount": 1299.5,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-01-31"
}
```

**Notes**
- Handles retries (idempotent behavior via server-side logic).

### `GET /expenses`
Return a list of expenses.

**Optional query params**
- `category` → filter by category
- `sort=date_desc` → sort by date, newest first

## Frontend

Simple UI that connects to the API:
- Form to add a new expense (amount, category, description, date)
- List/table of existing expenses
- Filter by category
- Sort by date (newest first)
- Total of currently visible expenses

Handles real-world conditions such as:
- Multiple submits
- Page refreshes after submit
- Slow or failed API responses

## Nice-to-Haves (If Implemented)
- Basic validation (no negative amount, required date)
- Summary view (total per category)
- Basic error/loading states
- Small automated tests

## Trade-offs / Notes

- **Timebox trade-off:** Focused on correctness and idempotency over advanced UX polish.
- **Not implemented:** Advanced analytics, auth, or multi-user support.

## Setup

```bash
pnpm install
pnpm dev
```

If Prisma migrations are required:
```bash
pnpm prisma migrate dev
```

---

**Submission**
- Repo link: (add)
- Live app link: (add)
