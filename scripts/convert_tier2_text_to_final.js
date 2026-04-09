const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const k = args[i];
    const v = args[i + 1];
    if (k && k.startsWith("--") && v) out[k.slice(2)] = v;
  }
  if (!out.input || !out.quantOut || !out.reasoningOut) {
    console.error(
      "Usage: node scripts/convert_tier2_text_to_final.js --input <txt> --quantOut <json> --reasoningOut <json>"
    );
    process.exit(1);
  }
  return out;
}

function normalize(s) {
  return String(s || "")
    .replace(/\r/g, "")
    .replace(/\f/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
}

function fix(s) {
  let t = normalize(s);
  const reps = [
    ["â€˜", "'"],
    ["â€™", "'"],
    ["â€œ", '"'],
    ["â€�", '"'],
    ["â€“", "-"],
    ["â€”", "-"],
    ["âˆ’", "-"],
    ["Ã—", "x"],
    ["Ã·", "/"],
    ["â‚¹", "Rs "],
    ["₹", "Rs "],
    ["Â°", "°"],
    ["Ã", ""],
    ["Â", ""],
  ];
  for (const [a, b] of reps) t = t.split(a).join(b);
  return t.trim();
}

function cleanOptionText(s) {
  const t = fix(s).replace(/^Ans\s*/i, "").trim();
  return t || "[IMAGE]";
}

function getShiftInfo(text) {
  const dateMatch = text.match(/Exam Date\s+(\d{2})\/(\d{2})\/(\d{4})/i);
  const timeMatch = text.match(/Exam Time\s+([0-9:\sAPM\-]+)/i);

  const dd = dateMatch ? dateMatch[1] : "20";
  const mm = dateMatch ? dateMatch[2] : "01";
  const yyyy = dateMatch ? dateMatch[3] : "2025";
  const time = timeMatch ? normalize(timeMatch[1]) : "9:00 AM - 12:00 PM";

  const token = "9am";

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

function inferPattern(subject, text) {
  const t = String(text || "").toLowerCase();
  if (subject === "QUANT") {
    if (/simple interest|compound interest|principal|rate/.test(t)) return "simple_interest";
    if (/ratio|proportion/.test(t)) return "ratio_proportion";
    if (/average/.test(t)) return "average";
    if (/speed|distance|track|train|boat|stream/.test(t)) return "speed_distance_time";
    if (/circle|triangle|angle|chord|radius|diameter|perimeter/.test(t)) return "geometry";
    if (/volume|cylinder|cone|sphere|cuboid/.test(t)) return "mensuration_3d";
    if (/profit|loss|discount|selling price|cost price/.test(t)) return "profit_loss";
    if (/alligation|mixture/.test(t)) return "mixture_alligation";
    if (/equation|linear|quadratic|algebra/.test(t)) return "algebra";
    if (/table|bar graph|pie chart|data/.test(t)) return "data_interpretation";
    if (/pipe|cistern/.test(t)) return "pipes_cistern";
    if (/time.*work|work.*time/.test(t)) return "time_work";
    if (/hcf|lcm|divisible|number/.test(t)) return "number_system";
    if (/trigonometry|sin|cos|tan/.test(t)) return "trigonometry";
    if (/percentage/.test(t)) return "percentage";
    return "algebra";
  }

  if (/series/.test(t)) return "series";
  if (/coding|code language/.test(t)) return "coding_decoding";
  if (/statement|conclusion|syllogism/.test(t)) return "syllogism";
  if (/analogy|related/.test(t)) return "analogy";
  if (/blood relation|father|mother|brother|sister|wife|son|daughter/.test(t)) return "blood_relations";
  if (/calendar|day|date|clock/.test(t)) return "clock_calendar";
  if (/embedded|mirror|paper folding|figure/.test(t)) return "classification";
  if (/arrangement|seating|ranking|order/.test(t)) return "sitting_arrangement";
  if (/venn/.test(t)) return "venn_diagram";
  if (/matrix/.test(t)) return "matrix";
  if (/operation|interchange/.test(t)) return "mathematical_operation";
  if (/odd|different|not belong/.test(t)) return "classification";
  return "classification";
}

function pickDifficulty(text) {
  const t = fix(text);
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
  return `**Step 1:** Identify the core concept used in this question.\n**Step 2:** Apply the required formula/logical rule and simplify.\n**Step 3:** Match the result with the keyed option from the source.\n**Answer:** Option ${opt}${optText ? ` (${optText})` : ""}.`;
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
    let qText = fix(qLead.slice(0, ansIdx).replace(/\bAns\s*$/i, ""));
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
      pattern: inferPattern(subject, qText),
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
  const args = parseArgs();
  const raw = fs.readFileSync(path.resolve(args.input), "utf8");
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

  fs.writeFileSync(path.resolve(args.quantOut), JSON.stringify(quant, null, 2) + "\n");
  fs.writeFileSync(path.resolve(args.reasoningOut), JSON.stringify(reasoning, null, 2) + "\n");

  const quantUnanswered = quant.filter((q) => !q.correct_option).length;
  const reasoningUnanswered = reasoning.filter((q) => !q.correct_option).length;

  console.log(`Wrote ${args.quantOut} (${quant.length} questions, ${quantUnanswered} without chosen option)`);
  console.log(`Wrote ${args.reasoningOut} (${reasoning.length} questions, ${reasoningUnanswered} without chosen option)`);
}

main();
