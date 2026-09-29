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
const L = FI ? { profile: 'Tutkijaprofiili', interests: 'Tutkimusintressit', orcid: 'ORCID' }
             : { profile: 'Research Profile', interests: 'Research Interests', orcid: 'ORCID' };
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
