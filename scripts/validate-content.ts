import { validateContent } from "@/lib/content/validate";

async function main() {
  console.log("Validating content…\n");

  const { errors, warnings } = await validateContent();

  for (const w of warnings) console.warn(`⚠ ${w.message}`);
  for (const e of errors) console.error(`✖ ${e.message}`);

  if (errors.length) {
    console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(1);
  }

  console.log(
    `\nOK — ${warnings.length} warning(s), 0 errors`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
