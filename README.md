# Poker Bank Reconciliation & Loss Adjuster

A mobile-optimized React app for reconciling poker game payouts when chip counts don't match the bank's cash total.

## Features

- **Bank Input**: Enter the total physical cash received
- **Player Management**: Add/remove players with their chip counts
- **Real-time Calculations**: Automatically calculates total owed and difference
- **Discrepancy Detection**: Alerts when chip totals don't match bank cash
- **Two Adjustment Methods**:
  - **Split Equally**: Divides the difference equally among all players
  - **Split Proportionally**: Applies difference based on each player's chip share percentage
- **Results Table**: Shows raw counts, adjustments, and final payouts for each player
- **Mobile-First Design**: Dark mode UI optimized for mobile devices

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Usage

1. Enter the total physical cash you received in the "Total Physical Cash ($)" field
2. Click "Add Player" to add players
3. Enter each player's name and their chip count
4. If there's a discrepancy, use either:
   - **Split Equally**: Each player gets an equal share of the difference
   - **Split Proportionally**: Each player's adjustment is proportional to their chip count
5. Review the final payouts in the results table
6. Use "Clear Session" to reset everything

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

