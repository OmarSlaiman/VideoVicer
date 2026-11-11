import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  EXAMPLE_STEPS,
  DEFAULT_READINESS,
  computeMetrics,
  computeReadiness,
  computeImprovement,
  computeStartHere,
  computeAdoption,
  newId,
} from './model.js'
import { encodeStateToHash, readStateFromHash, saveLocal, readLocal } from './persist.js'
import { downloadPng, downloadSvg } from './exportImage.js'
import StepList from './components/StepList.jsx'
import Metrics from './components/Metrics.jsx'
import Timeline from './components/Timeline.jsx'
import WaitDistribution from './components/WaitDistribution.jsx'
import FirstNinetyDays from './components/FirstNinetyDays.jsx'
import Readiness from './components/Readiness.jsx'
import AdoptionGap from './components/AdoptionGap.jsx'
import OpenQuestions from './components/OpenQuestions.jsx'

const freshExample = () => EXAMPLE_STEPS.map((s) => ({ ...s }))

function restored(loaded, source) {
  return {
    steps: loaded.steps,
    readiness: loaded.readiness ?? DEFAULT_READINESS,
    adoptionDays: loaded.adoptionDays ?? null,
    source,
  }
}

const fresh = () => ({
  steps: freshExample(),
  readiness: DEFAULT_READINESS,
  adoptionDays: null,
  source: 'example',
})

// A shared link first, then saved work, otherwise the example. The user never meets
// an empty form.
function initialState() {
  const shared = readStateFromHash()
  if (shared && shared.steps.length) return restored(shared, 'link')
  const stored = readLocal()
  if (stored && stored.steps.length) return restored(stored, 'saved')
  return fresh()
}

export default function App() {
  const [{ steps, readiness, adoptionDays, source }, setState] = useState(initialState)
  const [readinessOpen, setReadinessOpen] = useState(false)
  const [status, setStatus] = useState('')
  const svgRef = useRef(null)
  const statusTimer = useRef(null)

  // The address must not describe a state that no longer holds. The moment the user
  // changes anything, the shared link is stale, and the hash is removed.
  const clearHash = useCallback(() => {
    if (window.location.hash.startsWith('#p=')) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const setSteps = useCallback(
    (updater) => {
      clearHash()
      setState((prev) => ({
        ...prev,
        source: 'own',
        steps: typeof updater === 'function' ? updater(prev.steps) : updater,
      }))
    },
    [clearHash]
  )

  const setReadiness = useCallback(
    (next) => {
      clearHash()
      setState((prev) => ({ ...prev, readiness: next }))
    },
    [clearHash]
  )

  const setAdoptionDays = useCallback(
    (next) => {
      clearHash()
      setState((prev) => ({ ...prev, adoptionDays: next === '' ? null : next }))
    },
    [clearHash]
  )

  const say = useCallback((message) => {
    setStatus(message)
    clearTimeout(statusTimer.current)
    statusTimer.current = setTimeout(() => setStatus(''), 4000)
  }, [])

  useEffect(() => () => clearTimeout(statusTimer.current), [])

  // A shared link pasted into the address bar of an open tab causes no reload.
  useEffect(() => {
    const onHashChange = () => {
      const shared = readStateFromHash()
      if (shared && shared.steps.length) setState(restored(shared, 'link'))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    saveLocal({ steps, readiness, adoptionDays })
  }, [steps, readiness, adoptionDays])

  const metrics = useMemo(() => computeMetrics(steps), [steps])
  const readinessResult = useMemo(() => computeReadiness(metrics, readiness), [metrics, readiness])
  const improvement = useMemo(() => computeImprovement(metrics), [metrics])
  const startHere = useMemo(() => computeStartHere(metrics), [metrics])
  const adoption = useMemo(() => computeAdoption(metrics, adoptionDays), [metrics, adoptionDays])

  const changeStep = useCallback(
    (id, patch) => setSteps((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    [setSteps]
  )

  const moveStep = useCallback(
    (id, dir) =>
      setSteps((list) => {
        const i = list.findIndex((s) => s.id === id)
        const j = i + dir
        if (i < 0 || j < 0 || j >= list.length) return list
        const next = list.slice()
        ;[next[i], next[j]] = [next[j], next[i]]
        return next
      }),
    [setSteps]
  )

  const removeStep = useCallback((id) => setSteps((list) => list.filter((s) => s.id !== id)), [setSteps])

  // Only one step can be the value moment. Setting a new one clears the old.
  const setValueMoment = useCallback(
    (id, on) => setSteps((list) => list.map((s) => ({ ...s, isValueMoment: on && s.id === id }))),
    [setSteps]
  )

  const addStep = useCallback(
    () =>
      setSteps((list) => [
        ...list,
        {
          id: newId(),
          name: '',
          owner: 'us',
          processHours: 1,
          waitDaysBefore: 0,
          waitCause: null,
          isValueMoment: false,
        },
      ]),
    [setSteps]
  )

  const reset = useCallback(() => {
    setState(fresh())
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search)
    say('Eksemplet er hentet tilbage.')
  }, [say])

  const share = useCallback(async () => {
    const hash = encodeStateToHash({ steps, readiness, adoptionDays })
    if (!hash) return say('Linket kunne ikke laves.')
    const url = window.location.origin + window.location.pathname + window.location.search + hash
    history.replaceState(null, '', hash)
    try {
      await navigator.clipboard.writeText(url)
      say('Linket er kopieret. Hele forløbet ligger i adressen.')
    } catch {
      say('Linket står nu i adresselinjen og kan kopieres derfra.')
    }
  }, [steps, readiness, adoptionDays, say])

  const exportSvg = useCallback(() => {
    say(downloadSvg(svgRef.current) ? 'Tidslinjen er hentet som SVG.' : 'Der er ingen tidslinje at hente.')
  }, [say])

  const exportPng = useCallback(async () => {
    const ok = await downloadPng(svgRef.current)
    say(ok ? 'Tidslinjen er hentet som PNG.' : 'PNG kunne ikke laves. Prøv SVG i stedet.')
  }, [say])

  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <h1>Kundeonboarding hos VideoVicer</h1>
          <p className="lede">Hvor går tiden fra underskrift til første certifikat?</p>
          <p className="byline">
            Et analyseudkast lavet af Omar Slaiman i forbindelse med min ansøgning som Customer
            Success Manager. Forløbet bygger på offentlig information og mine egne antagelser, så
            ret mig endelig.
          </p>
        </div>
      </header>

      <main className="page">
        <p className="hint intro-hint">
          Tallene er mine gæt. Ret trinene til jeres virkelige forløb, så regner værktøjet igen.
        </p>

        {source === 'link' ? (
          <p className="hint">
            Dette forløb er indlæst fra et delt link. Ret frit i det — ændringerne rammer kun din
            egen browser.
          </p>
        ) : null}

        <div className="columns">
          <div>
            <StepList
              steps={steps}
              onChangeStep={changeStep}
              onMoveStep={moveStep}
              onRemoveStep={removeStep}
              onSetValueMoment={setValueMoment}
              onAddStep={addStep}
              onReset={reset}
            />
          </div>

          <div className="results-col">
            <Metrics metrics={metrics} stepCount={steps.length} />
          </div>
        </div>

        <div className="section">
          <Timeline
            steps={steps}
            metrics={metrics}
            svgRef={svgRef}
            adoptionDays={adoption.days}
          />
        </div>

        <div className="section">
          <WaitDistribution metrics={metrics} improvement={improvement} startHere={startHere} />
        </div>

        <div className="section">
          <FirstNinetyDays steps={steps} metrics={metrics} />
        </div>

        <div className="section">
          <Readiness
            readiness={readiness}
            onChange={setReadiness}
            result={readinessResult}
            metrics={metrics}
            open={readinessOpen}
            onToggle={setReadinessOpen}
          />
        </div>

        <div className="section">
          <AdoptionGap
            metrics={metrics}
            adoption={adoption}
            adoptionDays={adoptionDays}
            onChange={setAdoptionDays}
          />
        </div>

        <div className="toolbar" style={{ marginTop: 20 }}>
          <button type="button" className="btn" onClick={share}>
            Kopiér link til dette forløb
          </button>
          <button type="button" className="btn" onClick={exportSvg}>
            Hent tidslinjen som SVG
          </button>
          <button type="button" className="btn" onClick={exportPng}>
            Hent som PNG
          </button>
          <button type="button" className="btn" onClick={() => window.print()}>
            Print eller gem som PDF
          </button>
          <span className="status-msg" role="status" aria-live="polite">
            {status}
          </span>
        </div>

        <div className="section">
          <OpenQuestions />
        </div>

        <footer className="footer">
          <h2>Hvorfor jeg har lavet det</h2>
          <p>
            Et onboardingforløb er en proces som alle andre. Det har overleveringer, ventetid og
            steder, hvor tingene går i stå. Og time-to-value er bare gennemløbstid sagt med et
            andet ord. Jeg har lavet siden for at vise, hvordan jeg ville gå til jeres kunders
            forløb: ikke ved at spørge, hvem der er langsom, men hvor arbejdet ligger stille.
            Tallene er kun så gode som de antagelser, der er tastet ind, og intet forlader din
            browser.
          </p>
          <p>
            Lavet af Omar Slaiman
            <br />
            <a href="mailto:omar.slaiman7@gmail.com">omar.slaiman7@gmail.com</a> ·{' '}
            <a href="tel:+4550620949">+45 50 62 09 49</a>
          </p>
        </footer>
      </main>
    </>
  )
}
