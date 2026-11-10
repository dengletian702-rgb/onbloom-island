/* 花屿 · AI 编年史。每一条在首页占一行，在 #/ai/<id> 单开一页。
   只记改变 AI 走向的事；日期和数字都回到原始出处核对过（2026-10-28）。 */
window.HUAYU_CHRONICLE = [
  {
    id: 'transformer', date: '2017.06', kind: 'Paper', who: 'Google',
    title: 'Attention is all you need: the Transformer is born',
    short: 'One Google paper replaced the “engine” of language models.',
    facts: [
      ['Published', '12 June 2017 on arXiv; presented at NeurIPS the same year'],
      ['Authors', 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin'],
      ['Core idea', 'Self-attention: every word in a sentence “looks at” every other word at once'],
      ['Later', 'The T in GPT stands for Transformer']
    ],
    happened: [
      'In June 2017, eight Google authors published “Attention Is All You Need” on arXiv. It proposed a model architecture called the Transformer: instead of reading word by word in order, every word in a sentence “looks at” all the others at once and works out which words relate most closely. This step is called “self-attention”.',
      'The paper\'s experiments were on machine translation. On English-to-German and English-to-French benchmarks it beat the best results of the time, and trained in far less time.'
    ],
    why: [
      'Before this, mainstream language models (recurrent neural networks) had to process text in order, which was hard to parallelise, and in long sentences the early information faded. The Transformer computes a whole passage at once, which could soak up ever more GPU compute.',
      'GPT, BERT, Claude, Gemini and Grok that followed are nearly all built on this architecture. Calling it the common ancestor of today\'s large models is no exaggeration.'
    ],
    use: [
      'Two things are enough to remember. First, the model reads your words by looking at the whole passage and finding relationships, so keeping instructions, material and examples clearly separate helps it find the right ones. Second, there\'s a limit to how much it can see at once (the “context window”); anything beyond it, it can\'t see.'
    ],
    open: [
      'The paper only tackled translation; the authors didn\'t predict chatbots. Attention\'s computation grows with the square of text length, so long texts have always been hard, and much later research has tried to cut that cost.'
    ],
    sources: [['Original paper · arXiv 1706.03762', 'https://arxiv.org/abs/1706.03762']]
  },
  {
    id: 'pretraining', date: '2018', kind: 'Paper', who: 'OpenAI · Google',
    title: 'Read ten thousand books first: GPT-1 and BERT',
    short: '“Pre-train” on huge amounts of text, then learn specific tasks: a new playbook.',
    facts: [
      ['GPT', 'June 2018, OpenAI; pre-trained on a large body of book text, then fine-tuned'],
      ['BERT', 'October 2018, Google; looks at the context on both sides of a word at once'],
      ['The fork', 'GPT guesses the next word and is good at generating; BERT fills in blanks and is good at understanding and search']
    ],
    happened: [
      'In June 2018, OpenAI released GPT (later called GPT-1): a Transformer first trained on a large body of book text to learn language itself, then lightly adjusted for specific tasks.',
      'That October, Google released BERT. It was also pre-trained, but looked at the text on both sides of a word at once. It broke records by wide margins on a range of reading comprehension and classification benchmarks, and was soon built into Google Search.'
    ],
    why: [
      'Before, almost every task meant training a model from scratch on lots of hand-labelled data. Pre-training separated “learning language” from “learning the task”: read enough text first, and a task can be learned from a little data.',
      'The two paths split here. BERT was the star at the time, but the chat models that came later all followed GPT\'s generative path of “keep writing what comes next”.'
    ],
    use: [
      'Today\'s large models all “read ten thousand books first, then learn the rules”. What they know comes from the text they read in training, so their knowledge has a cut-off date. To ask about recent events, either give it the material or let it search the web.'
    ],
    open: [
      'Models learn not only knowledge from text, but also its biases and errors. The more they read, the harder it is to say what exactly they have learned.'
    ],
    sources: [
      ['OpenAI · Improving language understanding with unsupervised learning', 'https://openai.com/index/language-unsupervised/'],
      ['BERT paper · arXiv 1810.04805', 'https://arxiv.org/abs/1810.04805']
    ]
  },
  {
    id: 'scaling', date: '2020', kind: 'Paper', who: 'OpenAI',
    title: 'Bigger is stronger: scaling laws and GPT-3',
    short: 'Grow the model, data and compute together, and results improve along a curve.',
    facts: [
      ['Scaling laws', 'January 2020, Jared Kaplan et al., “Scaling Laws for Neural Language Models”'],
      ['GPT-3', 'May 2020, 175 billion parameters'],
      ['New use', 'Few-shot learning: give a few examples in the prompt, no retraining needed']
    ],
    happened: [
      'In January 2020, OpenAI researchers published the “scaling laws” paper: scale up model parameters, training data and compute in proportion, and the model\'s error falls along a predictable curve.',
      'That May, OpenAI released GPT-3, with 175 billion parameters. The most surprising part: with no further training, just a few examples in the prompt, it could translate, answer questions, rewrite text and even write simple code.'
    ],
    why: [
      'Scaling laws turned “spending money to make models bigger” from a gamble into an investment you could calculate. In the years that followed, companies raced to build ever bigger compute centres.',
      'GPT-3 also made prompting a skill for the first time: how you describe the task and which examples you give directly decide how good the result is.'
    ],
    use: [
      'Giving examples is still one of the most useful prompting techniques today. If you want a certain format or tone, one or two samples work much better than a pile of adjectives.'
    ],
    open: [
      'The curve won\'t fall forever: high-quality text data is running out, and the returns from scale alone are shrinking. Later, labs began having models “think a bit longer before answering” (see the 2024 reasoning models). GPT-3 also made things up with a straight face, a habit that still hasn\'t been fully cured.'
    ],
    sources: [
      ['Scaling laws paper · arXiv 2001.08361', 'https://arxiv.org/abs/2001.08361'],
      ['GPT-3 paper · arXiv 2005.14165', 'https://arxiv.org/abs/2005.14165']
    ]
  },
  {
    id: 'image-models', date: '2022', kind: 'Product', who: 'OpenAI · Midjourney · Stability AI',
    title: 'AI that paints: DALL·E 2, Midjourney, Stable Diffusion',
    short: 'One sentence, one picture: image generation reached the public within months.',
    facts: [
      ['DALL·E 2', 'April 2022, OpenAI'],
      ['Midjourney', 'Open beta in July 2022: type one sentence in Discord to get a picture'],
      ['Stable Diffusion', 'Public release in August 2022, with the model weights'],
      ['How it works', 'Diffusion models: start from an image full of noise and remove it step by step, recovering a picture that matches the text']
    ],
    happened: [
      'In 2022, text-to-image went from the lab to the public in a matter of months. In April OpenAI released DALL·E 2; in July Midjourney opened its public beta; in August Stability AI released Stable Diffusion publicly, including the model itself, so anyone could run it on their own computer.',
      'Behind them are mainly “diffusion models”: start with an image full of noise, then remove the noise step by step, recovering a picture in the direction of the text description.'
    ],
    why: [
      'The barrier to making images dropped overnight from professional software to a single sentence. After Stable Diffusion opened up, a flood of plug-ins, style models and workflows appeared.',
      'Copyright disputes followed: most training images were used without their creators\' consent, and artists and stock image companies filed several lawsuits.'
    ],
    use: [
      'Onbloom Island\'s illustrations and comic were also made with AI image tools. Our experience: settle the character sheets first (shape, colour, proportions), then make the panels one at a time, spelling out for each what to draw and where to leave space, just like writing a brief for a person.'
    ],
    open: [
      'Licensing of training data, and whether generated images can be copyrighted, are still taking shape in law around the world. Hands, text in the image and consistent characters have always been hard.'
    ],
    sources: [
      ['OpenAI · DALL·E 2', 'https://openai.com/index/dall-e-2/'],
      ['Stability AI · Stable Diffusion public release', 'https://stability.ai/news-updates/stable-diffusion-public-release'],
      ['Latent diffusion paper · arXiv 2112.10752', 'https://arxiv.org/abs/2112.10752']
    ]
  },
  {
    id: 'chatgpt', date: '2022.11', kind: 'Company', who: 'OpenAI',
    title: 'ChatGPT and OpenAI: AI enters everyone\'s life for the first time',
    short: 'A chat box put large models in the hands of people who don\'t write code.',
    facts: [
      ['Released', '30 November 2022, free to try'],
      ['Company', 'OpenAI, founded in San Francisco in 2015, originally a non-profit research lab'],
      ['Method', 'Reinforcement learning from human feedback (RLHF), published in the March 2022 InstructGPT paper'],
      ['Afterwards', 'GPT-4 (March 2023), o1 (September 2024), GPT-5 (August 2025)']
    ],
    happened: [
      'On 30 November 2022, OpenAI released ChatGPT, free to try. It was built on the GPT-3.5 series and tuned with reinforcement learning from human feedback: people wrote example answers and ranked different answers, and the model was adjusted toward what people preferred.',
      'By UBS\'s estimate, ChatGPT passed 100 million monthly active users about two months after launch.',
      'OpenAI was founded in 2015 as a non-profit. In 2019 it set up a “capped-profit” company, and Microsoft went on to become its largest investor.'
    ],
    why: [
      'GPT-3\'s abilities were already there; what changed was the form: a chat box where you ask in plain language without writing a line of code. AI went from a developer\'s tool to a mass product, and pushed Google, Meta and others to speed up across the board.'
    ],
    use: [
      'The key to chatting is going back and forth. If the first version isn\'t right, telling it directly what\'s wrong and what you want is often faster than writing a new long prompt.'
    ],
    open: [
      'This tuning makes models more polite, and also more eager to please, sometimes going along with something wrong you said. OpenAI\'s corporate structure, safety commitments and pace of commercialisation have been contested throughout; in November 2023 its CEO was removed by the board and reinstated a few days later.',
      'OpenAI releases new models often; for the latest models and capabilities, go by its official news page.'
    ],
    sources: [
      ['OpenAI · Introducing ChatGPT', 'https://openai.com/index/chatgpt/'],
      ['InstructGPT paper · arXiv 2203.02155', 'https://arxiv.org/abs/2203.02155'],
      ['OpenAI official news page (for the latest models)', 'https://openai.com/news/']
    ]
  },
  {
    id: 'llama', date: '2023.02', kind: 'Open weights', who: 'Meta',
    title: 'Llama: large models in more people\'s hands',
    short: 'Meta released the model weights, so anyone could download them and run them on their own machine.',
    facts: [
      ['LLaMA', '24 February 2023, 7 to 65 billion parameters, initially for researchers only'],
      ['Llama 2', 'July 2023, commercial use allowed'],
      ['Afterwards', 'Llama 3 (April 2024), Llama 4 (April 2025)']
    ],
    happened: [
      'In February 2023, Meta released LLaMA, at first only to approved researchers; before long the model files were circulating online. Llama 2 in July allowed commercial use, and Llama 3 and Llama 4 were also released for download.'
    ],
    why: [
      '“Open weights” means the model itself can be downloaded and run, modified and retrained on your own computer or server. It spurred a wave of open models and tools, so small companies and researchers didn\'t have to depend entirely on a few big companies\' APIs.'
    ],
    use: [
      'Teams handling sensitive material can run an open-weights model on their own servers, so the data never leaves. The price is maintaining it yourself, and results usually trail the strongest closed models.'
    ],
    open: [
      'Open weights isn\'t the same as fully open source: the training data and full training method weren\'t published, and the licence has restrictions. By 2026, Meta itself had turned to closed models (see Muse Spark).'
    ],
    sources: [
      ['Meta AI · Introducing LLaMA', 'https://ai.meta.com/blog/large-language-model-llama-meta-ai/'],
      ['LLaMA paper · arXiv 2302.13971', 'https://arxiv.org/abs/2302.13971']
    ]
  },
  {
    id: 'claude', date: '2023.03', kind: 'Company', who: 'Anthropic',
    title: 'Claude and Anthropic: safety as part of the product',
    short: 'A company whose main business is making AI reliable, and its model, Claude.',
    facts: [
      ['Company', 'Anthropic, founded in 2021, registered as a public benefit corporation'],
      ['Method', 'Constitutional AI (December 2022 paper): the model checks and revises its own answers against a written set of principles'],
      ['Released', 'The first Claude, 14 March 2023, the same day as GPT-4'],
      ['Afterwards', 'Claude 3 (March 2024) came in three tiers: Haiku, Sonnet, Opus; Claude Code, for writing code, launched in 2025']
    ],
    happened: [
      'Anthropic was founded in 2021; its founding team included the siblings Dario Amodei and Daniela Amodei, among others who had left OpenAI. The company describes itself as an AI safety and research company.',
      'In December 2022 it published the “Constitutional AI” paper: give the model a “constitution” of written principles and have it critique and revise its own answers against them, relying less on large amounts of human rating. The first Claude was released on 14 March 2023.'
    ],
    why: [
      'What sets Anthropic apart is treating “how to make models reliable and understandable” as core research: it publishes its models\' behavioural guidelines, studies what is actually being computed inside the model (interpretability), and has published a “Responsible Scaling Policy” requiring matching safety measures once a model\'s capabilities reach certain levels.',
      'From 2025, Claude became popular with developers for writing code and working autonomously for long stretches.'
    ],
    use: [
      'Working with Claude goes best when the goal, criteria and material are written out clearly. It often says plainly “I\'m not sure”, or points out contradictions in your material; answers like that are worth stopping to read.'
    ],
    open: [
      'There is constant tension between putting safety first and competing commercially: too slow and you fall behind, too fast and you contradict your own stance. People also debate whether these self-imposed limits can be independently verified. For the latest models, go by the official news page.'
    ],
    sources: [
      ['Anthropic · Introducing Claude', 'https://www.anthropic.com/news/introducing-claude'],
      ['Constitutional AI paper · arXiv 2212.08073', 'https://arxiv.org/abs/2212.08073'],
      ['Anthropic · Core views on AI safety', 'https://www.anthropic.com/news/core-views-on-ai-safety'],
      ['Anthropic official news page (for the latest models)', 'https://www.anthropic.com/news']
    ]
  },
  {
    id: 'grok', date: '2023.11', kind: 'Company', who: 'xAI',
    title: 'Grok and xAI: AI plugged into a real-time feed',
    short: 'It can read live posts on X directly, and talks more casually.',
    facts: [
      ['Company', 'xAI, founded by Elon Musk in 2023'],
      ['Released', 'Grok, 3 November 2023'],
      ['What\'s different', 'Inspired by the novel “The Hitchhiker\'s Guide to the Galaxy”; gets real-time information through X'],
      ['Afterwards', 'Grok 4 (July 2025); built a large compute centre, Colossus, in Memphis, USA']
    ],
    happened: [
      'In 2023, Elon Musk founded xAI. On 3 November, xAI released Grok. The company said it was inspired by “The Hitchhiker\'s Guide to the Galaxy”, answers with some humour and a “rebellious streak”, and gets real-time information through X (formerly Twitter). New versions came quickly, with Grok 4 released in July 2025.'
    ],
    why: [
      'Grok differs in two ways: it connects directly to live posts on X, giving it an edge on things that just happened; and its style is looser, willing to answer some questions others would refuse. That puts it on the other side of the debate over where AI\'s limits should be drawn.'
    ],
    use: [
      'For following trending topics and the mood of public opinion, Grok searches fast. But social media mixes truth and falsehood by nature, so check key facts against the original sources.'
    ],
    open: [
      'Its loose style has caused controversy several times, including offensive output, after which xAI made corrections and apologised. The boundaries of data and interests between the model, X and Musk\'s other companies are also a concern. For the latest models, go by the official news page.'
    ],
    sources: [
      ['xAI · Announcing Grok', 'https://x.ai/news/grok'],
      ['xAI · Grok 4', 'https://x.ai/news/grok-4'],
      ['xAI official news page (for the latest models)', 'https://x.ai/news']
    ]
  },
  {
    id: 'gemini', date: '2023.12', kind: 'Company', who: 'Google DeepMind',
    title: 'Gemini and Google DeepMind: seeing and hearing from the start',
    short: 'Google put its model into products billions of people use every day.',
    facts: [
      ['Merger', 'April 2023: DeepMind and Google Brain merged into Google DeepMind'],
      ['Gemini 1.0', '6 December 2023, built to be “natively multimodal”'],
      ['Gemini 1.5', 'February 2024, reads about a million tokens at once'],
      ['Gemini 3', '18 November 2025, shipped to the Gemini app, AI Mode in Search and developer platforms']
    ],
    happened: [
      'In April 2023, Google merged DeepMind and Google Brain into Google DeepMind, led by Demis Hassabis. On 6 December, Gemini 1.0 was released, billed as “natively multimodal”: trained from the start on text, images, audio, video and code together.',
      'Gemini 1.5 in February 2024 stretched what it could read at once to about a million tokens, roughly several books. Gemini 3 was released on 18 November 2025; Google called it its most capable model, and it went live the same day in the Gemini app, AI Mode in Search and developer tools.'
    ],
    why: [
      'Google has Search, Android, YouTube, Gmail and Docs, plus AI chips of its own design. Gemini\'s play is to put the model inside products billions of people already use, rather than just ship a separate chat app. Remember, the Transformer came out of Google in the first place.'
    ],
    use: [
      'To read very long material in one go (a whole book, hours of video, a pile of files), try a strong long-context model like Gemini first. If you already live in Gmail and Google Docs, using it right there is smoother.'
    ],
    open: [
      'ChatGPT caught Google off guard, and its early demos and image generation both had mistakes. Now that AI answers sit inside Search, how that affects website traffic and creators\' income is a new controversy. For the latest models, go by the official page.'
    ],
    sources: [
      ['Google · Introducing Gemini (2023)', 'https://blog.google/technology/ai/google-gemini-ai/'],
      ['Google · Gemini 3 (2025)', 'https://blog.google/products/gemini/gemini-3/'],
      ['Google DeepMind · Gemini models page (for the latest models)', 'https://deepmind.google/models/gemini/']
    ]
  },
  {
    id: 'reasoning', date: '2024.09', kind: 'Method', who: 'OpenAI',
    title: 'Think before answering: the reasoning model o1',
    short: 'Not only making the model bigger: you can also let it think longer before answering.',
    facts: [
      ['Released', '12 September 2024, o1-preview'],
      ['Approach', 'Write a long internal chain of thought before answering, trained with reinforcement learning to use that thinking well'],
      ['Afterwards', 'DeepSeek-R1, Claude\'s extended thinking, Gemini\'s Deep Think and others followed']
    ],
    happened: [
      'On 12 September 2024, OpenAI released o1-preview. Unlike earlier models, it first writes a long internal “thinking” passage before answering, reasoning step by step. OpenAI trained it with reinforcement learning to use that thinking well. On maths competition problems, coding and science questions, it scored far above the earlier GPT-4o.'
    ],
    why: [
      'The direction changed: before, progress came mainly from “bigger at training time”; now it can also come from “thinking longer at answer time”, trading more compute for better answers. Almost every lab then launched its own “thinking” mode.'
    ],
    use: [
      'Hard analysis, calculations, code and multi-step planning are worth switching on “thinking” mode; simple rewrites, translations and naming are fine in fast mode, which is quicker and cheaper.'
    ],
    open: [
      'The longer it thinks, the slower and more expensive it gets. Researchers are still debating whether the “thinking” a model shows faithfully reflects how it actually reached its answer.'
    ],
    sources: [['OpenAI · Learning to reason with LLMs', 'https://openai.com/index/learning-to-reason-with-llms/']]
  },
  {
    id: 'deepseek', date: '2025.01', kind: 'Open weights', who: 'DeepSeek',
    title: 'DeepSeek-R1: a reasoning model for far less money',
    short: 'A Hangzhou company released a near-frontier reasoning model openly.',
    facts: [
      ['Released', '20 January 2025, model weights released under the MIT licence'],
      ['Company', 'DeepSeek, headquartered in Hangzhou'],
      ['Cost', 'The DeepSeek-V3 technical report estimated the final training run at about US$5.6 million (GPU rental only)'],
      ['Impact', '27 January 2025: about US$590 billion wiped off Nvidia\'s market value in a single day']
    ],
    happened: [
      'On 20 January 2025, Hangzhou-based DeepSeek released the reasoning model DeepSeek-R1, with open weights that allow commercial use. Its scores on maths, coding and reasoning tests were close to OpenAI\'s o1, at a much lower API price. The paper published the main training method: heavy use of reinforcement learning so the model learns step-by-step reasoning on its own.'
    ],
    why: [
      'It made many people recalculate how much a frontier model really costs. A week after release, US chip stocks plunged, and about US$590 billion was wiped off Nvidia\'s value in a single day. It also showed that reasoning ability can be released openly for anyone in the world to download and study.'
    ],
    use: [
      'Teams working on Chinese content, on a tight budget, or wanting to self-host can put it on the shortlist. When using the official app and API, note where the data is stored and which country\'s laws apply.'
    ],
    open: [
      'The US$5.6 million is only an estimate for the final training run, excluding earlier research and other costs. There is much speculation about its training data sources and true compute scale, and government agencies in several countries have restricted its use on official devices.'
    ],
    sources: [
      ['DeepSeek-R1 paper · arXiv 2501.12948', 'https://arxiv.org/abs/2501.12948'],
      ['DeepSeek official release announcement', 'https://api-docs.deepseek.com/news/news250120']
    ]
  },
  {
    id: 'agents', date: '2025', kind: 'Method', who: 'Anthropic · OpenAI · Google',
    title: 'AI gets hands-on: agents and coding AI',
    short: 'From answering questions to getting a job done for you.',
    facts: [
      ['Claude Code', 'Preview launched with Claude 3.7 Sonnet on 24 February 2025; general release with Claude 4 in May'],
      ['Same year', 'OpenAI launched the Codex coding agent; Google launched the Antigravity development platform with Gemini 3'],
      ['What changed', 'They can work for longer and longer stretches, and call more and more tools']
    ],
    happened: [
      'In 2025, AI moved from “answering questions” to “getting things done for you”. In February, Anthropic released a preview of Claude Code: it reads code, edits files and runs commands directly in the computer\'s terminal, with a general release in May. The same year, OpenAI launched the Codex coding agent, and Google launched the Antigravity development platform alongside Gemini 3.'
    ],
    why: [
      'With an AI that can break down tasks, call tools, check results and revise on its own, the way you use it shifts from “Q&A” to “handing out work”. The human\'s role becomes: set the goal, provide the material, sign off the result.'
    ],
    use: [
      'This site, Onbloom Island, was made exactly this way: the pages and text were written by Claude Code and the illustrations drawn by Codex, each time working from a clearly written ticket, with a person signing off the result. Our experience: spelling out what counts as done matters more than teaching it how to do the job.'
    ],
    open: [
      'Agents make mistakes, and those mistakes can land directly on real files and accounts, so keep permissions tight and have a person confirm key actions. How much work they can replace, and how much they will affect jobs, has no reliable answer yet.'
    ],
    sources: [
      ['Anthropic · Claude 3.7 Sonnet and Claude Code', 'https://www.anthropic.com/news/claude-3-7-sonnet'],
      ['Anthropic · Claude 4', 'https://www.anthropic.com/news/claude-4'],
      ['Google · Gemini 3 and Antigravity', 'https://blog.google/products/gemini/gemini-3/']
    ]
  },
  {
    id: 'muse', date: '2026.04', kind: 'Company', who: 'Meta',
    title: 'Muse Spark: Meta turns from open to closed',
    short: 'The first model from Meta Superintelligence Labs, no longer open for download.',
    facts: [
      ['Released', '8 April 2026, the first model from Meta Superintelligence Labs (MSL)'],
      ['Modes', '“Instant” and “Thinking” modes, and it can dispatch several sub-agents at once'],
      ['Openness', 'No open weights; private preview API for selected partners only'],
      ['Where it goes', 'The Meta AI app and meta.ai, then rolling out to WhatsApp, Instagram, Facebook, Messenger and smart glasses']
    ],
    happened: [
      'In 2025, Meta reorganised its AI teams and set up Meta Superintelligence Labs, led by Scale AI founder Alexandr Wang. On 8 April 2026, the lab released its first model, Muse Spark.',
      'Meta describes it as “small and fast”, able to reason through complex questions in science, maths and health, and to understand images and charts. It has “Instant” and “Thinking” modes, and can dispatch several sub-agents at once to work on the same problem in parallel.'
    ],
    why: [
      'Unlike Llama, Muse Spark can\'t be downloaded; developers can only use it through a private preview API open to selected partners. Meta says it “hopes to open-source future versions”. That the company once most eager to push open weights has turned closed shows frontier competition has become so expensive that even Meta has to redo the sums.'
    ],
    use: [
      'Meta\'s advantage is distribution: chat and social apps billions of people open every day. For people in marketing and content, AI growing right into Instagram and WhatsApp means users will ask AI directly in chat and search boxes. How your content gets found and cited by AI will matter more and more.'
    ],
    open: [
      'The benchmark scores Meta published are its own; independent evaluations are still coming in, and some new features launch in the US first. Developers who rely on Llama are also worried about Meta\'s openness from here on.'
    ],
    sources: [
      ['Meta Newsroom · Introducing Muse Spark', 'https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/'],
      ['Meta AI blog · Muse Spark', 'https://ai.meta.com/blog/introducing-muse-spark-msl/']
    ]
  },
  {
    id: 'now', date: 'Now', kind: 'Guide', who: 'Onbloom Island editors',
    title: 'How to keep up with the latest models',
    short: 'The labs update almost monthly; here we only record what changes direction.',
    facts: [
      ['Pace', 'Major labs often ship a new model every month or two'],
      ['What we record', 'Things that changed methods, usage or the landscape; minor version bumps don\'t get their own page'],
      ['How to check', 'Dates and figures go back to official release pages and papers']
    ],
    happened: [
      'By 2026, OpenAI, Anthropic, Google, xAI, Meta and DeepSeek have news almost every month: new models, new modes, new tools. Second-hand reports online often contradict each other, and version numbers are easy to mix up.'
    ],
    why: [
      'For people who use AI to get work done, what matters more than “which is newest” is which events changed how you use it. Things like 2024\'s “think before answering” and 2025\'s “agents that act” will shape how you work for a long time; a plain version upgrade is replaced by the next one within months.'
    ],
    use: [
      'For the latest models, go straight to each lab\'s official release page, listed below. When you see a claim that “model X beats everything”, first check who tested it and what they tested.'
    ],
    open: [
      'The chronicle will keep going. When a new turning point comes, we add an entry; old judgements aren\'t deleted, and anything we got wrong gets a note after the original saying what changed.'
    ],
    sources: [
      ['OpenAI news', 'https://openai.com/news/'],
      ['Anthropic news', 'https://www.anthropic.com/news'],
      ['Google DeepMind · Gemini', 'https://deepmind.google/models/gemini/'],
      ['xAI news', 'https://x.ai/news'],
      ['Meta AI blog', 'https://ai.meta.com/blog/'],
      ['DeepSeek website', 'https://www.deepseek.com/']
    ]
  }
];
