---
name: finland-academic-cv
description: Build or rewrite an academic or researcher CV for Finnish universities and research funders (doctoral programmes, postdoc and research posts, Research Council of Finland) as Word + PDF, following the TENK researcher CV template, with every bullet written to support the person's research profile and interests. Use when someone asks for an academic CV, researcher CV, PhD or doctoral application CV, or TENK CV for Finland.
---

# Academic CV for Finland (TENK-based, Word + PDF)

For academic applications in Finland: doctoral programmes, doctoral researcher, postdoc and research posts, and funding calls. For industry jobs use the `finland-cv` skill instead. Output: `Firstname_Lastname_Academic_CV.docx` (editable) and `.pdf` (to send).

## The core idea: every line serves the research profile

An academic CV is not a job CV. Do not split roles into Responsibilities and Results. The Research Profile and Research Interests at the top are the anchor, and every bullet below (thesis, research projects, work roles, teaching) should show how that experience builds toward them: what was studied, how, and what insight it gave that feeds the research agenda.

## Workflow

1. **Gather content.** Extract an attached CV: `pandoc -t plain --wrap=none cv.docx` or `pdftotext -layout cv.pdf -`; get links from a .docx with `unzip -p cv.docx word/_rels/document.xml.rels | grep -o 'Target="http[^"]*"'`. Ask for, but do not wait on: the target (programme, position or funder, ideally the call text), ORCID iD, thesis findings, full publication list, and anything the call requires (page limit, language, template).
2. **Build the anchor before writing any bullet.** From the person's profile, note (for yourself, not in the CV): their research questions, key concepts and theories, methods, and domain or population. If there is no profile, draft one only from their own material, in their words where possible, and ask them to confirm it. Profile: 3-5 sentences. Research Interests: 3-5 short bullets taken from the profile.
3. **Write aligned bullets.** For each research item (thesis, projects, research roles), write 2-3 bullets following **Question -> Approach -> Insight**:
   - **Question:** what was studied, named in the profile's vocabulary where truthful. If the thesis modelled motivation and the profile is about motivation, say "motivation" explicitly.
   - **Approach:** design, theory, sample sizes, methods, tools, with the numbers the person gave.
   - **Insight:** what they found or learned, and how it connects to a stated research interest.
   - Job-CV style (avoid): "Responsible for data collection and analysis for the thesis."
   - Aligned (use): "Interviewed 24 nurses on workarounds in electronic health records (thematic analysis); found that workarounds protect professional autonomy, the theme my doctoral interest in clinicians' agency builds on."
   - **Work roles:** recent or relevant roles get 1-3 bullets on the aspect that grounds the research (practice experience, domain knowledge, data or field access, methods used). Older unrelated roles get title, dates, employer and a one-line italic `description`, no bullets. Where a real link exists (e.g. an employer was later the thesis case company), state it.
   - **Teaching, supervision, reviewing, service:** brief and factual; link to the research area when true.
4. **Honesty guardrails.** TENK notes that misrepresenting merits can be investigated as research misconduct, so:
   - Never invent findings, publications, peer-review status, funding, citations, impact or dates. If a finding would strengthen a bullet but the person did not give one, ask for it.
   - Never upgrade status: a master's thesis is not a peer-reviewed article; label preprints, "submitted" and "under review" as such.
   - A connection sentence ("..., relevant to my interest in X") may only link a real construct, method or observation to an interest the profile states. List every such sentence in your delivery message so the person can check it.
   - Keep the person's own wording in the profile; Finnish readers dislike AI-sounding text.
5. **Structure.** Header: name alone on the first line (never "Name, PhD"), headline with degree/field, town, phone, email, ORCID, LinkedIn/website, CV date. No date of birth, ID number, photo or marital status. Then Research Profile, Research Interests, then the TENK sections in this order, omitting empty ones:

   | # | English heading | Finnish heading |
   |---|---|---|
   | 2 | Degrees | Tutkinnot |
   | 3 | Other Education and Expertise | Muu koulutus ja osaaminen |
   | 4 | Language Skills | Kielitaito |
   | 5 | Current Employment | Nykyinen työtehtävä |
   | 6 | Previous Work Experience | Aiempi työkokemus |
   | 7 | Career Breaks (optional) | Tutkijanuran katkokset |
   | 8 | Research Funding and Grants | Tutkimusrahoitus ja apurahat |
   | 9 | Research Output | Tutkimustuotokset |
   | 10 | Research Supervision and Leadership | Tutkimuksen ohjaus- ja johtamistehtävät |
   | 11 | Teaching Merits | Opetusansiot |
   | 12 | Awards and Honours | Palkinnot ja kunnianosoitukset |
   | 13 | Other Key Academic Merits | Muut keskeiset akateemiset ansiot |
   | 14 | Scientific and Societal Impact | Tieteellinen ja yhteiskunnallinen vaikuttavuus |
   | 15 | Other Merits | Muut ansiot |

   Early-career applicants (doctoral, recent master's) may add **Research Experience** (Tutkimuskokemus) and move it and Research Output right after Degrees, and may add **Research Methods and Tools** (Tutkimusmenetelmät ja työkalut) near the end. If the call is in Finnish, check the headings against TENK's Finnish template. Follow the call's own instructions whenever they differ.
6. **Degrees:** most recent first; degree, major, institution, city, country, dates; the thesis title as the `description`. Put thesis research details under Research Experience, not in both places.
7. **Research Output:** numbered, newest first, one consistent citation style (APA 7 unless the call says otherwise), with DOI or open-access links. Group by type when there are many (peer-reviewed journal articles, conference papers, theses, other). Add Finnish Ministry of Education and Culture publication type codes (e.g. A1 journal article, A4 conference article, G2 master's thesis) only if the call asks. For senior researchers, TENK asks for the total count and the ten most important publications.
8. **Length:** doctoral applicants 2 pages; postdoc and senior researchers 2-4 pages, or the call's limit.
9. **Build:**
   ```bash
   # docx (npm) is usually preinstalled; if require fails: npm install docx
   node build_academic_cv.js cv.json Firstname_Lastname_Academic_CV.docx
   soffice --headless --convert-to pdf Firstname_Lastname_Academic_CV.docx
   ```
   Use `scripts/build_academic_cv.js` next to this file if present; otherwise save the script from the "Build script" section below first.
10. **Verify:**
    - `pdfinfo ... | grep Pages` is within the limit.
    - `pdftotext -layout ... - | head -40`: the first line is exactly the name, sections in order, dates on the same line as titles, no garbled characters.
    - `pdftoppm -png -r 70 ... page`, then look at every page for bad breaks.
    - **Alignment check:** for every bullet, name the research interest or core method it supports. A bullet that supports none gets shortened, moved to Other Merits, or turned into a one-line description. Never delete a merit without asking.
11. **Deliver** the .docx and .pdf, then briefly: what changed; the connection sentences to verify; questions for what is missing (ORCID, thesis findings, start dates, sample sizes, participants, citations, funding amounts).

## cv.json schema

```json
{
  "lang": "en",                     // "en" or "fi" (Finnish labels for profile, interests, CV date)
  "accent": "1F3F6E",               // optional hex colour
  "name": "First Last",
  "headline": "Degree  |  Research field",
  "contact": { "location": "Espoo, Finland", "phone": "+358 ...", "email": "...", "orcid": "0000-0000-0000-0000",
               "linkedin": "https://www.linkedin.com/in/...", "website": "https://..." },
  "cvDate": "29 September 2026",
  "profile": "3-5 sentences, in the person's own words where possible",
  "researchInterests": ["Interest one", "Interest two"],
  "sections": [
    { "heading": "Degrees",
      "entries": [ { "title": "MSc, Field", "dates": "2016 – 2020", "org": "University, City, Country", "description": "Thesis: ..." } ] },
    { "heading": "Research Experience",
      "entries": [ { "title": "...", "dates": "...", "org": "...", "description": "optional", "bullets": ["Question...", "Approach...", "Insight..."] } ] },
    { "heading": "Research Output", "numbered": ["Author, A. (Year). Title. Venue. https://doi.org/..."] },
    { "heading": "Language Skills", "lines": ["Finnish – native  |  English – C1"] },
    { "heading": "Research Methods and Tools", "labeled": [ { "label": "Quantitative", "text": "..." } ] }
  ],
  "margins": { "top": 750, "bottom": 650, "left": 1000, "right": 1000 }
}
```
(Comments are explanation only; real JSON must not contain them.) Sections render in the order listed. Each section may use `intro`, `entries`, `labeled`, `lines`, `bullets` and `numbered`; empty sections are skipped.

## Build script

Save as `build_academic_cv.js` if `scripts/build_academic_cv.js` is not available:

```javascript
// Usage: node build_academic_cv.js cv.json [output.docx]
// Academic CV for Finland (TENK-style order), Word output. Pair with: soffice --headless --convert-to pdf output.docx
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, LevelFormat,
  BorderStyle, Tab, TabStopType } = require('docx');

const cv = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3] || 'Academic_CV.docx';
const M = cv.margins || { top: 750, bottom: 650, left: 1000, right: 1000 }; // DXA; A4 width is 11906
const ACCENT = (cv.accent || '1F3F6E').replace('#', ''), GREY = '555555', B = 20; // 10pt body
const FI = cv.lang === 'fi';
const L = FI ? { profile: 'Tutkijaprofiili', interests: 'Tutkimusintressit', cvdate: 'CV päivitetty', orcid: 'ORCID' }
             : { profile: 'Research Profile', interests: 'Research Interests', cvdate: 'CV date', orcid: 'ORCID' };
const RIGHT = 11906 - M.left - M.right;

const heading = (t) => new Paragraph({ keepNext: true, spacing: { before: 140, after: 50 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 2 } },
  children: [new TextRun({ text: t.toUpperCase(), bold: true, color: ACCENT, size: 23, characterSpacing: 10 })] });
const para = (t, o = {}) => new Paragraph({ spacing: { after: 40, line: 250 }, children: [new TextRun({ text: t, size: B, ...o })] });
const bullet = (t) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 20, line: 245 }, children: [new TextRun({ text: t, size: B })] });
const numbered = (t, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 30, line: 245 }, children: [new TextRun({ text: t, size: B })] });
const labelLine = (k, v) => new Paragraph({ spacing: { after: 40, line: 250 }, children: [new TextRun({ text: k + ': ', bold: true, size: B }), new TextRun({ text: v, size: B })] });
const entry = (e) => {
  const r = [
    new Paragraph({ keepNext: true, tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }], spacing: { before: 80, after: 0 }, children: [
      new TextRun({ text: e.title, bold: true, size: 21 }), new TextRun({ children: [new Tab()] }), new TextRun({ text: e.dates || '', bold: true, size: 21 })] }),
  ];
  if (e.org) r.push(new Paragraph({ keepNext: !!(e.description || e.bullets?.length), spacing: { after: e.description ? 10 : 30 }, children: [new TextRun({ text: e.org, color: GREY, size: B })] }));
  if (e.description) r.push(new Paragraph({ keepNext: !!e.bullets?.length, spacing: { after: 30 }, children: [new TextRun({ text: e.description, italics: true, size: B })] }));
  (e.bullets || []).forEach(t => r.push(bullet(t)));
  return r;
};
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, size: B, color: ACCENT })] });
const strip = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const sep = () => new TextRun({ text: '  |  ', size: B });

// Header
const c = cv.contact || {};
const line1 = [], line2 = [];
[c.location, c.phone].filter(Boolean).forEach(t => { if (line1.length) line1.push(sep()); line1.push(new TextRun({ text: t, size: B })); });
if (c.email) { if (line1.length) line1.push(sep()); line1.push(link(c.email, 'mailto:' + c.email)); }
if (c.orcid) { const id = c.orcid.replace(/^https?:\/\/orcid\.org\//, ''); line2.push(new TextRun({ text: L.orcid + ' ', size: B, bold: true })); line2.push(link(id, 'https://orcid.org/' + id)); }
[c.linkedin, c.website].filter(Boolean).forEach(u => { if (line2.length) line2.push(sep()); line2.push(link(strip(u), u)); });

const ch = [new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.name, bold: true, size: 40, color: ACCENT })] })];
if (cv.headline) ch.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: cv.headline, size: 24, bold: true, color: GREY })] }));
if (line1.length) ch.push(new Paragraph({ spacing: { after: 20 }, children: line1 }));
if (line2.length) ch.push(new Paragraph({ spacing: { after: 20 }, children: line2 }));
if (cv.cvDate) ch.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: L.cvdate + ': ' + cv.cvDate, size: 18, color: GREY })] }));

if (cv.profile) { ch.push(heading(L.profile)); ch.push(para(cv.profile)); }
if (cv.researchInterests?.length) { ch.push(heading(L.interests)); cv.researchInterests.forEach(t => ch.push(bullet(t))); }

// Sections: rendered in the order given
let numRefs = [];
(cv.sections || []).forEach((s, i) => {
  if (!(s.entries?.length || s.bullets?.length || s.lines?.length || s.numbered?.length || s.labeled?.length || s.intro)) return;
  ch.push(heading(s.heading));
  if (s.intro) ch.push(para(s.intro, { italics: true }));
  (s.entries || []).forEach(e => ch.push(...entry(e)));
  (s.labeled || []).forEach(x => ch.push(labelLine(x.label, x.text)));
  (s.lines || []).forEach(t => ch.push(para(t)));
  (s.bullets || []).forEach(t => ch.push(bullet(t)));
  if (s.numbered?.length) { const ref = 'n' + i; numRefs.push(ref); s.numbered.forEach(t => ch.push(numbered(t, ref))); }
});

const numberingConfig = [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: 300, hanging: 220 } } } }] }]
  .concat(numRefs.map(r => ({ reference: r, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '[%1]', alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: 420, hanging: 420 } } } }] })));

const doc = new Document({
  creator: cv.name, title: cv.name + ' CV',
  styles: { default: { document: { run: { font: 'Calibri', size: B } } } },
  numbering: { config: numberingConfig },
  sections: [{ properties: { page: { margin: M } }, children: ch }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('wrote ' + out); });
```
