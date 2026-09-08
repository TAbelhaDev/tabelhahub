#!/usr/bin/env node
/**
 * Agrega os dados do hub a partir do GitHub:
 *  - projects.json: repos públicos do org TAbelhaDev + overlay curado
 *    (ordem, featured, tagline, accent, links) definido abaixo.
 *  - changelog.json: entradas de release (GitHub Releases) + seções
 *    `## [v] - data` dos CHANGELOG.md de cada repo público.
 *
 * Depende do `gh` (CLI) autenticado - local e nos runners do GitHub.
 * Saída commitada: build consome os JSONs sem rede.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORG = 'TAbelhaDev';
const SITE = 'tabelhahub';
/* Repos do org que não são produtos: o profile README (.github) e o portfolio
   da pessoa (tabelhaport) - os dois são linkados à parte. */
const EXCLUDED = new Set(['.github', 'tabelhaport']);

/* Overlay curado: o que o script NÃO decide sozinho. Chave = nome do repo.
   `kind`: web | tui | os | lib | script. `accent`: cor Catppuccin pro card. */
const overlay = {
	tabelafin: {
		order: 1,
		featured: true,
		kind: 'web',
		accent: 'var(--ctp-green)',
		tagline: 'Finanças pessoais com IA e Open Finance - auto custo, suas chaves (BYOK).'
	},
	tabelacal: {
		order: 2,
		featured: true,
		kind: 'web',
		accent: 'var(--ctp-peach)',
		tagline: 'Agenda com IA em linguagem natural, no mesmo espírito "auto custo".'
	},
	tabelhavagas: {
		order: 3,
		featured: true,
		kind: 'tui',
		accent: 'var(--ctp-sapphire)',
		tagline: 'Filtra vagas de programação que valem a pena e notifica as que importam.'
	},
	tabelhawebui: {
		order: 4,
		featured: true,
		kind: 'lib',
		accent: 'var(--ctp-mauve)',
		tagline:
			'Tema + chrome compartilhado dos apps web: Catppuccin com estética "reading someone\'s source file".',
		links: {
			npm: 'https://www.npmjs.com/package/@tabelhadev/tabelhawebui',
			npmMcp: 'https://www.npmjs.com/package/@tabelhadev/mcp-tabelhawebui'
		}
	},
	tabelhaos: {
		order: 5,
		featured: false,
		kind: 'os',
		accent: 'var(--ctp-teal)',
		tagline: 'Instalador do Arch Linux com gum - archiso + LUKS2, testado em QEMU.'
	},
	tabelhatuiui: {
		order: 6,
		featured: false,
		kind: 'lib',
		accent: 'var(--ctp-mauve)',
		tagline: 'Tema + chrome compartilhado das TUIs Go (Bubble Tea).'
	},
	tabelhakanban: {
		order: 7,
		featured: false,
		kind: 'tui',
		accent: 'var(--ctp-yellow)',
		tagline: 'Kanban no terminal.'
	},
	tabelharadar: {
		order: 8,
		featured: false,
		kind: 'tui',
		accent: 'var(--ctp-red)',
		tagline: 'TUI pra navegar o estado dos teus repos: git health, WIP, trabalho não pusheado.'
	},
	tabelascaffold: {
		order: 9,
		featured: false,
		kind: 'tui',
		accent: 'var(--ctp-blue)',
		tagline:
			'Injeta a estrutura open-source (CI, release, templates, CONTRIBUTING, LICENSE) num repo novo.'
	},
	tabelhaquickrun: {
		order: 10,
		featured: false,
		kind: 'script',
		accent: 'var(--ctp-sky)',
		tagline: 'Atalhos de texto expansíveis no DankMaterialShell (dms) — abreviação vira snippet.'
	},
	tabelhawhisper: {
		order: 11,
		featured: false,
		kind: 'script',
		accent: 'var(--ctp-pink)',
		tagline:
			'Ditador por voz para DankMaterialShell no niri: grave, transcreva local com faster-whisper, copie.'
	}
};

function gh(endpoint) {
	const out = execFileSync('gh', ['api', endpoint, '--paginate'], {
		encoding: 'utf8',
		maxBuffer: 16 * 1024 * 1024
	});
	return JSON.parse(out);
}

function repoChangelogEntries(name) {
	try {
		const { content } = gh(`repos/${ORG}/${name}/contents/CHANGELOG.md`);
		const md = Buffer.from(content, 'base64').toString('utf8');
		const sectionRe = /^## \[(.+?)\] - (\d{4}-\d{2}-\d{2})$/gm;
		const entries = [];
		let m;
		let bodies = new Map();
		while ((m = sectionRe.exec(md))) {
			const title = m[1];
			const date = m[2];
			const start = sectionRe.lastIndex;
			const next = md.indexOf('\n## ', start);
			const end = next === -1 ? md.length : next;
			bodies.set(`${title}|${date}`, md.slice(start, end).trim());
		}
		sectionRe.lastIndex = 0;
		while ((m = sectionRe.exec(md))) {
			const title = m[1];
			const date = m[2];
			if (title === 'Unreleased') continue;
			entries.push({
				repo: name,
				version: title.replace(/^v/, ''),
				date,
				title: `${name} ${title}`,
				body: bodies.get(`${title}|${date}`) || '',
				source: 'changelog'
			});
		}
		return entries;
	} catch {
		return [];
	}
}

function repoReleaseEntries(name) {
	try {
		return gh(`repos/${ORG}/${name}/releases`)
			.filter((r) => !r.draft && !r.prerelease)
			.map((r) => ({
				repo: name,
				version: r.tag_name.replace(/^v/, ''),
				date: (r.published_at || '').slice(0, 10),
				title: r.name || `${name} ${r.tag_name}`,
				body: r.body || '',
				source: 'release'
			}));
	} catch {
		return [];
	}
}

async function main() {
	const repos = gh(`orgs/${ORG}/repos`).filter(
		(r) => !r.private && r.name !== SITE && !EXCLUDED.has(r.name)
	);

	const projects = repos
		.map((r) => {
			const o = overlay[r.name] || {};
			return {
				name: r.name,
				description: r.description || '',
				tagline: o.tagline || r.description || '',
				language: r.language || '',
				kind: o.kind || 'web',
				accent: o.accent || 'var(--ctp-mauve)',
				featured: o.featured || false,
				order: o.order || 99,
				html_url: r.html_url,
				homepage: r.homepage || '',
				topics: r.topics || [],
				pushed_at: r.pushed_at || '',
				links: o.links || {}
			};
		})
		.sort((a, b) => a.order - b.order);

	/* Changelog: release bodies têm precedência quando existem (o changelog do
	   tabelawebui é manteado junto com as releases); CHANGELOG.md cobre o resto. */
	const byRepo = new Map();
	for (const r of repos) {
		const releases = repoReleaseEntries(r.name);
		const changelog = repoChangelogEntries(r.name);
		const byVersion = new Map();
		for (const e of releases) byVersion.set(e.version, e);
		for (const e of changelog) if (!byVersion.has(e.version)) byVersion.set(e.version, e);
		byRepo.set(
			r.name,
			[...byVersion.values()].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5)
		);
	}
	const changelog = [...byRepo.values()]
		.flat()
		.sort((a, b) => (a.date < b.date ? 1 : -1))
		.slice(0, 50);

	/* Saída em formato prettier (tabs, quebra de linha) - o CI roda
	   `prettier --check` e os JSONs são commitados, então a saída tem que
	   casar com o prettier do repo. */
	const prettierConfig = await resolveConfig(join(ROOT, 'prettier.config.js'));
	const pretty = (data) => format(JSON.stringify(data), { ...prettierConfig, parser: 'json' });
	writeFileSync(join(ROOT, 'src/lib/projects.json'), await pretty(projects));
	writeFileSync(join(ROOT, 'src/lib/changelog.json'), await pretty(changelog));
	console.log(`projects: ${projects.length} repos, changelog: ${changelog.length} entradas`);
}

await main();
