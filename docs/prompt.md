# SSC CGL Question Extraction Prompt for AI Agents

## Your Task
Extract all questions from the provided SSC CGL exam PDF and convert them into JSON format following the exact schema and quality standards demonstrated in the reference files.

---

## Reference Files Provided
You will receive these files as examples:
1. `ssc_cgl_quant_26_09_2024_12_30pm.json` - Quantitative Aptitude questions reference
2. `ssc_cgl_reasoning_26_09_2024_12_30pm.json` - Reasoning questions reference
3. `patterns_seed_data.json` - Complete list of 43 patterns with codes

**STUDY THESE FILES CAREFULLY** before starting extraction!

---

## JSON Schema Structure

```json
{
  "text": "Question text with [IMAGE] placeholder where images go",
  "image": "",
  "options": [
    {
      "id": "A",
      "text": "Option text",
      "image": ""
    },
    {
      "id": "B",
      "text": "Option text",
      "image": ""
    },
    {
      "id": "C",
      "text": "Option text",
      "image": ""
    },
    {
      "id": "D",
      "text": "Option text",
      "image": ""
    }
  ],
  "correct_option": "A",
  "solution": "Step-by-step solution with LaTeX for math",
  "subject": "QUANT" or "REASONING",
  "pattern": "pattern_code_from_patterns_json",
  "difficulty": "EASY" or "MEDIUM" or "HARD",
  "source": {
    "exam": "SSC CGL 2024",
    "year": 2024,
    "shift": "Tier 1 - DD.MM.YYYY HH:MM AM/PM - HH:MM AM/PM"
  },
  "stats": {
    "attempt_count": 0,
    "accuracy_rate": 0,
    "avg_time_ms": 0
  },
  "is_live": false,
  "needs_review": true
}
```

---

## Critical Rules - READ CAREFULLY

### 1. **TEXT FORMATTING**

#### LaTeX for Mathematics:
- Use `$...$` for inline math: `$x^2 + 5$`
- Use `$$...$$` for display math (on separate lines)
- Common LaTeX commands:
  - Fractions: `$\frac{numerator}{denominator}$`
  - Square root: `$\sqrt{x}$`
  - Powers: `$x^2$`, `$x^{10}$`
  - Subscripts: `$x_1$`, `$x_{10}$`
  - Greek letters: `$\alpha$`, `$\beta$`, `$\theta$`, `$\pi$`
  - Trigonometry: `$\sin\theta$`, `$\cos\theta$`, `$\tan\theta$`
  - Inequalities: `$\geq$`, `$\leq$`, `$\neq$`
  - Angle: `$\angle ABC$`
  - Triangle: `$\triangle ABC$`
  - Parallel: `$\parallel$`
  - Degree: `$30°$` or `30°`

**Example:**
```
"text": "If $8\cot\theta = 7$, find $\frac{1 + \sin\theta}{\cos\theta}$"
```

#### Images:
- Insert `[IMAGE]` exactly where the image appears in the question
- Leave `"image": ""` field empty (will be filled later via admin)
- Add `[IMAGE]` for graphs, diagrams, figures, tables, matrices, etc.

**Example:**
```
"text": "Study the bar graph below:\n\n[IMAGE]\n\nWhat is the average value?"
```

### 2. **SOLUTIONS - MOST IMPORTANT**

#### Quality Standards:
✅ **Write solutions that are:**
- **Step-by-step** with clear progression
- **Easy to understand** for students preparing for exams
- **Detailed** with reasoning for each step
- **Using proper mathematical notation** with LaTeX

❌ **Do NOT:**
- Skip steps or assume knowledge
- Use complex jargon without explanation
- Write one-line solutions
- Forget to verify the answer

#### Solution Template:

```
"solution": "**Given:** [State what's given]

**Step 1:** [Clear description of first step]
$$[Mathematical work if needed]$$
[Explanation in simple words]

**Step 2:** [Next step with reasoning]
$$[Calculations]$$
[Why we did this]

**Step 3:** [Continue...]

**Verification:** [Check the answer]
$$[Verify calculation]$$ ✓

**Answer:** Option [Letter] ([Value])"
```

#### Real Example from Reference:
```json
"solution": "**Given:**\n- Marked Price (MP) = ₹15,620\n- Discount = 27%\n\n**Step 1:** Calculate discount amount\n$$\\text{Discount amount} = \\frac{27}{100} \\times 15,620$$\n$$= 0.27 \\times 15,620 = 4,217.4$$\n\n**Step 2:** Calculate selling price\n$$\\text{Selling Price} = \\text{Marked Price} - \\text{Discount}$$\n$$= 15,620 - 4,217.4 = 11,402.6$$\n\n**Alternative method:** Using percentage formula\n$$\\text{Selling Price} = \\text{MP} \\times \\frac{(100 - \\text{Discount}\\%)}{100}$$\n$$= 15,620 \\times \\frac{73}{100} = 11,402.6$$\n\n**Step 3:** Round to nearest tens\n$$11,402.6 \\approx 11,400$$\n\n**Answer:** Option A (₹11,400)"
```

### 3. **PATTERN MAPPING**

**CRITICAL:** Use the `patterns_seed_data.json` file to map questions to the correct pattern code.

#### Pattern Codes (43 total):

**QUANT Patterns (24):**
- `number_system` - Divisibility, LCM, HCF, prime numbers
- `simplification` - BODMAS, 'of' means multiplication
- `percentage` - Percent increase/decrease, ratios
- `ratio_proportion` - Direct/inverse proportion, ratio problems
- `average` - Mean, weighted average
- `profit_loss` - CP, SP, profit%, loss%, discount
- `simple_interest` - SI = PRT/100
- `compound_interest` - CI calculations
- `time_work` - Work rates, efficiency
- `speed_distance_time` - Relative speed, average speed
- `mixture_alligation` - Mixing liquids, alligation rule
- `algebra` - Linear equations, quadratic, identities
- `power_indices` - Surds, exponents, roots
- `trigonometry` - Ratios, identities, heights & distances
- `geometry` - Triangles, circles, angles, parallel lines
- `mensuration_2d` - Area, perimeter of 2D shapes
- `mensuration_3d` - Volume, surface area of 3D shapes
- `data_interpretation` - Tables, bar graphs, pie charts
- `coordinate_geometry` - Points, lines, distance
- `set_theory` - Venn diagrams, unions, intersections
- `permutation_combination` - nPr, nCr
- `probability` - Basic probability, events
- `statistics` - Mean, median, mode, variance
- `logical_sequence` - Number patterns

**REASONING Patterns (19):**
- `analogy` - Word/number relationships
- `classification` - Odd one out
- `series` - Letter/number sequences
- `coding_decoding` - Pattern-based coding
- `blood_relation` - Family relationships
- `direction_sense` - Direction problems
- `ranking_arrangement` - Linear/circular seating
- `syllogism` - Logical deduction
- `statement_conclusion` - Logical inference
- `venn_diagram` - Set representation
- `mathematical_operations` - Symbol substitution
- `missing_number` - Find missing value
- `alphabet_recall` - Position-based questions
- `calendar_clock` - Date/time calculations
- `embedded_figures` - Finding hidden shapes
- `figure_counting` - Count triangles/squares
- `mirror_water_image` - Reflection problems
- `paper_folding` - Paper fold and punch
- `dice_cubes` - Dice face problems
- `pattern_completion` - Matrix/figure series
- `odd_one_out` - Find different element
- `logical_sequence` - Number/letter patterns

#### How to Choose Pattern:

1. **Read the question carefully**
2. **Identify the core concept being tested**
3. **Check patterns_seed_data.json for the best match**
4. **Use the pattern `code` field, not the `name`**

**Examples:**
- "If tanθ = √3, find sin²θ" → `trigonometry`
- "Area of circle with radius 7 cm" → `mensuration_2d`
- "Train crosses a pole in 10 seconds" → `speed_distance_time`
- "FUTURE → IXWXUH, code JERSEY" → `coding_decoding`
- "How many triangles in the figure?" → `figure_counting`

### 4. **DIFFICULTY ASSIGNMENT**

Assign difficulty based on:

**EASY:**
- Direct formula application
- Single-step problems
- Basic recall
- Simple substitution

**MEDIUM:**
- Multi-step problems (2-3 steps)
- Requires concept understanding
- Moderate calculations
- Pattern recognition needed

**HARD:**
- Complex multi-step (4+ steps)
- Multiple concepts combined
- Tricky logic/manipulation
- Advanced problem-solving

**Examples:**
```json
// EASY
"If SI = 3000, P = 15000, R = 5%, find T"

// MEDIUM  
"Cost price increases 20%, selling price decreases 10%. Find profit% change."

// HARD
"In triangle ABC, DE || BC, AE = 3EC, AB = 6.4. Find DB using Basic Proportionality Theorem."
```

### 5. **SOURCE INFORMATION**

Extract from PDF:
- Exam name (always "SSC CGL 2024")
- Date from PDF (format: DD.MM.YYYY)
- Time from PDF (format: HH:MM AM/PM - HH:MM AM/PM)

**Example:**
```json
"source": {
  "exam": "SSC CGL 2024",
  "year": 2024,
  "shift": "Tier 1 - 26.09.2024 12:30 PM - 01:30 PM"
}
```

---

## Workflow - Step by Step

### Step 1: Preparation
1. **Open the PDF** provided
2. **Read the reference JSON files** to understand format
3. **Study patterns_seed_data.json** to know all 43 patterns
4. **Identify the exam details** (date, shift timing)

### Step 2: Extraction Process

For EACH question:

1. **Copy the question text**
   - Replace mathematical expressions with LaTeX
   - Add `[IMAGE]` where images/diagrams appear
   - Keep the question clear and complete

2. **Extract all 4 options**
   - Format: id: "A", "B", "C", "D"
   - Use LaTeX for math in options too
   - Mark image options with `[IMAGE]` if needed

3. **Identify the correct answer**
   - From the answer key in PDF
   - Format: "A", "B", "C", or "D" (capital letters)

4. **Write the solution** (MOST TIME-CONSUMING BUT CRITICAL)
   - Start with "**Given:**"
   - Break into clear steps with headers
   - Use LaTeX for all math
   - Explain reasoning
   - Verify the answer
   - End with "**Answer:** Option [Letter]"

5. **Determine subject**
   - First 25 questions: Usually "QUANT"
   - Next 25 questions: Usually "REASONING"
   - But verify from PDF section headers

6. **Map to pattern**
   - Check patterns_seed_data.json
   - Use the `code` field value
   - Pick the most specific pattern

7. **Assign difficulty**
   - EASY, MEDIUM, or HARD
   - Based on steps and complexity

8. **Fill source info**
   - Extract from PDF filename/content
   - Use exact format shown

### Step 3: Quality Check

Before finalizing, verify:

✅ All LaTeX is properly formatted (test if needed)
✅ `[IMAGE]` is placed correctly
✅ Solutions are detailed and step-by-step
✅ Pattern codes match patterns_seed_data.json exactly
✅ Difficulty seems appropriate
✅ All 4 options are present
✅ JSON is valid (no syntax errors)

### Step 4: Output

Create TWO separate JSON files:

1. **`ssc_cgl_quant_[DATE]_[SHIFT].json`**
   - All QUANT questions (usually 25)
   - Format: Array of question objects

2. **`ssc_cgl_reasoning_[DATE]_[SHIFT].json`**
   - All REASONING questions (usually 25)
   - Format: Array of question objects

---

## Common Mistakes to Avoid

❌ **DON'T:**
1. Skip LaTeX formatting for math
2. Write short, unhelpful solutions
3. Use wrong pattern codes (check the JSON!)
4. Forget `[IMAGE]` placeholders
5. Break JSON syntax
6. Mix up QUANT and REASONING in same file
7. Use pattern names instead of codes
8. Copy solutions without explaining steps
9. Forget to verify answers
10. Skip difficulty assignment

✅ **DO:**
1. Study reference files first
2. Write detailed, educational solutions
3. Double-check pattern codes
4. Use LaTeX consistently
5. Test JSON validity
6. Separate QUANT and REASONING
7. Explain every step clearly
8. Include verification/checking
9. Assign appropriate difficulty
10. Follow the exact schema

---

## Example Complete Question

```json
{
  "text": "The marked price of an electronic watch in a store is ₹15,620 and it is available at a discount of 27%. What is the price (in ₹, to the nearest tens) that a customer pays if he buys from the store?",
  "image": "",
  "options": [
    {
      "id": "A",
      "text": "11,400",
      "image": ""
    },
    {
      "id": "B",
      "text": "9,880",
      "image": ""
    },
    {
      "id": "C",
      "text": "12,500",
      "image": ""
    },
    {
      "id": "D",
      "text": "10,800",
      "image": ""
    }
  ],
  "correct_option": "A",
  "solution": "**Given:**\n- Marked Price (MP) = ₹15,620\n- Discount = 27%\n\n**Step 1:** Calculate discount amount\n$$\\text{Discount amount} = \\frac{27}{100} \\times 15,620$$\n$$= 0.27 \\times 15,620 = 4,217.4$$\n\n**Step 2:** Calculate selling price\n$$\\text{Selling Price} = \\text{Marked Price} - \\text{Discount}$$\n$$= 15,620 - 4,217.4 = 11,402.6$$\n\n**Alternative method:** Using percentage formula\n$$\\text{Selling Price} = \\text{MP} \\times \\frac{(100 - \\text{Discount}\\%)}{100}$$\n$$= 15,620 \\times \\frac{73}{100} = 15,620 \\times 0.73 = 11,402.6$$\n\n**Step 3:** Round to nearest tens\n$$11,402.6 \\approx 11,400$$\n\n**Answer:** Option A (₹11,400)",
  "subject": "QUANT",
  "pattern": "profit_loss",
  "difficulty": "EASY",
  "source": {
    "exam": "SSC CGL 2024",
    "year": 2024,
    "shift": "Tier 1 - 26.09.2024 12:30 PM - 01:30 PM"
  },
  "stats": {
    "attempt_count": 0,
    "accuracy_rate": 0,
    "avg_time_ms": 0
  },
  "is_live": false,
  "needs_review": true
}
```

---

## LaTeX Quick Reference

### Basic Math:
- Addition: `$a + b$`
- Subtraction: `$a - b$`
- Multiplication: `$a \times b$` or `$a \cdot b$`
- Division: `$a \div b$` or `$\frac{a}{b}$`
- Equals: `$=$`
- Approximately: `$\approx$`

### Fractions & Roots:
- Fraction: `$\frac{3}{4}$`
- Mixed: `$2\frac{1}{3}$`
- Square root: `$\sqrt{x}$`
- Cube root: `$\sqrt[3]{x}$`
- nth root: `$\sqrt[n]{x}$`

### Powers & Subscripts:
- Power: `$x^2$`, `$x^{10}$`
- Subscript: `$x_1$`, `$x_{10}$`
- Both: `$x_1^2$`

### Greek Letters:
- `$\alpha$`, `$\beta$`, `$\gamma$`, `$\delta$`
- `$\theta$`, `$\pi$`, `$\sigma$`, `$\omega$`

### Trigonometry:
- `$\sin\theta$`, `$\cos\theta$`, `$\tan\theta$`
- `$\cot\theta$`, `$\sec\theta$`, `$\csc\theta$`

### Geometry:
- Angle: `$\angle ABC$`
- Triangle: `$\triangle ABC$`
- Parallel: `$AB \parallel CD$`
- Perpendicular: `$AB \perp CD$`
- Degree: `$90°$`

### Comparisons:
- Greater than or equal: `$\geq$`
- Less than or equal: `$\leq$`
- Not equal: `$\neq$`

### Special:
- Infinity: `$\infty$`
- Percentage: `$25\%$` or just `25%`
- Rupee: `₹` (use regular rupee symbol)

---

## Final Checklist Before Submission

□ Studied all reference files thoroughly  
□ All questions extracted from PDF  
□ LaTeX formatted correctly for all math  
□ `[IMAGE]` placeholders added where needed  
□ Solutions are detailed, step-by-step, and educational  
□ Pattern codes match patterns_seed_data.json exactly  
□ Difficulty assigned appropriately (EASY/MEDIUM/HARD)  
□ Source information extracted correctly  
□ JSON syntax is valid (no errors)  
□ Two separate files: one for QUANT, one for REASONING  
□ File names follow convention: `ssc_cgl_[subject]_[date]_[shift].json`  
□ All correct_option values are capital letters: "A", "B", "C", or "D"  
□ All stats fields set to 0  
□ All is_live set to false  
□ All needs_review set to true  

---

## Questions?

If you encounter:
- **Pattern ambiguity**: Choose the most specific pattern that matches
- **Complex questions**: Break them down, provide extra explanation
- **Image-heavy questions**: Use `[IMAGE]` and describe what to see if helpful
- **Unclear answers**: Double-check your solution steps, verify calculation

---

## Remember

**QUALITY OVER SPEED!** 

Students will use these solutions to learn. Make every solution:
- Clear and easy to follow
- Educationally valuable
- Mathematically correct
- Well-formatted

**Your work directly impacts students preparing for their government job exams. Take pride in creating excellent educational content!**

---

Good luck! 🚀