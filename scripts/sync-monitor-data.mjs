/**
 * Pull the latest state.public.json from the child-credit-freeze-monitor repo
 * and write it to public/widget/state.public.json so the widget can serve it
 * same-origin (no third-party fetch at page load).
 *
 * Run manually after a "requirements changed" email from the monitor:
 *   npm run sync-monitor-data
 *
 * Then commit + push so Vercel rebuilds the site with the new data.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_URL =
	'https://raw.githubusercontent.com/jahngon/child-credit-freeze-monitor/main/data/state.public.json';
const DEST_PATH = 'public/widget/state.public.json';

async function main() {
	console.log(`Fetching ${SOURCE_URL}`);
	const response = await fetch(SOURCE_URL, { cache: 'no-store' });
	if (!response.ok) {
		throw new Error(`Source returned HTTP ${response.status} ${response.statusText}`);
	}

	const body = await response.text();
	// Parse to validate it's well-formed JSON before writing.
	const parsed = JSON.parse(body);
	if (!parsed || !Array.isArray(parsed.bureaus) || typeof parsed.lastChecked !== 'string') {
		throw new Error('Fetched JSON does not match expected state.public.json shape');
	}

	await mkdir(path.dirname(DEST_PATH), { recursive: true });
	// Re-serialize so the file is pretty-printed identically to the monitor repo's format.
	await writeFile(DEST_PATH, JSON.stringify(parsed, null, 2) + '\n');

	console.log(`Wrote ${DEST_PATH}`);
	console.log(`  bureaus: ${parsed.bureaus.length}`);
	console.log(`  lastChecked: ${parsed.lastChecked}`);
	console.log(`  lastChanged: ${parsed.lastChanged}`);
	console.log('');
	console.log('Now commit + push the website repo so Vercel picks it up.');
}

main().catch((err) => {
	console.error(`\nsync-monitor-data failed: ${err.message}`);
	process.exit(1);
});
