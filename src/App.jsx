import { useState } from 'react';
import './index.css';

const today = new Date()
const todayStr = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'), // jak dlugosc != 2 to dodaj 0 na poczatku
  String(today.getDate()).padStart(2, '0'),
].join('-')

const MOCK_EXAMPLES = [
  {
    id: 1,
    title: 'Zakupy',
    amount: 100,
    date: '2026-01-01',
  },
  
  {
    id: 2,
    title: 'Transport',
    amount: 50,
    date: '2026-01-02',
  },
  {
    id: 3,
    title: 'Zakupy',
    amount: 100,
    date: '2026-01-01',
  },
  {
    id: 4,
    title: 'Czynsz',
    amount: 1200,
    date: todayStr,
  }
];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function filterByPeriod(items, period) {
  const now = new Date()
  const today = startOfDay(now)
  return items.filter((item) => {
    const d = startOfDay(new Date(item.date)) // data wydatku
    if (period === 'today') return d.getTime() === today.getTime()
    if (period === 'week') {
      const from = new Date(today)
      from.setDate(from.getDate() - 6)
      return d >= from && d <= today
    }
    // TODO
    if (period == 'this-week') {
      const to = new Date(today.getDay())
      const from = new Date(today.getDay())
      for (let i = 0; i < 7; i++) {
        if(from.getDay() == 1) { // jesli poniedzialek
          break
        }
        else {
          from.setDate(from.getDate() - 1)
        }
      }
      return d >= from && d <= to
    }
    if (period === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }
    if (period === 'year') return d.getFullYear() === now.getFullYear()
    return true // all
  })
}
function App() {
  const [type, setType] = useState('expenses') // expenses | income
  const [period, setPeriod] = useState('month') // day | week | month | year

  const visible = filterByPeriod(MOCK_EXAMPLES, period)
  const saldo = visible.reduce((sum, e) => sum + e.amount, 0)
    
  return (
    <div className="app">
    <nav className="type-bar" aria-label="Typ">
      <button
        type="button"
        className={type === 'expenses' ? 'active' : ''}
        onClick={() => setType('expenses')}
      >
        Wydatki
      </button>
      <button
        type="button"
        className={type === 'income' ? 'active' : ''}
        onClick={() => setType('income')}
      >
        Dochody
      </button>
    </nav>
    {type === 'expenses' ? (
      <>
        <section className="saldo">
          <p className="saldo-label">Saldo wydatków</p>
          <p className="saldo-value">{saldo.toFixed(2)} zł</p>
        </section>
        <div className="period-bar" role="tablist" aria-label="Okres">
          {[
            ['today', 'Dziś'],
            ['week', 'Tydzień'],
            ['month', 'Miesiąc'],
            ['year', 'Rok'],
            ['all', 'Całość'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={period === id}
              className={period === id ? 'active' : ''}
              onClick={() => setPeriod(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="expense-list">
          {visible.length === 0 ? (
            <li className="empty">Brak wydatków w tym okresie.</li>
          ) : (
            visible.map((e) => (
              <li key={e.id}>
                <span className="expense-title">{e.title}</span>
                <span className="expense-meta">{e.date}</span>
                <span className="expense-amount">−{e.amount.toFixed(2)} zł</span>
              </li>
            ))
          )}
        </ul>
      </>
    ) : (
      <p className="placeholder">Dochody — zrobimy w następnym kroku.</p>
    )}
  </div>
  )
}

export default App