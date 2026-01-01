# Critical Issues Found in Extraction Script

## 🚨 Issues to Fix:

### 1. **LaTeX Conversion Too Aggressive**
**Problem**: The `convert()` method tries to parse ENTIRE question text as a single SymPy expression, which will fail for normal sentences.

**Fix**: Only convert when text contains math symbols, not all text.

### 2. **Option Parsing Regex Too Greedy**
**Problem**: `r'\(([1-4])\)\s*([^\n]+)'` only captures until newline, but options can span multiple lines.

**Fix**: Need better multi-line option parsing.

### 3. **Missing Benchmarks Field**
**Problem**: JSON output doesn't include `benchmarks` field required by schema.

**Fix**: Add default benchmarks to Question class.

### 4. **No Import Batch Auto-Generation**
**Problem**: `import_batch` is always None.

**Fix**: Auto-generate from exam + paper info.

### 5. **LaTeX Escaping Issues**
**Problem**: Percentage escaping happens AFTER other conversions, could break LaTeX.

**Fix**: Do escaping first, then conversions.

## ✅ Fixes Applied Below
