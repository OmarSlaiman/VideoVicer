import { fmt, fmtEstimate, dayWord } from '../format.js'

export default function AdoptionGap({ metrics, adoption, adoptionDays, onChange }) {
  const hasTtv = metrics.ttvDays !== null
  const filled = adoption.days !== null

  return (
    <section className="card" aria-labelledby="adoption-heading">
      <div className="card-head">
        <h2 id="adoption-heading">Fra adgang til gennemført kursus</h2>
        <p className="note">Adgang er ikke det samme som et gennemført kursus</p>
      </div>
      <div className="card-body">
        <p className="chart-caption" style={{ marginTop: 0 }}>
          Når platformen er sat op, og invitationerne er sendt, har medarbejderne adgang. Det er
          ikke det samme som, at de har gennemført kurserne. VideoVicers slutbrugere står på en
          byggeplads eller i produktionen og sidder sjældent ved en computer, og kurset skal
          klemmes ind mellem andre opgaver. Min antagelse er, at gabet mellem adgang og gennemført
          kursus er den største udfordring i hele forløbet — og at det er her, kunden afgør, om den
          fornyer.
        </p>

        <div className="adoption-input">
          <label htmlFor="adoption-days">
            Når det første hold er færdigt: Hvor mange dage går der typisk, før hovedparten af
            kundens medarbejdere har gennemført deres kurser?
          </label>
          <div className="field">
            <input
              id="adoption-days"
              type="number"
              min="0"
              step="1"
              value={adoptionDays ?? ''}
              placeholder="—"
              onChange={(e) => onChange(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <span className="unit">dage</span>
          </div>
        </div>

        {filled ? (
          <>
            <div className="compare">
              <div className="compare-cell">
                <div className="compare-value">
                  {hasTtv ? fmt(metrics.ttvDays, 1) : '—'}
                  <span className="suffix">dage</span>
                </div>
                <div className="compare-label">Første certifikat</div>
              </div>
              <div className="compare-cell">
                <div className="compare-value delta">
                  {'+' + fmt(adoption.days, adoption.days % 1 === 0 ? 0 : 1)}
                  <span className="suffix">dage</span>
                </div>
                <div className="compare-label">Resten af medarbejderne</div>
              </div>
              <div className="compare-cell highlight">
                <div className="compare-value">
                  {adoption.realTimeToValue !== null ? (
                    <>
                      <span className="prefix">cirka</span>
                      {fmtEstimate(adoption.realTimeToValue)}
                      <span className="suffix">dage</span>
                    </>
                  ) : (
                    '—'
                  )}
                </div>
                <div className="compare-label">Hovedparten er færdig</div>
              </div>
            </div>

            <p className="readiness-summary">
              Time-to-value måler, hvornår det første hold har gennemført. Det siger noget om,
              hvornår værdien er tilgængelig — ikke om, hvornår den er brugt. Forskellen til, at
              hovedparten er færdig, er{' '}
              <b>
                {fmt(adoption.days, adoption.days % 1 === 0 ? 0 : 1)} {dayWord(adoption.days)}
              </b>
              , hvor kunden betaler for adgang, som de fleste medarbejdere endnu ikke har brugt — og
              hvor beslutningen om at forny reelt træffes.
            </p>

            <p className="disclaimer">
              Time-to-value er regnet af det, der er tastet ind, og vises med decimal. Gabet er et
              gæt, og summen arver gættets usikkerhed — derfor står tallet for, hvornår hovedparten
              er færdig, som et rundt tal.
            </p>

            {!hasTtv ? (
              <p className="disclaimer">
                Der er ikke markeret et værdiøjeblik i forløbet, så tallet for, hvornår hovedparten
                er færdig, kan ikke regnes ud. Marker det trin, hvor kunden første gang oplever
                værdi.
              </p>
            ) : null}
          </>
        ) : (
          <p className="hint">
            Det ved jeg ikke, og feltet er med vilje tomt: det er et af de tal, jeg gerne vil høre
            jeres erfaring med. Mange måler det ikke. Forløbet erklæres færdigt, når invitationerne
            er sendt, og hvad der sker bagefter, er ingens tal. Et kvalificeret gæt er nok til at
            gøre gabet synligt.
          </p>
        )}

        <p className="closing-note">
          Et onboardingforløb kan optimeres til perfektion og stadig fejle, hvis medarbejderne
          aldrig får kurset gennemført. Procesarbejdet får kunden hen til platformen. Adfærd
          afgør, om kurserne bliver taget.
        </p>
      </div>
    </section>
  )
}
