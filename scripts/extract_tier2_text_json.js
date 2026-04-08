const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(
  __dirname,
  "..",
  "..",
  "docs",
  "PYQs",
  "SSC",
  "CGL",
  "2024",
  "converted_text_18_01_2024.txt"
);

const outputDir = path.resolve(__dirname, "..", "Jsons", "questions", "2024");

function normalize(s) {
  return (s || "")
    .replace(/\r/g, "")
    .replace(/\f/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
}

function cleanOptionText(s) {
  const t = normalize(s).replace(/^Ans\s*/i, "").trim();
  return t || "[IMAGE]";
}

function getShiftInfo(text) {
  const dateMatch = text.match(/Exam Date\s+(\d{2})\/(\d{2})\/(\d{4})/i);
  const timeMatch = text.match(/Exam Time\s+([0-9:\sAPM\-]+)/i);

  const dd = dateMatch ? dateMatch[1] : "18";
  const mm = dateMatch ? dateMatch[2] : "01";
  const yyyy = dateMatch ? dateMatch[3] : "2025";
  const time = timeMatch ? normalize(timeMatch[1]) : "9:00 AM - 12:00 PM";

  let token = "9am";
  const start = time.toLowerCase().split("-")[0]?.trim() || "";
  if (start.startsWith("12:30")) token = "12_30pm";
  if (start.startsWith("4:00")) token = "4pm";

  return {
    dd,
    mm,
    yyyy,
    token,
    shift: `Tier 2 - ${dd}.${mm}.${yyyy} ${time}`,
  };
}

function sectionSlice(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return "";
  const rest = text.slice(start + startMarker.length);
  const end = rest.indexOf(endMarker);
  return end === -1 ? rest : rest.slice(0, end);
}

function pickPattern(subject, text) {
  const t = (text || "").toLowerCase();
  if (subject === "QUANT") {
    if (/simple interest|compound interest|principal|rate/.test(t)) return "simple_interest";
    if (/ratio|proportion/.test(t)) return "ratio_proportion";
    if (/average/.test(t)) return "average";
    if (/probability/.test(t)) return "probability";
    if (/speed|distance|track|train|time/.test(t)) return "time_speed_distance";
    if (/circle|triangle|angle|chord|radius|diameter|perimeter|area/.test(t)) return "geometry";
    if (/volume|cylinder|cone|sphere|cuboid/.test(t)) return "mensuration_3d";
    if (/profit|loss|discount|selling price|cost price/.test(t)) return "profit_and_loss";
    if (/alligation|mixture/.test(t)) return "alligation";
    if (/equation|linear|quadratic|algebra/.test(t)) return "algebra";
    if (/table|bar graph|pie chart|data/.test(t)) return "data_interpretation";
    return "arithmetic";
  }
  if (/series/.test(t)) return "series";
  if (/coding|code language/.test(t)) return "coding_decoding";
  if (/syllogism|conclusion|statement/.test(t)) return "syllogism";
  if (/analogy/.test(t)) return "analogy";
  if (/blood relation|father|mother|brother|sister|wife|son|daughter/.test(t)) return "blood_relations";
  if (/calendar|day|date/.test(t)) return "calendar";
  if (/clock/.test(t)) return "clock";
  if (/embedded|mirror|paper folding|figure|triangle|square/.test(t)) return "non_verbal_reasoning";
  if (/arrangement|seating|ranking|order/.test(t)) return "arrangement";
  return "logical_reasoning";
}

function pickDifficulty(text) {
  const t = normalize(text);
  if (!t || t === "[IMAGE]" || t.length > 230) return "HARD";
  if (t.length > 120) return "MEDIUM";
  return "EASY";
}

function chosenToOption(chosen) {
  if (chosen === "1") return "A";
  if (chosen === "2") return "B";
  if (chosen === "3") return "C";
  if (chosen === "4") return "D";
  return "";
}

function solutionFor(q) {
  const opt = q.correct_option;
  const optText = q.options.find((o) => o.id === opt)?.text || "";
  if (!opt) {
    return "**Step 1:** Source entry has no selected option in the PDF (`Chosen Option: --`).\n**Step 2:** Validate this question against the official answer key before import.\n**Step 3:** Keep this row in review state until the correct option is confirmed.\n**Answer:** Option [TO_VERIFY].";
  }
  return `**Step 1:** Identify the key concept from the question and simplify the given information.\n**Step 2:** Evaluate options using elimination/standard formula logic for this topic.\n**Step 3:** Match the derived result with the keyed choice from the source.\n**Answer:** Option ${opt}${optText ? ` (${optText})` : ""}.`;
}

function extractQuestions(sectionText, subject, shift) {
  const text = sectionText.replace(/\f/g, "\n");
  const qRegex = /(?:^|\n)\s*Q\.(\d+)\s+/g;
  const matches = [...text.matchAll(qRegex)];
  const out = [];

  for (let i = 0; i < matches.length; i++) {
    const qNo = Number(matches[i][1]);
    const start = matches[i].index || 0;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const block = text.slice(start, end);

    const ansIdx = block.indexOf("Ans");
    if (ansIdx === -1) continue;

    const qLead = block.replace(/^\s*Q\.\d+\s+/, "");
    let qText = normalize(qLead.slice(0, ansIdx).replace(/\bAns\s*$/i, ""));
    if (!qText || qText.length < 8 || /^Ans\s*\d*\.?/i.test(qText)) qText = "[IMAGE]";

    const chosenMatch = block.match(/Chosen Option\s*:\s*(\d+|--)/i);
    const chosen = chosenMatch ? chosenMatch[1] : "--";
    const correct = chosenToOption(chosen);

    const ansToMeta = block
      .slice(ansIdx)
      .split(/Question ID\s*:/i)[0]
      .split(/Status\s*:/i)[0]
      .split(/Chosen Option\s*:/i)[0];

    const optMatch = ansToMeta.match(
      /1\.\s*([\s\S]*?)\n\s*2\.\s*([\s\S]*?)\n\s*3\.\s*([\s\S]*?)\n\s*4\.\s*([\s\S]*)$/s
    );

    let o1 = "[IMAGE]";
    let o2 = "[IMAGE]";
    let o3 = "[IMAGE]";
    let o4 = "[IMAGE]";

    if (optMatch) {
      o1 = cleanOptionText(optMatch[1]);
      o2 = cleanOptionText(optMatch[2]);
      o3 = cleanOptionText(optMatch[3]);
      o4 = cleanOptionText(optMatch[4]);
    }

    const item = {
      text: qText,
      image: "",
      options: [
        { id: "A", text: o1, image: "" },
        { id: "B", text: o2, image: "" },
        { id: "C", text: o3, image: "" },
        { id: "D", text: o4, image: "" },
      ],
      correct_option: correct,
      solution: "",
      subject,
      pattern: pickPattern(subject, qText),
      difficulty: pickDifficulty(qText),
      source: {
        exam: "SSC CGL 2024",
        year: 2024,
        shift,
      },
      stats: {
        attempt_count: 0,
        accuracy_rate: 0,
        avg_time_ms: 0,
      },
      is_live: false,
      needs_review: true,
    };
    item.solution = solutionFor(item);
    out.push({ qNo, item });
  }

  out.sort((a, b) => a.qNo - b.qNo);
  return out.map((x) => x.item);
}

function main() {
  const raw = fs.readFileSync(inputPath, "utf8");
  const shiftInfo = getShiftInfo(raw);

  const mathSection = sectionSlice(
    raw,
    "Section : Module I Mathematical Abilities",
    "Section : Module II Reasoning and General Intelligence"
  );
  const reasoningSection = sectionSlice(
    raw,
    "Section : Module II Reasoning and General Intelligence",
    "Section : Module I English Language and Comprehension"
  );

  const quant = extractQuestions(mathSection, "QUANT", shiftInfo.shift);
  const reasoning = extractQuestions(reasoningSection, "REASONING", shiftInfo.shift);

  const quantFile = `ssc_cgl_quant_${shiftInfo.dd}_${shiftInfo.mm}_${shiftInfo.yyyy}_${shiftInfo.token}.json`;
  const reasoningFile = `ssc_cgl_reasoning_${shiftInfo.dd}_${shiftInfo.mm}_${shiftInfo.yyyy}_${shiftInfo.token}.json`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, quantFile), JSON.stringify(quant, null, 2));
  fs.writeFileSync(path.join(outputDir, reasoningFile), JSON.stringify(reasoning, null, 2));

  const quantUnanswered = quant.filter((q) => !q.correct_option).length;
  const reasoningUnanswered = reasoning.filter((q) => !q.correct_option).length;

  console.log(`Wrote ${quantFile} (${quant.length} questions, ${quantUnanswered} without chosen option)`);
  console.log(`Wrote ${reasoningFile} (${reasoning.length} questions, ${reasoningUnanswered} without chosen option)`);
}

main();
