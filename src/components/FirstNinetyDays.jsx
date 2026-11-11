import { CAUSE_BY_KEY, waitByCauses } from '../model.js'
import { fmt, dayWord } from '../format.js'

// The three actions are mine; the figures beside them are not. Each action names the
// causes of waiting it goes after, and the steps and days are looked up from the flow
// as it stands - so if the flow is edited, the numbers follow instead of going stale.
const ACTIONS = [
  {
    title: 'Book opfølgningen og den første kursusdag allerede ved kickoff.',
    causes: ['calendar'],
  },
  {
    title:
      'Få det første kursus lagt ind i et fast morgenmøde sammen med kundens ansvarlige, så første hold er færdigt inden for den første uge.',
    causes: ['priority'],
  },
  {
    title:
      'Send en skabelon til medarbejderlisten og et forslag til kursuspakke før kickoff, så kunden godkender et udkast i stedet for at vælge fra bunden.',
    causes: ['delivery', 'decision'],
  },
]

function joinNames(names) {
  if (names.length <= 1) return names[0] ?? ''
  return names.slice(0, -1).join(', ') + ' og ' + names[names.length - 1]
}

export default function FirstNinetyDays({ steps, metrics }) {
  const biggestIndex = metrics.topWaits.length ? metrics.topWaits[0].index : null

  return (
    <section className="card" aria-labelledby="plan-heading">
      <div className="card-head">
        <h2 id="plan-heading">Det ville jeg gøre de første 90 dage</h2>
        <p className="note">Tre handlinger, koblet til forsinkelserne i forløbet</p>
      </div>
      <div className="card-body">
        <ol className="plan-list">
          {ACTIONS.map((action, i) => {
            const { rows, totalDays } = waitByCauses(steps, action.causes)
            const waitNames = action.causes.map((k) => CAUSE_BY_KEY[k].waitName)
            const hitsBiggest = biggestIndex !== null && rows.some((r) => r.index === biggestIndex)

            return (
              <li key={i} className="plan-item">
                <span className="plan-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="plan-body">
                  <div className="plan-title">{action.title}</div>
                  <div className="plan-meta">
                    Går efter {joinNames(waitNames)}
                    {rows.length > 0 ? (
                      <>
                        {' '}
                        — <b>{fmt(totalDays, totalDays % 1 === 0 ? 0 : 1)} vente{dayWord(totalDays)}</b>{' '}
                        fordelt på{' '}
                        {rows.length === 1 ? 'ét trin' : rows.length + ' trin'}
                        {hitsBiggest
                          ? rows.length === 1
                            ? ', og det er den største enkeltforsinkelse i forløbet'
                            : ', heriblandt den største enkeltforsinkelse i forløbet'
                          : ''}
                        .
                      </>
                    ) : (
                      <> — men der er ingen ventetid af den type i forløbet lige nu.</>
                    )}
                  </div>
                  {rows.length > 0 ? (
                    <ul className="plan-steps">
                      {rows.map((r) => (
                        <li key={r.index}>
                          <span>
                            Trin {r.index + 1}: {r.name || 'trin uden navn'}
                          </span>
                          <span className="plan-days">
                            {fmt(r.days, r.days % 1 === 0 ? 0 : 1)} {dayWord(r.days)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
        <p className="disclaimer">
          Rækkefølgen er den, jeg ville tage dem i, ikke en rangering efter effekt. Handlingerne
          er mine forslag til eksemplet; ventedagene ved siden af følger de trin og årsager, der
          står i forløbet ovenfor.
        </p>
      </div>
    </section>
  )
}
