<script lang="ts">
	import { resolve } from '$app/paths';
	import CodeXmlIcon from '@lucide/svelte/icons/code-xml';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import GitForkIcon from '@lucide/svelte/icons/git-fork';
	import NewspaperIcon from '@lucide/svelte/icons/newspaper';
	import type { PageData } from './$types';
	import { projects, type Project } from '$lib/hub-data';
	import { Badge, Button, Card, Landing, Page, Wordmark } from '@tabelhadev/tabelhawebui';
	import NewsItem from '$lib/components/news/NewsItem.svelte';

	let { data } = $props<{ data: PageData }>();

	const TITLE = 'TAbelhaHub';
	const DESCRIPTION =
		'Um hub que agrega todas as novidades, produtos e atualizações da TAbelhaDev.';

	const kindLabel: Record<Project['kind'], string> = {
		web: 'web',
		tui: 'tui',
		os: 'os',
		lib: 'lib',
		script: 'script'
	};

	// const HERO_LEAD =
	// 'Eu faço apps web, TUIs e libs sobre uma crença simples: software pessoal deveria custar quase nada pra rodar ("auto custo") e dar gosto de usar. Sem mensalidade o olho da cara, sem lock-in. Esta página é o ponto de entrada - landing, news e o changelog que se mantém sozinho.';
	const HERO_LEAD =
		'Estou desenvolvendo apps web, TUIs e libs sobre a crença do software livre.';
	const HERO_NOTE =
		'Landing, changelog e as decisões por trás de cada projeto: tudo num só lugar, pra ninguém ter que caçar em N repos.';
	const PHILOSOPHY_LEAD = 'Mais detalhes no post "Por que auto custo".';

	const featured: Project[] = projects.filter((p) => p.featured);
	const rest: Project[] = projects.filter((p) => !p.featured);

	const steps = [
		{
			number: '01',
			color: 'var(--ctp-mauve)',
			title: 'Auto custo',
			body: 'Nada de assinatura: a infra é a sua conta grátis, e IA entra com a sua chave (BYOK).'
		},
		{
			number: '02',
			color: 'var(--ctp-sapphire)',
			title: 'Seus dados, seu banco',
			body: 'Credenciais criptografadas no seu banco. O app não vê, não guarda, não revende.'
		},
		{
			number: '03',
			color: 'var(--ctp-green)',
			title: 'Uma estética só',
			body: 'Catppuccin, mono carregando a estrutura e bordas afiadas - web e TUI, mesma família.'
		},
		{
			number: '04',
			color: 'var(--ctp-yellow)',
			title: 'Código aberto',
			body: 'Tudo público sob AGPL-3.0: auditar, forkar e rodar por conta própria custa zero.'
		}
	];
</script>

{#snippet heroTitle()}
	<Wordmark prefix="TAbelha" suffix="Hub" />
{/snippet}

<Page.Seo siteName="TAbelhaHub" title={TITLE} description={DESCRIPTION} />

<Landing>
	<Landing.Hero eyebrow="O hub da TAbelhaDev" title={heroTitle} lead={HERO_LEAD} note={HERO_NOTE}>
		{#snippet actions()}
			<Button href="/#projetos" variant="primary" size="lg">Ver os projetos</Button>
			<Button href="/news" variant="outline" size="lg">
				<NewspaperIcon class="size-4" />
				Ler as news
			</Button>
		{/snippet}
	</Landing.Hero>

	<Landing.Section id="projetos" class="scroll-mt-20">
		<Landing.Section.Heading
			eyebrow="Produtos"
			title="Cada repo, um pedaço da casa."
			lead="Da agenda com IA ao instalador do Arch Linux - sim, a bagagem varia -, tudo partilha a mesma estética e a mesma regra de custo."
		/>
		<div class="grid gap-4 md:grid-cols-2">
			{#each [...featured, ...rest] as project (project.name)}
				<Card>
					<a href={resolve(`/news/tag/${project.name}`)} class="block">
						<Card.Header>
							{#snippet title()}
								<span class="size-2 rounded-full" style="background: {project.accent}"></span>
								{project.name}
							{/snippet}
							{#snippet description()}
								{project.tagline}
							{/snippet}
						</Card.Header>
					</a>
					<Card.Footer class="mt-auto flex items-center justify-between gap-3">
						<div class="flex flex-wrap gap-2">
							<Badge>{kindLabel[project.kind]}</Badge>
							{#if project.language}
								<Badge>{project.language}</Badge>
							{/if}
							{#if project.links.npm}
								<Badge>npm</Badge>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							{#if project.links.npm}
								<Button
									href={project.links.npm}
									target="_blank"
									rel="external noreferrer"
									variant="outline"
									size="sm"
								>
									<ExternalLinkIcon class="size-4" />
									npm
								</Button>
							{/if}
							<Button
								href={project.html_url}
								target="_blank"
								rel="external noreferrer"
								variant="outline"
								size="sm"
							>
								<GitForkIcon class="size-4" />
								GitHub
							</Button>
						</div>
					</Card.Footer>
				</Card>
			{/each}
		</div>
	</Landing.Section>

	<Landing.Section>
		<Landing.Section.Heading
			eyebrow="A filosofia"
			title="Quatro regras que todo app segue."
			lead={PHILOSOPHY_LEAD}
		/>
		<Landing.Steps {steps} />
	</Landing.Section>

	<Landing.Section>
		<Landing.Section.Heading
			eyebrow="News"
			title="O que estou fazendo e pensando"
			lead="Notas curtas sobre decisões de design, o que vem por aí e o porquê das coisas - inclusive as que eu mudaria hoje."
		/>
		<div class="flex flex-col divide-y divide-rule">
			{#each data.newsHead as post (post.slug)}
				<NewsItem
					title={post.title}
					date={post.date}
					summary={post.summary}
					tags={post.tags}
					href={resolve(`/news/${post.slug}`)}
				/>
			{/each}
		</div>
		<div>
			<Button href="/news" variant="ghost" size="sm">
				<CodeXmlIcon class="size-4" />
				Todas as news
			</Button>
		</div>
	</Landing.Section>
</Landing>
