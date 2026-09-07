#!/usr/bin/env node
/**
 * Cria posts em content/news/ a partir de sugestões (output do `tahubcli suggest`).
 *
 * Lê um array JSON de sugestões do stdin, cada uma no formato:
 *   { title, slug, summary, tags, placeholder, date? }
 * (`date` é opcional - default é a data de hoje.)
 *
 * Para cada sugestão cria content/news/YYYY-MM-DD-slug.md com frontmatter
 * pronta e o placeholder como corpo. Nunca sobrescreve arquivo existente.
 *
 * Uso: tahubcli ipc suggest --json | node scripts/new-post.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NEWS_DIR = join(ROOT, 'content/news');

function todayISO() {
	return new Date().toISOString().slice(0, 10);
}

function slugify(text) {
	return String(text)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function yamlString(value) {
	return JSON.stringify(String(value ?? ''));
}

function buildFrontmatter({ title, date, summary, tags = [] }) {
	return [
		'---',
		`title: ${yamlString(title)}`,
		`date: ${date}`,
		`summary: ${yamlString(summary)}`,
		`tags: [${tags.join(', ')}]`,
		'featured: false',
		'---',
		''
	].join('\n');
}

function readStdin() {
	const raw = readFileSync(0, 'utf8').trim();
	if (!raw) throw new Error('nenhum JSON recebido no stdin');
	return JSON.parse(raw);
}

function main() {
	const suggestions = readStdin();
	if (!Array.isArray(suggestions)) throw new Error('esperava um array JSON de sugestões');
	if (suggestions.length === 0) {
		console.log('nenhuma sugestão recebida');
		return;
	}

	mkdirSync(NEWS_DIR, { recursive: true });

	const created = [];
	const skipped = [];

	for (const suggestion of suggestions) {
		const { title, summary = '', tags = [], placeholder = '' } = suggestion;
		if (!title) {
			skipped.push('(sem título) - sugestão ignorada');
			continue;
		}

		const date = suggestion.date || todayISO();
		const slug = suggestion.slug ? slugify(suggestion.slug) : slugify(title);
		const filename = `${date}-${slug}.md`;
		const filepath = join(NEWS_DIR, filename);

		if (existsSync(filepath)) {
			skipped.push(`content/news/${filename} (já existe)`);
			continue;
		}

		const content = buildFrontmatter({ title, date, summary, tags }) + '\n' + placeholder + '\n';
		writeFileSync(filepath, content);
		created.push(`content/news/${filename}`);
	}

	if (created.length > 0) {
		console.log(`criados (${created.length}):`);
		for (const f of created) console.log(`  ${f}`);
	}
	if (skipped.length > 0) {
		console.log(`pulados (${skipped.length}):`);
		for (const f of skipped) console.log(`  ${f}`);
	}
	if (created.length === 0 && skipped.length === 0) {
		console.log('nada a fazer');
	}
}

main();
