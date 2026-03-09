import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Adjust these paths if your locales folder is elsewhere
const LOCALES_BASE = path.resolve("src/locales");

async function translatePatch(patchPath) {
  const absolutePatch = path.resolve(patchPath);
  if (!fs.existsSync(absolutePatch)) {
    console.error(` Patch file not found: ${absolutePatch}`);
    process.exit(1);
  }

  const patch = JSON.parse(fs.readFileSync(absolutePatch, "utf8"));
  const keyCount = Object.keys(patch).length;
  console.log(`\n Patch file: ${path.basename(patchPath)}`);
  console.log(`   Keys to translate: ${keyCount}\n`);

  // ── Step 1: Merge English patch into en/translation.json ──
  const enPath = path.join(LOCALES_BASE, "en", "translation.json");
  const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
  mergeNestedKeys(enData, patch);
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), "utf8");
  console.log(`✅ Merged ${keyCount} keys into en/translation.json`);

  // ── Step 2: Translate to Tamil ──
  console.log(" Translating to Tamil...");
  const taTranslations = await translateKeys(patch, "Tamil", "ta");
  const taPath = path.join(LOCALES_BASE, "ta", "translation.json");
  const taData = JSON.parse(fs.readFileSync(taPath, "utf8"));
  mergeNestedKeys(taData, taTranslations);
  fs.writeFileSync(taPath, JSON.stringify(taData, null, 2), "utf8");
  console.log(`✅ Merged ${keyCount} keys into ta/translation.json`);

  // ── Step 3: Translate to Hindi ──
  console.log(" Translating to Hindi...");
  const hiTranslations = await translateKeys(patch, "Hindi", "hi");
  const hiPath = path.join(LOCALES_BASE, "hi", "translation.json");
  const hiData = JSON.parse(fs.readFileSync(hiPath, "utf8"));
  mergeNestedKeys(hiData, hiTranslations);
  fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2), "utf8");
  console.log(` Merged ${keyCount} keys into hi/translation.json\n`);

  console.log(` Done! All 3 translation files updated.`);
  console.log(`   You can delete: ${path.basename(patchPath)}\n`);
}

async function translateKeys(patch, language, langCode) {
  const prompt = `Translate these UI strings from English to ${language} for a cafe/restaurant billing app.
Keep translations natural, concise, and appropriate for a POS (Point of Sale) interface.
Return ONLY valid JSON with the same keys, translated values. No markdown, no explanation.

English strings:
${JSON.stringify(patch, null, 2)}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    console.error(` Failed to parse ${language} translation response`);
    console.error(raw.slice(0, 300));
    return {};
  }
}

/**
 * Merges flat dot-notation keys into a nested object.
 * e.g. "billing.printBill": "Print Bill"
 *   → { billing: { printBill: "Print Bill" } }
 */
function mergeNestedKeys(target, flatPatch) {
  for (const [dotKey, value] of Object.entries(flatPatch)) {
    const parts = dotKey.split(".");
    let cursor = target;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") {
        cursor[parts[i]] = {};
      }
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = value;
  }
}

// ── Run ──
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node translate-patch.mjs <patch-file.i18n-patch.json>");
  process.exit(0);
}

translatePatch(args[0]).catch(err => {
  console.error(" Error:", err.message);
  process.exit(1);
});
