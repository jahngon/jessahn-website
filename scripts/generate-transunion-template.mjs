/**
 * Generate the TransUnion letter template files.
 * Produces public/widget/transunion-letter-bracketed.docx and .md from the
 * single source of truth below. Re-run after any wording change.
 *
 * Usage:  npm run generate-tu-template
 */

import fs from 'node:fs';
import path from 'node:path';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// ----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR THE LETTER CONTENT
// Edit these pieces if the wording ever changes, then re-run to regenerate both files.
// ----------------------------------------------------------------------------

const INSTRUCTIONS =
	'HOW TO USE THIS TEMPLATE: Replace every blue [bracketed] item with your own ' +
	'information. Delete this orange box before printing. Then print the letter and ' +
	'sign and print your name at the bottom. Mail it with photocopies of your required ' +
	'documents — never originals.';

// Each "line" of the letter body is described as an array of segments.
// A segment is either a plain string, or { fill: "..." } for a blue [bracketed] placeholder.
const BODY = [
	{ gapAfter: 360, segs: [{ fill: '[Today’s date]' }] },

	{ gapAfter: 240, segs: ['To Whom It May Concern,'] },

	{
		gapAfter: 240,
		segs: [
			'I am writing to request that you place a Protected Consumer Freeze on the credit file of my ',
			{ fill: '[child / ward]' },
			', ',
			{ fill: '[child’s full name]' },
			'.',
		],
	},

	{
		gapAfter: 240,
		segs: [
			'I am the ',
			{ fill: '[parent / legal guardian]' },
			' of this protected consumer. To verify my authority to make this request and to confirm both of our identities, I have enclosed copies of the documents listed below.',
		],
	},

	{ gapAfter: 80, bold: true, segs: ['Protected consumer (the child):'] },
	{ gapAfter: 60, segs: ['Full name: ', { fill: '[child’s full name]' }] },
	{ gapAfter: 240, segs: ['Address: ', { fill: '[child’s full address]' }] },

	{ gapAfter: 80, bold: true, segs: ['My information (parent or guardian):'] },
	{ gapAfter: 60, segs: ['Full name: ', { fill: '[your full name]' }] },
	{ gapAfter: 60, segs: ['Relationship to the child: ', { fill: '[parent / legal guardian]' }] },
	{ gapAfter: 240, segs: ['Address: ', { fill: '[your full address]' }] },

	{ gapAfter: 80, bold: true, segs: ['Enclosed documents:'] },
	{
		gapAfter: 240,
		segs: [
			{
				fill: '[List the copies you are enclosing — for example: copy of child’s birth certificate, copy of child’s Social Security card, copy of my driver’s license]',
			},
		],
	},

	{
		gapAfter: 320,
		segs: [
			'Please send written confirmation of the freeze to my address above. If you need anything further, you can reach me at ',
			{ fill: '[your phone or email]' },
			'.',
		],
	},

	{ gapAfter: 480, segs: ['Sincerely,'] },
];

const SIGNATURE_LINE = '_______________________________';
const SIGNATURE_LABEL = 'Signature and printed name';

// ----------------------------------------------------------------------------
// DOCX GENERATION
// ----------------------------------------------------------------------------

const PAGE = {
	size: { width: 12240, height: 15840 }, // US Letter
	margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
};

const FILL_COLOR = '1F6FB2'; // blue for placeholders
const LABEL_COLOR = '888888'; // gray for the signature label
const ORANGE_FILL = 'FFF4E5'; // instruction box background
const ORANGE_TEXT = '8A5A00'; // instruction box text

function segToRun(seg) {
	if (typeof seg === 'string') return new TextRun(seg);
	return new TextRun({ text: seg.fill, color: FILL_COLOR, bold: true });
}

function bodyParagraph(line) {
	return new Paragraph({
		spacing: { after: line.gapAfter !== undefined ? line.gapAfter : 160, line: 276 },
		children: line.segs.map((s) => {
			if (typeof s === 'string' && line.bold) return new TextRun({ text: s, bold: true });
			return segToRun(s);
		}),
	});
}

function buildDocx() {
	const children = [];

	// Orange instruction box
	children.push(
		new Paragraph({
			shading: { type: 'clear', fill: ORANGE_FILL },
			spacing: { before: 0, after: 480 },
			children: [
				new TextRun({ text: INSTRUCTIONS, italics: true, size: 20, color: ORANGE_TEXT }),
			],
		})
	);

	BODY.forEach((line) => children.push(bodyParagraph(line)));

	// Signature line + gray label
	children.push(
		new Paragraph({
			spacing: { after: 60, line: 276 },
			children: [new TextRun(SIGNATURE_LINE)],
		})
	);
	children.push(
		new Paragraph({
			spacing: { after: 0 },
			children: [new TextRun({ text: SIGNATURE_LABEL, size: 16, color: LABEL_COLOR })],
		})
	);

	return new Document({
		styles: { default: { document: { run: { font: 'Arial', size: 22 } } } }, // 11pt Arial
		sections: [{ properties: { page: PAGE }, children }],
	});
}

// ----------------------------------------------------------------------------
// MARKDOWN GENERATION
// ----------------------------------------------------------------------------

function segToMd(seg) {
	if (typeof seg === 'string') return seg;
	return '**' + seg.fill + '**'; // bold placeholders
}

function buildMarkdown() {
	const lines = [];
	lines.push(
		'<!-- Intended display font: Arial. When rendered to HTML/PDF, apply font-family: Arial, sans-serif to match the .docx version. -->'
	);
	lines.push('');
	lines.push('> **' + INSTRUCTIONS + '**');
	lines.push('');
	lines.push('');

	BODY.forEach((line) => {
		if (line.bold) {
			lines.push(
				'**' + line.segs.map((s) => (typeof s === 'string' ? s : s.fill)).join('') + '**'
			);
		} else {
			lines.push(line.segs.map(segToMd).join(''));
		}
		lines.push('');
	});

	lines.push('\\' + SIGNATURE_LINE);
	lines.push('*' + SIGNATURE_LABEL + '*');
	lines.push('');

	return lines.join('\n');
}

// ----------------------------------------------------------------------------
// WRITE BOTH FILES
// ----------------------------------------------------------------------------

const OUTPUT_DIR = 'public/widget';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const docxPath = path.join(OUTPUT_DIR, 'transunion-letter-bracketed.docx');
const mdPath = path.join(OUTPUT_DIR, 'transunion-letter-bracketed.md');

const docxBuf = await Packer.toBuffer(buildDocx());
fs.writeFileSync(docxPath, docxBuf);
console.log(`Wrote ${docxPath}`);

fs.writeFileSync(mdPath, buildMarkdown());
console.log(`Wrote ${mdPath}`);
