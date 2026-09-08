A TAbelhaDev é uma organização que eu idealizei para criar uma identidade única para os diversos projetos que eu pensei em desenvolver. O nome "TAbelha" vem da minha "obsessão" em sistematizar e padronizar tudo que eu vejo ao meu redor. Uma obsessão que pode, ou não, ser oriunda de uma dupla excepcionalidade.

## A identidade

Não é à toa que todos os projetos:

- utilizam o design de um único projeto (`tabelhawebui` e `tabelhatuiui`)
- seguem o mesmo padrão de nomenclatura (`TAbelha` + XXX)
- seguem a mesma organização no github (definida no `tabelhascaff`)

e por aí vai.

## Software livre

Pelo meu posicionamento político (spoiler: eu estava em dúvida entre Camarada e TAbelha), _praticamente_ todos os projetos contribuem para o movimento do [software livre no Brasil](https://www.youtube.com/watch?v=Auoe3XsWthM), numa ideia de socializar a produção de software para a população.

## Auto custo

Cada um dos projetos nasce de uma necessidade real que eu tive/tenho ou que outras pessoas relataram. Vários possuem integração com IA, sendo possível ocultar completamente essa funcionalidade para os mais ludistas. Nesse caso, eu sigo o princípio de _"auto custo"_: em vez de cobrar uma mensalidade o olho da cara e utilizar algum modelo xoxo, qualquer pessoa pode integrar a IA na plataforma e controlar os seus próprios gastos, equilibrando custo x qualidade (recomendo os modelos chineses por motivos de: China).

## A stack

### Web

Os projetos web usam a mesma stack de SvelteKit + Cloudflare Workers porque Svelte é um dos melhores frameworks web já criados (extremamente rápido, leve, fácil de usar, elegante...) e integra muito bem com Cloudflare, que apesar de, como qualquer empresa no capitalismo, ser extremamente [problemática](https://www.techradar.com/news/cloudflare-responds-to-criticism-over-relationship-with-far-right-websites) com esse papinho de [neutralidade](https://techcrunch.com/2019/08/15/cloudflare-8chan-risk-factor/), o produto é bom e oferece um tier gratuito excelente para deploy, algo que sempre me deu dor de cabeça (bom deixar claro que eu não tenho qualquer clubismo com a Cloudflare; se tu achar que tem como substituir os serviços que eu uso deles por alguma outra coisa "menos pior", eu sou todo ouvidos).

### Terminal

Já os TUIs usam Go porque é um equilíbrio muito bom de velocidade, capacidade e simplicidade. Sinceramente, esses projetos foram os que eu menos tive dor de cabeça para desenvolver, _"they just worked"_, o que de duas uma: ou é um milagre ou é o apocalipse. Nesse caso, foi um milagre.
