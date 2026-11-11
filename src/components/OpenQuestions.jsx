const QUESTIONS = [
  'Hvordan ser jeres onboardingforløb faktisk ud, trin for trin?',
  'Hvem hos kunden ejer typisk forløbet: HR, arbejdsmiljø eller en formand?',
  'Hvor stor en andel af de tildelte kurser bliver gennemført?',
  'Hvor ofte laver I kundespecifikke videoer, og hvor lang tid tager godkendelsen?',
  'Hvor lang tid går der i dag fra underskrift til første certifikat?',
]

export default function OpenQuestions() {
  return (
    <section className="card" aria-labelledby="open-heading">
      <div className="card-head">
        <h2 id="open-heading">Det ved jeg ikke endnu</h2>
        <p className="note">De antagelser, jeg allerhelst vil have rettet</p>
      </div>
      <div className="card-body">
        <ul className="question-list">
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="closing-note">Dem vil jeg meget gerne tale med jer om.</p>
      </div>
    </section>
  )
}
