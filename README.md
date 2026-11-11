# Kundeonboarding hos VideoVicer

Et analyseudkast over VideoVicers kundeonboarding, lavet af Omar Slaiman i forbindelse med en
ansøgning som Customer Success Manager. Siden stiller ét spørgsmål: **Hvor går tiden fra
underskrift til første certifikat?**

Forløbet bygger på offentlig information og mine egne antagelser, så alle tal er gæt. Siden er lavet
til at blive rettet: ændrer man et trin, regner den hele analysen om.

Live: <https://omarslaiman.github.io/VideoVicer/>

## Kom i gang

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Bygget lander i `dist/` og kan lægges op som statiske filer hvor som helst. `base` er sat til `./`,
så det også virker fra en undermappe.

## Sådan er det sat sammen

| Fil | Ansvar |
| --- | --- |
| `src/model.js` | Datamodel, konstanter, eksemplet og alle beregninger. Ingen UI. |
| `src/format.js` | Danske talformater og afrundingsreglen, samlet ét sted. |
| `src/persist.js` | localStorage og deling via base64 i URL'ens hash. |
| `src/exportImage.js` | Hent tidslinjen som SVG eller PNG. |
| `src/App.jsx` | State, rækkefølgen af sektioner, deling og eksport. |
| `src/components/StepList.jsx` | Den redigerbare trinliste. |
| `src/components/Metrics.jsx` | De fem nøgletal og udregningen bag dem. |
| `src/components/Timeline.jsx` | Tidslinjen som håndtegnet SVG, med baner pr. ejer. |
| `src/components/WaitDistribution.jsx` | Ventetid efter ejer og årsag, de største forsinkelser, modtræk og potentiale. |
| `src/components/FirstNinetyDays.jsx` | De tre handlinger de første 90 dage, koblet til ventedagene i forløbet. |
| `src/components/Readiness.jsx` | De fem spørgsmål om kunden, det realistiske skøn og modtrækkene. |
| `src/components/AdoptionGap.jsx` | Fra adgang til gennemført kursus. |
| `src/components/OpenQuestions.jsx` | Det, jeg ikke ved endnu. |

Ingen backend, ingen database, intet login. Alt regnes i browseren, og intet forlader den. Ingen
tredjepartsbiblioteker til grafik: SVG'en er tegnet i hånden.

## Beregningerne

En arbejdsdag regnes som 7,4 timer (`HOURS_PER_DAY` i `src/model.js`).

```
totalProcessDays   = sum(processHours) / 7,4
totalWaitDays      = sum(waitDaysBefore)
totalLeadTimeDays  = totalWaitDays + totalProcessDays
flowEfficiency     = totalProcessDays / totalLeadTimeDays * 100
ttvDays            = sum(waitDaysBefore + processHours/7,4) til og med trinnet med isValueMoment
handoffs           = antal gange owner skifter mellem to trin i træk
waitByOwner        = ventetid før et trin tilskrives den, der skal udføre trinnet
classifiedWaitDays = ventetid, hvor waitCause er sat
humanWaitDays      = sum(waitDaysBefore, hvor waitCause er sat og ikke er "technical")
humanWaitShare     = humanWaitDays / classifiedWaitDays * 100
```

### Årsag frem for ejer

Hvert trin har både en `owner` og en `waitCause`. Ejerskab fortæller, hvem der holder bolden.
Årsagen fortæller, hvorfor den ligger stille, og det er årsagen, der afgør, hvad man kan gøre ved
det. De fem årsager (`calendar`, `decision`, `delivery`, `priority`, `technical`) vises som
kalender, beslutning, leverance, prioritering og teknisk, og hver har et modtræk og et
besparelsesinterval i `WAIT_CAUSES`. Fire af de fem er menneskelige. Det giver nøgletallet
**menneskelig ventetid**.

**Uoplyst er en egen tilstand.** `waitCause: null` betyder, at brugeren ikke har svaret, og det
falder aldrig tilbage på en standardværdi. Uoplyst ventetid tælles hverken som menneskelig eller
teknisk, den vises som et stribet felt i bjælken, den holdes uden for potentialeberegningen, og en
forsinkelse uden årsag får en opfordring i stedet for et lånt modtræk. Værktøjet gætter ikke på
brugerens vegne.

### Afrundingsreglen

Beregnede tal må have én decimal. Skøn må ikke: de vises som hele dage eller som et interval. `fmt`
er til beregnede tal, `fmtEstimate` og `fmtEstimateRange` til skøn. Et skøn, der ser præcist ud,
lover mere, end det kan holde.

### Skøn

- **Potentialet** (`computeImprovement`) tager de tre største forsinkelser og anvender
  besparelsesintervallet for hver årsag. Resultatet er et interval, ikke et tal.
- **Kundens udgangspunkt** lægger en multiplikator (0,8 til 2,0 ud fra en score på 0-10) på
  **kun** kundens ventetid. Kundens medarbejderliste eller arbejdstilrettelæggelse påvirker ikke,
  hvor hurtigt VideoVicers eget team arbejder. Hvert svar, der trækker ned, giver et modtræk.
- **Fra adgang til gennemført kursus** er brugerens eget skøn over, hvor mange dage der går fra det
  første hold er færdigt, til hovedparten af kundens medarbejdere er det. Det lægges oven i
  time-to-value og tegnes som en stiplet zone på tidslinjen fra det første certifikat.
- **De første 90 dage** (`FirstNinetyDays`) er tre handlinger, jeg selv har skrevet. Ventedagene ved
  siden af dem er ikke skrevet ind: de slås op på årsag (`waitByCauses`) i det forløb, der står på
  siden, så de følger med, hvis forløbet rettes.

### Værdiøjeblikket

Stjernen står ved trin 7, første hold gennemfører kursus og quiz, og ikke ved opsætningen. For
VideoVicer er værdien ikke, at platformen er sat op, men at de første medarbejdere har gennemført et
kursus og fået et certifikat.

## Eksemplets tal

Eksemplet er mit bud på forløbet fra underskrift til første certifikat. Det giver:

| Nøgletal | Værdi |
| --- | --- |
| Gennemløbstid | 27,8 dage |
| Arbejdstid | 21 timer (2,8 dage) |
| Ventetid | 25 dage |
| Flow-effektivitet | 10,2 % |
| Time-to-value (første certifikat) | 22,6 dage |
| Overleveringer | 6 |
| Menneskelig ventetid | 92,0 % (23 af 25 ventedage; 2 er teknisk) |

De tre største forsinkelser er trin 7 (7 dage, prioritering, 25 % af forløbet), trin 8 (5 dage,
kalender, 18 %) og trin 2 (4 dage, leverance, 14 %). Håndteres de tre, lander forløbet på cirka
**19-22 dage** frem for 27,8, og flow-effektiviteten stiger til cirka **13-15 %**. Med kundens
udgangspunkt stillet på midten af alle fem spørgsmål er det realistiske skøn **30-37 dage**.

## Deling og lagring

- **localStorage** gemmer arbejdet, så en genindlæsning ikke koster noget. Er det slået fra, kører
  siden videre uden.
- **Lagernøglen er unik** (`videovicer-onboarding-analyse/v1`). GitHub Pages serverer alle en kontos
  projekter fra samme origin og dermed samme localStorage, så en fælles nøgle ville lade to sider
  læse og overskrive hinandens gemte arbejde.
- **Deling** koder hele forløbet ind i URL'ens hash som base64. Intet forlader browseren. Så snart
  man retter noget efter at have delt, fjernes hashen igen: adressen må ikke beskrive en tilstand,
  der ikke længere gælder.
- Alt i et link eller i lageret, som siden ikke genkender, sættes tilbage til en sikker værdi frem
  for at blive stolet på: en ukendt ejer bliver VideoVicer, en ukendt årsag forbliver uoplyst, og
  svar, der ikke passer til spørgsmålene, falder tilbage på midten.

## Udgivelse

```bash
npm run deploy
```

Bygger og skubber `dist/` til `gh-pages`-grenen.

## Bevidste fravalg

Ingen brugerkonti, ingen skabeloner, ingen AI-integration, ingen sammenligning af flere forløb og
ingen omkostningsberegning. Intet VideoVicer-logo: siden skal ligne min analyse af dem, ikke deres
produkt. PDF-eksport går gennem browserens egen udskrivning (`window.print()` og et
print-stylesheet) frem for et tredjepartsbibliotek.

Lavet af Omar Slaiman · omar.slaiman7@gmail.com · +45 50 62 09 49
