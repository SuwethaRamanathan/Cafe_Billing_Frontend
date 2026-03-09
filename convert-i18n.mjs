import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an i18n migration expert for React apps.
Your job is to convert JSX files to use react-i18next.

RULES:
1. Add "import { useTranslation } from 'react-i18next';" at the top
2. Add "const { t, i18n } = useTranslation();" as the FIRST line inside the component function
3. Replace ALL hardcoded UI strings with t('namespace.key') calls
4. Use these namespaces based on context:
   - nav.*        → sidebar/navigation items
   - common.*     → shared words (Save, Cancel, Delete, Loading…)
   - settings.*   → anything in SettingsPage
   - billing.*    → anything in BillingPage/CashierPage
   - dashboard.*  → anything in DashboardPage
   - menu.*       → anything in MenuPage
   - orders.*     → anything in OrdersPage
   - reports.*    → anything in ReportsPage
5. For placeholders: placeholder={t('key')}
6. Keys must be camelCase, descriptive, and nested with dots
7. Do NOT translate: variable names, CSS classes, API URLs, JSX attribute names
8. Do NOT touch: import statements (except adding i18n import), prop names, event handlers

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown, no explanation:
{
  "convertedCode": "...the full converted JSX file as a string...",
  "newKeys": {
    "namespace.key": "English value",
    "namespace.key2": "English value 2"
  }
}`;

async function convertFile(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(` File not found: ${absolutePath}`);
    process.exit(1);
  }

  const originalCode = fs.readFileSync(absolutePath, "utf8");
  console.log(`\n Converting: ${filePath}`);
  console.log(`   Size: ${originalCode.length} chars\n`);

  console.log(" Sending to Claude...");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `Convert this JSX file to use react-i18next t() calls.\n\nFile: ${path.basename(filePath)}\n\n\`\`\`jsx\n${originalCode}\n\`\`\``,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const rawText = response.content[0].text;

  let result;
  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    result = JSON.parse(clean);
  } catch {
    console.error(" Failed to parse Claude response as JSON");
    console.error("Raw response:", rawText.slice(0, 500));
    process.exit(1);
  }

  // Backup original
  const backupPath = absolutePath + ".bak";
  fs.writeFileSync(backupPath, originalCode, "utf8");
  console.log(` Backup saved: ${path.basename(backupPath)}`);

  // Write converted file
  fs.writeFileSync(absolutePath, result.convertedCode, "utf8");
  console.log(` Converted file written: ${path.basename(absolutePath)}`);

  // Write new keys patch
  const keysOutPath = absolutePath.replace(/\.jsx$/, ".i18n-patch.json");
  fs.writeFileSync(keysOutPath, JSON.stringify(result.newKeys, null, 2), "utf8");
  console.log(` New translation keys: ${path.basename(keysOutPath)}\n`);

  // Print summary
  const keyCount = Object.keys(result.newKeys).length;
  console.log(` Summary:`);
  console.log(`   → ${keyCount} keys extracted`);
  console.log(`\n New keys to add to your translation files:`);
  console.log(JSON.stringify(result.newKeys, null, 2));

  console.log(`
  Next steps:
   1. Review the converted file and the .i18n-patch.json
   2. Merge the new keys into src/locales/en/translation.json
   3. Run: node translate-patch.js ${path.basename(keysOutPath)}
      (to auto-translate the patch into Tamil & Hindi)
   4. Delete the .bak and .i18n-patch.json files when done
`);
}

// ── Run ──
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node convert-i18n.js <path-to-file.jsx>");
  console.log("Example: node convert-i18n.js src/AdminPages/BillingPage.jsx");
  process.exit(0);
}

convertFile(args[0]).catch(err => {
  console.error(" Error:", err.message);
  process.exit(1);
});
