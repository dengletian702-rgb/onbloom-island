/* 花屿 · AI 编年史。每一条在首页占一行，在 #/ai/<id> 单开一页。
   只记改变 AI 走向的事；日期和数字都回到原始出处核对过（2026-10-28）。 */
window.HUAYU_CHRONICLE = [
  {
    id: 'transformer', date: '2017.06', kind: '论文', who: '谷歌',
    title: '注意力就够了：Transformer 诞生',
    short: '一篇谷歌论文，换掉了语言模型的“发动机”。',
    facts: [
      ['发表', '2017 年 6 月 12 日，arXiv；同年在 NeurIPS 会议发表'],
      ['作者', 'Ashish Vaswani、Noam Shazeer、Niki Parmar、Jakob Uszkoreit、Llion Jones、Aidan N. Gomez、Łukasz Kaiser、Illia Polosukhin'],
      ['核心', '自注意力：句子里的每个词同时“看”其他所有词'],
      ['后来', 'GPT 里的 T，就是 Transformer']
    ],
    happened: [
      '2017 年 6 月，谷歌的八位作者在 arXiv 发表论文《Attention Is All You Need》。论文提出一种叫 Transformer 的模型结构：不再一个词一个词按顺序读，而是让一句话里的每个词同时去“看”其他所有词，算出谁和谁关系更紧。这一步叫“自注意力”。',
      '论文的实验做的是机器翻译。在英语译德语、英语译法语两项测试上，它超过了当时最好的结果，训练时间也短得多。'
    ],
    why: [
      '在这之前，主流的语言模型（循环神经网络）必须按顺序处理文字，很难同时算，句子一长，前面的信息就淡了。Transformer 可以整段一起算，正好吃得下越来越多的显卡算力。',
      '之后的 GPT、BERT、Claude、Gemini、Grok，底层几乎都是这套结构。说它是今天所有大模型的共同祖先，并不夸张。'
    ],
    use: [
      '记住两件事就够用：第一，模型读你的话是“整段一起看、找关系”，所以把要求、材料、例子分开放清楚，它更容易找对关系；第二，模型一次能看的长度有上限（叫“上下文窗口”），超出的部分它看不到。'
    ],
    open: [
      '论文只解决翻译，作者没有预言聊天机器人。注意力的计算量随文字长度成倍增长，长文本一直是难点，后来很多研究都在想办法省掉这部分开销。'
    ],
    sources: [['论文原文 · arXiv 1706.03762', 'https://arxiv.org/abs/1706.03762']]
  },
  {
    id: 'pretraining', date: '2018', kind: '论文', who: 'OpenAI · 谷歌',
    title: '先读万卷书：GPT-1 与 BERT',
    short: '先用海量文字“预训练”，再学具体任务，成了新套路。',
    facts: [
      ['GPT', '2018 年 6 月，OpenAI；在大量书籍文本上预训练，再微调'],
      ['BERT', '2018 年 10 月，谷歌；同时看一个词左右两边的上下文'],
      ['分岔', 'GPT 往后猜下一个词，擅长生成；BERT 做填空，擅长理解和搜索']
    ],
    happened: [
      '2018 年 6 月，OpenAI 发布 GPT（后来被叫作 GPT-1）：用 Transformer 先在大量书籍文字上训练，学会语言本身，再针对具体任务少量调整。',
      '同年 10 月，谷歌发布 BERT。它也先预训练，但会同时看一个词左右两边的文字，在一系列阅读理解和分类测试里大幅刷新纪录，很快被用进了谷歌搜索。'
    ],
    why: [
      '以前几乎每个任务都要从零训练一个模型，还要准备大量人工标注的数据。预训练把“学语言”和“学任务”分开了：先读足够多的文字，任务只需要少量数据就能学会。',
      '两条路线也从这里分开。BERT 当时更风光；但后来的聊天模型，走的都是 GPT 这条“往后接着写”的生成路线。'
    ],
    use: [
      '今天的大模型都是“先读万卷书，再学规矩”。它知道的东西来自训练时读过的文字，所以有截止日期。问它最近的事，要么把资料给它，要么让它联网搜。'
    ],
    open: [
      '模型从文字里学到的不只是知识，也有偏见和错误。读得越多，越难说清它到底学到了什么。'
    ],
    sources: [
      ['OpenAI · Improving language understanding with unsupervised learning', 'https://openai.com/index/language-unsupervised/'],
      ['BERT 论文 · arXiv 1810.04805', 'https://arxiv.org/abs/1810.04805']
    ]
  },
  {
    id: 'scaling', date: '2020', kind: '论文', who: 'OpenAI',
    title: '越大越强：规模定律与 GPT-3',
    short: '模型、数据、算力一起加大，效果按曲线变好。',
    facts: [
      ['规模定律', '2020 年 1 月，Jared Kaplan 等，《Scaling Laws for Neural Language Models》'],
      ['GPT-3', '2020 年 5 月，1750 亿个参数'],
      ['新用法', '少样本学习：在提示里给几个例子，不用再训练']
    ],
    happened: [
      '2020 年 1 月，OpenAI 的研究者发表“规模定律”论文：把模型参数、训练数据和算力按比例加大，模型的错误会沿着一条可以预测的曲线下降。',
      '同年 5 月，OpenAI 发布 GPT-3，有 1750 亿个参数。最让人吃惊的是：不用再训练，只要在提示里写几个例子，它就能照着做翻译、问答、改写，甚至写简单的代码。'
    ],
    why: [
      '规模定律让“砸钱把模型做大”从赌博变成了可以算账的投资。之后几年，各家公司都在抢着建更大的算力中心。',
      'GPT-3 也让“提示词”第一次成为一种本事：怎么描述任务、给什么例子，直接决定结果好坏。'
    ],
    use: [
      '“给例子”到今天仍是最好用的提示技巧之一。想要什么格式、什么语气，直接放一两个样例，比堆形容词管用得多。'
    ],
    open: [
      '曲线不会无限往下走：高质量的文字数据快用完了，单纯加大规模的回报在变小。后来各家开始让模型“回答前多想一会儿”（见 2024 年的推理模型）。GPT-3 还会一本正经地编造，这个毛病到今天也没有完全治好。'
    ],
    sources: [
      ['规模定律论文 · arXiv 2001.08361', 'https://arxiv.org/abs/2001.08361'],
      ['GPT-3 论文 · arXiv 2005.14165', 'https://arxiv.org/abs/2005.14165']
    ]
  },
  {
    id: 'image-models', date: '2022', kind: '产品', who: 'OpenAI · Midjourney · Stability AI',
    title: '会画画的 AI：DALL·E 2、Midjourney、Stable Diffusion',
    short: '一句话出一张图，图像生成在几个月里走进大众。',
    facts: [
      ['DALL·E 2', '2022 年 4 月，OpenAI'],
      ['Midjourney', '2022 年 7 月开放公测，在 Discord 里用一句话出图'],
      ['Stable Diffusion', '2022 年 8 月公开发布，并放出模型权重'],
      ['原理', '扩散模型：从一张满是噪点的图出发，一步步去噪，朝文字描述还原画面']
    ],
    happened: [
      '2022 年，文字生成图片在几个月里从实验室走进大众。4 月，OpenAI 发布 DALL·E 2；7 月，Midjourney 开放公测；8 月，Stability AI 公开发布 Stable Diffusion，还放出了模型本身，任何人都能在自己的电脑上运行。',
      '它们背后主要是“扩散模型”：先给一张满是噪点的图，再一步步去掉噪点，往文字描述的方向还原出画面。'
    ],
    why: [
      '出图的门槛一下子从专业软件降到了一句话。Stable Diffusion 开放之后，冒出了大量插件、风格模型和工作流程。',
      '版权争议也随之而来：训练用的图片大多没有经过作者同意，画师和图库公司提起了多起诉讼。'
    ],
    use: [
      '花屿的插画和漫画也是用 AI 绘图工具画的。我们的经验：先定角色设定图（造型、颜色、比例），再一格一格出图；每格写清楚画什么、哪里留白，和给人写需求一样。'
    ],
    open: [
      '训练数据的授权、生成图能不能受版权保护，各国法律还在形成。画面里的手、文字，以及前后一致的角色，一直是难点。'
    ],
    sources: [
      ['OpenAI · DALL·E 2', 'https://openai.com/index/dall-e-2/'],
      ['Stability AI · Stable Diffusion 公开发布', 'https://stability.ai/news-updates/stable-diffusion-public-release'],
      ['潜在扩散模型论文 · arXiv 2112.10752', 'https://arxiv.org/abs/2112.10752']
    ]
  },
  {
    id: 'chatgpt', date: '2022.11', kind: '公司', who: 'OpenAI',
    title: 'ChatGPT 与 OpenAI：AI 第一次走进每个人的生活',
    short: '一个对话框，让不写代码的人也用上了大模型。',
    facts: [
      ['发布', '2022 年 11 月 30 日，免费开放试用'],
      ['公司', 'OpenAI，2015 年在旧金山成立，起初是非营利研究机构'],
      ['方法', '基于人类反馈的强化学习（RLHF），2022 年 3 月的 InstructGPT 论文已公开'],
      ['之后', 'GPT-4（2023 年 3 月）、o1（2024 年 9 月）、GPT-5（2025 年 8 月）']
    ],
    happened: [
      '2022 年 11 月 30 日，OpenAI 发布 ChatGPT，免费开放试用。它基于 GPT-3.5 系列模型，用“基于人类反馈的强化学习”调教过：先请人写示范回答、给不同的回答排好坏，再让模型朝人更喜欢的方向调整。',
      '据瑞银估算，ChatGPT 上线约两个月，月活跃用户就超过了一亿。',
      'OpenAI 在 2015 年成立，起初是非营利机构，2019 年设立了“利润有上限”的营利公司，微软随后成为最大的投资方。'
    ],
    why: [
      'GPT-3 的能力早就有了，真正变的是形式：一个对话框，用人话提问，不用写一行代码。AI 从开发者的工具变成了大众产品，也逼得谷歌、Meta 等公司全面提速。'
    ],
    use: [
      '对话的关键是“来回改”。第一版不满意，直接告诉它哪里不对、想要什么样，往往比重新写一段长提示更快。'
    ],
    open: [
      '这种调教方法让模型更礼貌，也更会讨好人，有时会顺着你说错的话往下说。OpenAI 的公司结构、安全承诺和商业化节奏一直有争议，2023 年 11 月还出现过 CEO 被董事会解职、几天后又复职的风波。',
      'OpenAI 发布新型号很频繁，最新的型号和能力，以它的官方新闻页为准。'
    ],
    sources: [
      ['OpenAI · Introducing ChatGPT', 'https://openai.com/index/chatgpt/'],
      ['InstructGPT 论文 · arXiv 2203.02155', 'https://arxiv.org/abs/2203.02155'],
      ['OpenAI 官方新闻页（看最新型号）', 'https://openai.com/news/']
    ]
  },
  {
    id: 'llama', date: '2023.02', kind: '开放权重', who: 'Meta',
    title: 'Llama：把大模型交到更多人手里',
    short: 'Meta 放出模型权重，人人可以下载到自己的机器上跑。',
    facts: [
      ['LLaMA', '2023 年 2 月 24 日，70 亿到 650 亿参数，最初只向研究者开放'],
      ['Llama 2', '2023 年 7 月，允许商用'],
      ['之后', 'Llama 3（2024 年 4 月）、Llama 4（2025 年 4 月）']
    ],
    happened: [
      '2023 年 2 月，Meta 发布 LLaMA，最初只给申请通过的研究者使用，没过多久，模型文件就在网上流传开了。7 月的 Llama 2 开始允许商用，之后的 Llama 3、Llama 4 也都开放下载。'
    ],
    why: [
      '“开放权重”的意思是：模型本身可以下载，能放在自己的电脑或服务器上运行、修改、再训练。它带动了一大批开源模型和工具，小公司和研究者不必完全依赖几家大公司的接口。'
    ],
    use: [
      '要处理敏感资料的团队，可以用开放权重的模型在自己的服务器上跑，资料不出门。代价是要自己维护，效果通常也不如最强的闭源模型。'
    ],
    open: [
      '开放权重不等于完全开源：训练数据和完整的训练方法没有公开，许可证也有限制。到了 2026 年，Meta 自己也转向了闭源（见 Muse Spark）。'
    ],
    sources: [
      ['Meta AI · Introducing LLaMA', 'https://ai.meta.com/blog/large-language-model-llama-meta-ai/'],
      ['LLaMA 论文 · arXiv 2302.13971', 'https://arxiv.org/abs/2302.13971']
    ]
  },
  {
    id: 'claude', date: '2023.03', kind: '公司', who: 'Anthropic',
    title: 'Claude 与 Anthropic：把安全当成产品的一部分',
    short: '一家把“让 AI 可靠”当主业的公司，和它的模型 Claude。',
    facts: [
      ['公司', 'Anthropic，2021 年成立，注册为公益公司'],
      ['方法', '宪法式 AI（2022 年 12 月论文）：让模型按一份写明的原则自己检查、修改回答'],
      ['发布', '第一代 Claude，2023 年 3 月 14 日，和 GPT-4 同一天'],
      ['之后', 'Claude 3（2024 年 3 月）分出 Haiku、Sonnet、Opus 三档；2025 年推出写代码的 Claude Code']
    ],
    happened: [
      'Anthropic 在 2021 年成立，创始团队包括从 OpenAI 离开的达里奥·阿莫迪（Dario Amodei）、丹妮拉·阿莫迪（Daniela Amodei）兄妹等人。公司把自己定位为 AI 安全与研究公司。',
      '2022 年 12 月，它发表“宪法式 AI”论文：给模型一份写明原则的“宪法”，让模型按这些原则自己批评、修改回答，减少对大量人工打分的依赖。2023 年 3 月 14 日，第一代 Claude 发布。'
    ],
    why: [
      'Anthropic 的特别之处，是把“怎样让模型可靠、可被看懂”当作核心研究：公开模型的行为准则，研究模型内部到底在算什么（可解释性），还发布了“负责任扩展政策”，规定模型能力到了某个程度，就必须配上相应的安全措施。',
      '2025 年起，Claude 在写代码和长时间自主干活上很受开发者欢迎。'
    ],
    use: [
      '和 Claude 合作，把目标、标准和材料写清楚效果最好。它常会直说“我不确定”，或指出你材料里互相矛盾的地方，这类回答值得停下来看。'
    ],
    open: [
      '安全优先和商业竞争之间一直有张力：慢了会落后，快了又和自己的主张冲突。外界也在讨论，这些自我约束能不能被独立检验。最新的型号以官方新闻页为准。'
    ],
    sources: [
      ['Anthropic · Introducing Claude', 'https://www.anthropic.com/news/introducing-claude'],
      ['宪法式 AI 论文 · arXiv 2212.08073', 'https://arxiv.org/abs/2212.08073'],
      ['Anthropic · Core views on AI safety', 'https://www.anthropic.com/news/core-views-on-ai-safety'],
      ['Anthropic 官方新闻页（看最新型号）', 'https://www.anthropic.com/news']
    ]
  },
  {
    id: 'grok', date: '2023.11', kind: '公司', who: 'xAI',
    title: 'Grok 与 xAI：接上实时信息流的 AI',
    short: '能直接看 X 上的实时帖子，说话也更随意。',
    facts: [
      ['公司', 'xAI，2023 年由埃隆·马斯克创立'],
      ['发布', 'Grok，2023 年 11 月 3 日'],
      ['特点', '灵感来自小说《银河系漫游指南》；能通过 X 平台获取实时信息'],
      ['之后', 'Grok 4（2025 年 7 月）；在美国孟菲斯建了大型算力中心 Colossus']
    ],
    happened: [
      '2023 年，埃隆·马斯克创立 xAI。11 月 3 日，xAI 发布 Grok。官方说它的灵感来自小说《银河系漫游指南》，回答带点幽默和“叛逆”，而且能通过 X（原来的推特）获取实时信息。之后版本更新很快，2025 年 7 月发布了 Grok 4。'
    ],
    why: [
      'Grok 的不同在两点：一是直接接上 X 的实时帖子，问刚发生的事有优势；二是风格更放得开，愿意回答一些别家会拒绝的问题。这让它站在了“AI 的边界该划在哪里”这场争论的另一头。'
    ],
    use: [
      '追热点、看舆论风向时，Grok 搜得快。但社交平台上的消息本来就真假混杂，关键的事实要回到原始来源再核对一遍。'
    ],
    open: [
      '放得开的风格多次引发争议，出现过冒犯性的输出，xAI 事后做过修正和道歉。模型和 X 平台、和马斯克其他公司之间的数据与利益边界，也让人担心。最新的型号以官方新闻页为准。'
    ],
    sources: [
      ['xAI · Announcing Grok', 'https://x.ai/news/grok'],
      ['xAI · Grok 4', 'https://x.ai/news/grok-4'],
      ['xAI 官方新闻页（看最新型号）', 'https://x.ai/news']
    ]
  },
  {
    id: 'gemini', date: '2023.12', kind: '公司', who: 'Google DeepMind',
    title: 'Gemini 与 Google DeepMind：从一开始就能看图听声',
    short: '谷歌把模型放进几十亿人每天在用的产品里。',
    facts: [
      ['合并', '2023 年 4 月，DeepMind 和谷歌大脑合并为 Google DeepMind'],
      ['Gemini 1.0', '2023 年 12 月 6 日，强调“原生多模态”'],
      ['Gemini 1.5', '2024 年 2 月，一次能读约 100 万个 token'],
      ['Gemini 3', '2025 年 11 月 18 日，进入 Gemini 应用、搜索的 AI 模式和开发者平台']
    ],
    happened: [
      '2023 年 4 月，谷歌把 DeepMind 和谷歌大脑合并成 Google DeepMind，由德米斯·哈萨比斯（Demis Hassabis）领导。12 月 6 日，Gemini 1.0 发布，主打“原生多模态”：从训练开始就同时学文字、图片、声音、视频和代码。',
      '2024 年 2 月的 Gemini 1.5 把一次能读的长度拉到约 100 万个 token，大概相当于几本书。2025 年 11 月 18 日发布 Gemini 3，谷歌称是它最强的模型，同一天上线到 Gemini 应用、搜索的 AI 模式和开发者工具。'
    ],
    why: [
      '谷歌手里有搜索、安卓、YouTube、Gmail、文档，还有自己设计的 AI 芯片。Gemini 的打法是把模型放进几十亿人已经在用的产品里，而不只是做一个单独的聊天应用。别忘了，Transformer 本来就出自谷歌。'
    ],
    use: [
      '要一次读完很长的材料（整本书、几小时的视频、一大堆文件），可以先试 Gemini 这类长上下文强的模型。平时用 Gmail、谷歌文档的人，直接在里面用会更顺手。'
    ],
    open: [
      'ChatGPT 出来时谷歌被打了个措手不及，早期的演示和图像生成都出过差错。AI 答案放进搜索之后，网站的流量和内容作者的收入会受到什么影响，是新的争议。最新的型号以官方页面为准。'
    ],
    sources: [
      ['Google · Introducing Gemini（2023）', 'https://blog.google/technology/ai/google-gemini-ai/'],
      ['Google · Gemini 3（2025）', 'https://blog.google/products/gemini/gemini-3/'],
      ['Google DeepMind · Gemini 模型页（看最新型号）', 'https://deepmind.google/models/gemini/']
    ]
  },
  {
    id: 'reasoning', date: '2024.09', kind: '方法', who: 'OpenAI',
    title: '先想再答：推理模型 o1',
    short: '不只是把模型做大，还可以让它回答前多想一会儿。',
    facts: [
      ['发布', '2024 年 9 月 12 日，o1 预览版'],
      ['做法', '回答前先写一段很长的内部思考，用强化学习训练它把这段思考用好'],
      ['之后', 'DeepSeek-R1、Claude 的扩展思考、Gemini 的 Deep Think 等相继出现']
    ],
    happened: [
      '2024 年 9 月 12 日，OpenAI 发布 o1 预览版。和以前的模型不同，它在回答前会先在内部写一段很长的“思考”，一步步推。OpenAI 用强化学习训练它把这段思考用好。在数学竞赛题、编程和理科题上，它的成绩比之前的 GPT-4o 高出一大截。'
    ],
    why: [
      '方向变了：以前主要靠“训练时做得更大”，现在还可以靠“回答时多想一会儿”，用更多的计算时间换更好的答案。之后几乎每家都推出了自己的“思考”模式。'
    ],
    use: [
      '难的分析、算账、写代码、多步骤的规划，值得打开“思考”模式；简单的改写、翻译、起名字，用快速模式就够，又快又省钱。'
    ],
    open: [
      '想得越久，越慢也越贵。模型展示出来的“思考过程”，不一定如实反映它真正是怎么算出答案的，研究者还在争论。'
    ],
    sources: [['OpenAI · Learning to reason with LLMs', 'https://openai.com/index/learning-to-reason-with-llms/']]
  },
  {
    id: 'deepseek', date: '2025.01', kind: '开放权重', who: '深度求索',
    title: 'DeepSeek-R1：用更少的钱做出推理模型',
    short: '一家杭州公司开放了接近顶尖水平的推理模型。',
    facts: [
      ['发布', '2025 年 1 月 20 日，以 MIT 许可证开放模型权重'],
      ['公司', '深度求索（DeepSeek），总部在杭州'],
      ['成本', 'DeepSeek-V3 技术报告估算最终一次训练约 560 万美元（只算租用显卡的费用）'],
      ['冲击', '2025 年 1 月 27 日，英伟达市值单日蒸发约 5900 亿美元']
    ],
    happened: [
      '2025 年 1 月 20 日，杭州的深度求索发布推理模型 DeepSeek-R1，并且开放了模型权重，允许商用。它在数学、编程和推理测试上的成绩接近 OpenAI 的 o1，接口价格却低很多。论文公开了主要的训练方法：大量使用强化学习，让模型自己学会一步步推理。'
    ],
    why: [
      '它让很多人重新估算“做一个顶尖模型到底要花多少钱”。发布一周后，美国芯片股大跌，英伟达单日市值蒸发约 5900 亿美元。它也说明推理能力可以开放出来，让全世界的人下载、研究。'
    ],
    use: [
      '做中文内容、预算紧、想自己部署的团队，可以把它列进候选。用官方应用和接口时，要留意数据存在哪里、受哪国法律管辖。'
    ],
    open: [
      '560 万美元只是最后一次训练的估算，不包括前期研究和其他开销。外界对它的训练数据来源和真实算力规模有不少猜测，多国政府机构也限制在公务设备上使用。'
    ],
    sources: [
      ['DeepSeek-R1 论文 · arXiv 2501.12948', 'https://arxiv.org/abs/2501.12948'],
      ['DeepSeek 官方发布公告', 'https://api-docs.deepseek.com/news/news250120']
    ]
  },
  {
    id: 'agents', date: '2025', kind: '方法', who: 'Anthropic · OpenAI · 谷歌',
    title: 'AI 开始动手：智能体和写代码的 AI',
    short: '从回答问题，到替你把一件事做完。',
    facts: [
      ['Claude Code', '2025 年 2 月 24 日随 Claude 3.7 Sonnet 推出预览，5 月随 Claude 4 正式发布'],
      ['同年', 'OpenAI 推出 Codex 编程智能体；谷歌随 Gemini 3 推出 Antigravity 开发平台'],
      ['变化', '能连续工作的时间越来越长，能调用的工具越来越多']
    ],
    happened: [
      '2025 年，AI 从“回答问题”走向“替你把事做完”。2 月，Anthropic 推出 Claude Code 的预览版：它在电脑终端里直接读代码、改文件、运行命令，5 月正式发布。同一年，OpenAI 推出了 Codex 编程智能体，谷歌在发布 Gemini 3 时推出了 Antigravity 开发平台。'
    ],
    why: [
      '一个能自己拆任务、调用工具、检查结果再修改的 AI，用法就从“问答”变成了“派活”。人的角色变成：定目标、给材料、验收结果。'
    ],
    use: [
      '花屿这个网站就是这样做出来的：网页和文字由 Claude Code 写，插画由 Codex 画，每次都按一张写清楚的工单干活，做完由人验收。我们的经验是：写清楚“做到什么程度算完成”，比教它怎么做更重要。'
    ],
    open: [
      '智能体会犯错，而且错误可能直接落到真实的文件和账户上，所以权限要收紧，关键操作要人确认。它能替代多少工作、对就业影响多大，现在还没有可靠的结论。'
    ],
    sources: [
      ['Anthropic · Claude 3.7 Sonnet and Claude Code', 'https://www.anthropic.com/news/claude-3-7-sonnet'],
      ['Anthropic · Claude 4', 'https://www.anthropic.com/news/claude-4'],
      ['Google · Gemini 3 与 Antigravity', 'https://blog.google/products/gemini/gemini-3/']
    ]
  },
  {
    id: 'muse', date: '2026.04', kind: '公司', who: 'Meta',
    title: 'Muse Spark：Meta 从开放转向闭源',
    short: 'Meta 超级智能实验室的第一个模型，不再开放下载。',
    facts: [
      ['发布', '2026 年 4 月 8 日，Meta 超级智能实验室（MSL）的第一个模型'],
      ['模式', '“即时”和“思考”两种模式，还能同时派出多个子智能体'],
      ['开放', '没有开放权重，只向部分合作方提供私有预览接口'],
      ['去处', 'Meta AI 应用和 meta.ai，再陆续进入 WhatsApp、Instagram、Facebook、Messenger 和智能眼镜']
    ],
    happened: [
      '2025 年，Meta 重组 AI 团队，成立超级智能实验室，由 Scale AI 创始人亚历山大·王（Alexandr Wang）领导。2026 年 4 月 8 日，实验室发布第一个模型 Muse Spark。',
      '官方说它“小而快”，能推理科学、数学、健康方面的复杂问题，能看懂图片和图表；有“即时”和“思考”两种模式，还能同时派出多个子智能体，分头处理同一个问题。'
    ],
    why: [
      '和 Llama 不同，Muse Spark 不能下载，开发者只能通过向部分合作方开放的私有预览接口使用。Meta 表示“希望未来开源后续版本”。曾经最积极推动开放权重的公司转向闭源，说明顶尖模型的竞争已经贵到连 Meta 也要重新算账。'
    ],
    use: [
      'Meta 的优势是分发：几十亿人每天打开的聊天和社交应用。对做营销和内容的人来说，AI 直接长进 Instagram 和 WhatsApp，意味着用户会在聊天框和搜索框里直接问 AI。你的内容怎样被 AI 找到、引用，会越来越重要。'
    ],
    open: [
      'Meta 公布的测试成绩是自己测的，独立评测还在积累；一些新功能先在美国上线。依赖 Llama 的开发者，也在担心 Meta 之后的开放路线。'
    ],
    sources: [
      ['Meta 新闻室 · Introducing Muse Spark', 'https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/'],
      ['Meta AI 博客 · Muse Spark', 'https://ai.meta.com/blog/introducing-muse-spark-msl/']
    ]
  },
  {
    id: 'now', date: '现在', kind: '导读', who: '花屿编辑部',
    title: '怎样追上最新的型号',
    short: '各家几乎每月都在更新，这里只记改变方向的事。',
    facts: [
      ['节奏', '主流公司的新型号，常常一两个月就更新一次'],
      ['我们记什么', '改变了做法、用法或格局的事；版本号的小升级不单开一页'],
      ['怎么核对', '日期和数字回到官方发布页和论文']
    ],
    happened: [
      '到 2026 年，OpenAI、Anthropic、谷歌、xAI、Meta 和深度求索几乎每个月都有新消息：新型号、新模式、新工具。网上的二手消息常常互相矛盾，版本号也容易记混。'
    ],
    why: [
      '对用 AI 做事的人来说，比“哪个最新”更重要的是：哪件事改变了用法。比如 2024 年的“先想再答”、2025 年的“能动手的智能体”，这些会长久影响你怎么用；单纯的版本升级，过几个月就被下一个替代。'
    ],
    use: [
      '想知道最新型号，直接看各家的官方发布页，下面列好了。看到“某某模型全面超越”的说法，先看是谁测的、测的什么。'
    ],
    open: [
      '编年史会一直往后写。新的转折出现，我们就续一篇；旧的判断不删，写错的地方会在原文后面注明改了什么。'
    ],
    sources: [
      ['OpenAI 新闻', 'https://openai.com/news/'],
      ['Anthropic 新闻', 'https://www.anthropic.com/news'],
      ['Google DeepMind · Gemini', 'https://deepmind.google/models/gemini/'],
      ['xAI 新闻', 'https://x.ai/news'],
      ['Meta AI 博客', 'https://ai.meta.com/blog/'],
      ['DeepSeek 官网', 'https://www.deepseek.com/']
    ]
  }
];
