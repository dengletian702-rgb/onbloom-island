(() => {
  'use strict';

  // All content is local editorial material, adapted from design/2026-10-27/ppt-pilot-v1.md.
  // Nothing here calls an AI model or posts anything; notes stay in this browser.
  const UPDATED = '2026-10-27';
  const CHECKED = '2026-10-28';
  const STORAGE_KEY = 'p8-bloom-notebook-v1';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const link = (href, className, text) => {
    const a = el('a', className, text);
    a.href = href;
    return a;
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- content ---------- */

  const prompts = [
    {
      id: 'prompt-materials', number: '01', title: 'Sort the material, keep what\'s uncertain',
      summary: 'Separate what you know, what you think, and what still needs checking.',
      tags: ['Talks and slides', 'Original template'],
      fields: [
        ['audience', 'Audience', 'Friends who are just starting to learn AI'],
        ['topic', 'Topic', 'What do you want to make clear?'],
        ['duration', 'Target length', 'about 5 minutes'],
        ['known', 'What the audience already knows', 'What they already understand about the topic'],
        ['takeaway', 'The change you want them to leave with', 'After listening, what should they understand or be able to judge?'],
        ['materials', 'Your real material', 'Paste notes, quotes, facts and sources, numbered S1, S2, S3', true]
      ],
      build: v => `I'm preparing to explain to ${v.audience} the topic of ${v.topic}, in about ${v.duration}.\nThe audience already knows: ${v.known}.\nAfterwards I want them to understand or be able to judge: ${v.takeaway}.\n\nHere is my real material:\n${v.materials}\n\nPlease sort this first; don't write the full talk yet:\n1. Restate in one sentence what I want to say.\n2. List separately: facts the material directly supports, my opinions, and ideas still to be confirmed.\n3. Point out which material is irrelevant to this talk, and why.\n4. If missing information would change the main point, ask me at most three key questions.\n\nKeep the material numbers. Don't invent data, examples, audience reactions or work that has already been done.`,
      note: 'Use this once you have real material. The template has not been run or evaluated yet; the grey text in the fields is only a hint for filling them in, not a result.'
    },
    {
      id: 'prompt-structure', number: '02', title: 'Compare structures before writing the talk',
      summary: 'Choose the order of the argument first, then ask for the full script.',
      tags: ['Talks and slides', 'Original template'],
      fields: [
        ['point', 'Confirmed core sentence', 'The one sentence you want the audience to remember'],
        ['materials', 'Real material, numbered', 'Notes and evidence this talk might use', true],
        ['mustKeep', 'Meaning that must be kept', 'Meaning, constraints and requirements', true],
        ['unknown', 'Things still undecided', 'What hasn\'t been decided or isn\'t known yet', true],
        ['pages', 'Maximum number of slides', '6']
      ],
      build: v => `Confirmed core sentence: ${v.point}.\nReal material, numbered:\n${v.materials}\nMeaning that must be kept:\n${v.mustKeep}\nThings still undecided:\n${v.unknown}\n\nPlease propose two different orders for presenting this, each no longer than ${v.pages} slides.\nFor each slide write only: the question it answers, one core sentence, and the matching material numbers.\nSay which audience each order suits, and point out where the talk is most likely to lose its thread.\nDon't present suggestions as features that already exist, and don't add stories just to fill slides.\n\nOnce I've chosen a structure, write a short script based on it.`,
      note: 'Use this after the core sentence has been checked. AI can offer different options; which one to choose is still your call. Not yet tried.'
    },
    {
      id: 'prompt-visual', number: '03', title: 'Make the visuals serve the content',
      summary: 'Ask what each visual helps people understand before talking about decoration.',
      tags: ['Talks and slides', 'Original template'],
      fields: [
        ['outline', 'The chosen slide-by-slide structure', 'One question and one core sentence per slide', true],
        ['feeling', 'Desired feel', 'e.g. warm, free, imaginative'],
        ['reading', 'Reading conditions that can\'t be sacrificed', 'Display device, font-size needs or other known conditions', true]
      ],
      build: v => `Here is the slide-by-slide structure I chose:\n${v.outline}\nDesired feel: ${v.feeling}.\nReading conditions that can't be sacrificed: ${v.reading}.\n\nFor each slide, suggest one way of presenting it that helps understanding, and say what it helps people understand.\nDescribe it in words first; don't generate images or slides.\nKeep one visual focus per slide, and separate essential information from optional decoration.\nIf an image needs a lot of explaining before it makes sense, suggest something more direct.`,
      note: 'Use this once the structure is set and the display conditions are known. It doesn\'t check legibility; look at the real slides on the real device. Not yet tried.'
    },
    {
      id: 'prompt-review', number: '04', title: 'Check whether facts and meaning have drifted',
      summary: 'Put the draft back against the original material and compare it sentence by sentence.',
      tags: ['Talks and slides', 'Original template'],
      fields: [
        ['materials', 'Original material (numbered)', 'Notes, quotes, evidence and numbers', true],
        ['draft', 'Current draft', 'Paste the slide-by-slide text to check', true]
      ],
      build: v => `Original material:\n${v.materials}\nCurrent draft:\n${v.draft}\n\nPlease check each of the following:\n- Which sentences have no support in the original material?\n- Where are suggestions, plans or unknowns written as facts?\n- Where does something sound good but drift from what I meant?\n- For a beginner, which step is missing an explanation?\n\nPin each problem to a specific sentence, with the material number or the note “not enough material”.\nSuggest changes, but don't decide for me.\nI will need to review your check as well; “no problems found” does not mean the facts have been verified.`,
      note: 'Use this when you can put the draft and its sources side by side. AI checks miss mistakes too; this is an aid, not independent verification. Not yet tried.'
    }
  ];

  const articles = [
    {
      id: 'presentation', type: 'Topic', title: 'How to get AI to help you explain one thing clearly',
      summary: 'The first worked example for talks and slides: pin down the audience, the one sentence, the evidence, the structure and how you\'ll check it, then ask AI for help.',
      status: 'Text draft · slides and a rehearsal not done yet', tag: 'Talks and slides', domains: ['AI and technology'], author: 'Onbloom Island editors',
      cover: 'sheet', coverState: 'Text draft',
      paragraphs: [
        'You have material, an audience and a deadline. Before you ask AI for a beautiful slide deck, get clear on the one thing you want people to understand. This topic starts from five things: audience, one sentence, evidence, structure, check.',
        'The real material we use is Onbloom Island\'s own project discussion. It shows a turning point: whether it looks good, what the theme is, and what it actually offers are three different questions. Behind this draft there are no finished slides yet, no rehearsal and no audience feedback.',
        'Read the six parts below together. Fill in the prompts and copy them into the AI tool of your choice; Onbloom Island won\'t run them or make slides for you. The trial log says what was actually done and what is still missing.'
      ],
      related: ['explanation', 'case', 'workflow', 'trial', 'checklist', 'discussion']
    },
    {
      id: 'explanation', type: '01 · Explainer', title: 'First know what you want to make clear',
      summary: 'Audience, one sentence, evidence, structure, check: fill in these five boxes, then ask AI for help.',
      status: 'Text draft · the method hasn\'t been proven in use yet', tag: 'Talks and slides', author: 'Onbloom Island editors · introduced by Shi', parent: 'presentation',
      paragraphs: [
        'Take an idea to AI and say: “Make me a creative slide deck.” That expresses a wish, but says nothing about what the audience needs to understand. When the result comes back, all we can say is “a bit richer” or “a bit prettier”, and it is hard to tell whether the content hits the point.',
        'Onbloom Island\'s discussion went through a real turning point. The first feedback was that the style didn\'t look good. Then the visuals grew richer and the feedback became “I can\'t find the theme”. Once the story was clear, the follow-up question came: “What is our content actually doing?” Whether it looks good, what the theme is, and what it actually offers each need their own answer. Looks still matter.',
        'For beginners, fill in five things first, then ask AI for help:',
        { list: [
          ['Audience', 'What do they already know, and what confuses them most right now?'],
          ['One sentence', 'If they remember only one sentence, which do I want it to be?'],
          ['Evidence', 'What quotes, facts and examples do I have? Which are only ideas?'],
          ['Structure', 'In what order does the audience need to understand things to follow that sentence?'],
          ['Check', 'What can be traced to a source? What might be misunderstood? What still needs trying myself?']
        ] },
        'In Onbloom Island\'s case, the one sentence could be: “We turn scattered AI material and hands-on experience into content you can understand, weigh up and use when a real problem comes along.” It answers what the content work is more directly than a slogan about our world. The theme line still matters: it says why we want to do this together.',
        'Then hand the material to AI and ask it to propose a structure, point out gaps and try different wordings. Which facts hold, which meanings have drifted, and what presentation suits the audience is for us to judge. A good-looking form should help the audience see that sentence.',
        'This method was distilled from that one discussion and has not been shown to improve communication in general. Whether it really works depends on whether a beginner can run through it alone with their own material.'
      ]
    },
    {
      id: 'case', type: '02 · Case study', title: 'From visuals and story to the substance',
      summary: 'Using Onbloom Island\'s real conversation, see what each of three kinds of feedback is really asking.',
      status: 'Real material · editors\' reading · no slide versions to compare', tag: 'Talks and slides', author: 'Onbloom Island editors · introduced by Shi', parent: 'presentation',
      paragraphs: [
        'The first feedback Onbloom Island got was blunt: “The framework is right, but the styling is really, really ugly.” Later, as the visuals filled up, we heard: “The pictures are too complicated, I can\'t find the theme.” Once the story flowed, the question became: “What is our content actually doing?”',
        'These are three different kinds of feedback. The first asks for aesthetic quality; the second for hierarchy and a theme you can see at a glance; the third for a concrete account of the work itself: choosing and explaining material, trying things by hand and recording them, organising and updating.',
        'In a single talk, each question has its own job. Good visuals set the mood; the story explains why the characters travel together; the worked example shows content people can actually read and take away.',
        'There is no tested “better” old deck and new deck here, only a real conversation in which the need became clearer step by step. We can\'t write further discussion up as “higher satisfaction” or “better learning outcomes”.'
      ]
    },
    {
      id: 'workflow', type: '03 · Prompts', title: 'Four small requests, leaving room for your own choices',
      summary: 'Sort, compare, present, review: at every step the original material stays in view.',
      status: 'Four original templates · waiting for a first trial', tag: 'Talks and slides', author: 'Onbloom Island editors', parent: 'presentation',
      paragraphs: [
        'Don\'t ask for a whole finished product at once; try splitting it into four requests. First sort the material into facts, opinions and ideas still to be confirmed. Then have AI compare two orders of presentation, choose one yourself, and only then write the script.',
        'Third, give each slide a visual job, and ask what the picture helps the audience understand. Fourth, check the script against the original material: anything invented, any suggestion passed off as already done, anything that sounds good but changed the meaning.',
        'The four templates below are original first drafts written by Onbloom Island. Fill in material you understand and have the right to use, then copy it into the AI tool of your choice. Anything left blank keeps its 【bracketed】 hint; nothing runs on Onbloom Island.',
        'These templates have not yet been tried with real material in any AI tool. We have no model output, time, cost or finished slides to report. When you try one for the first time, keep the input and output together, so the next revision has something to go on.'
      ],
      related: prompts.map(prompt => prompt.id)
    },
    {
      id: 'trial', type: '04 · Trial log', title: 'What we actually did',
      summary: 'A full record of one round of text work, including the parts not finished.',
      status: 'Text work only · no slides, no rehearsal', tag: 'Talks and slides', author: 'Onbloom Island editors · logged by Lu', parent: 'presentation',
      record: [
        ['Goal', 'From Onbloom Island\'s real conversation, produce a reviewable worked example and the text of a six-slide internal talk, as material for a real trial later.'],
        ['Input', 'Six quotes and discussion drafts from the Onbloom Island conversation (S1–S6), with the requirement to separate facts, suggestions and work that hasn\'t happened yet.'],
        ['What actually happened', 'Codex picked the relevant quotes from the conversation, ordered them as visual feedback, project clarification, theme feedback and the question about content, and wrote the method, four fill-in templates, a six-slide script and the checklist. Claude Code then checked the status of each item and tidied the interface text.'],
        ['Actual result', 'A text draft, waiting for review.'],
        ['This revision', 'Shifted the focus to a way of explaining that beginners can reuse; separated the theme line from the content work; marked key statements with their supporting material and status.'],
        ['Not done yet', 'Template trial runs, making the slides, a legibility check on a projector, a spoken rehearsal, audience feedback, a record of a beginner using it alone.', true],
        ['Conclusion', 'We have a text draft that can be trialled further. It can\'t be used to claim time saved, easier understanding or better slides.'],
        ['Time and cost', 'Not timed, and no cost recorded. It can\'t be written up after the fact as taking no time or costing nothing.', true],
        ['Last text check', '2026-10-27. Only the quotes and statuses were checked; this is not external fact-checking or a test of effect.'],
        ['Last real-world check', 'Not done yet.', true]
      ],
      paragraphs: [
        'This log covers the text work only. Earlier feedback said the visuals were “too complicated” and “I can\'t find the theme”, so this draft limits each slide to one main question. That is one piece of user feedback, not a separate evaluation of the visuals, and it doesn\'t prove the change works.'
      ]
    },
    {
      id: 'checklist', type: '05 · Checklist', title: 'Check these ten things before it becomes slides',
      summary: 'Meaning, evidence, reading conditions and real feedback: ten items, checked one by one.',
      status: 'To be filled in · nothing marked as passed', tag: 'Talks and slides', author: 'Onbloom Island editors · checked by Atuo', parent: 'presentation',
      paragraphs: [
        'Use this list once you have a draft. An unticked box only means no answer has been recorded yet, not a failure; some items can only be filled in after the slides are made and rehearsed.',
        'Ticks are saved only on this device, as your own working copy. For each tick, it\'s best to note what makes it true.'
      ],
      checklist: [
        'One sentence says what this talk wants the audience to understand.',
        'Quotes match their material numbers; no fake quote stitched together from several conversations.',
        'Confirmed points, editors\' suggestions, unbuilt items and unknowns are clearly separated.',
        'Text work isn\'t presented as real slide-making, template trial runs or rehearsal results.',
        'Key facts have support; the theme line doesn\'t stand in for describing the actual content.',
        'Each slide centres on one main question; beginners don\'t need to know all of Onbloom Island\'s world first.',
        'The templates work with other real material and don\'t ask users to invent examples or results.',
        'Once the slides exist, check legibility, charts, font sizes and sources on the actual device.',
        'After a rehearsal, record the real length, points of confusion and changes, instead of declaring “five minutes” from the word count.',
        'Before publishing, confirm what material may be made public; internal conversations aren\'t public by default.'
      ]
    },
    {
      id: 'discussion', type: '06 · Discussion', title: 'What would you question first?',
      summary: 'Bring a specific doubt, an attempt or a counter-example.',
      status: 'Questions ready · no public comments yet', tag: 'Talks and slides', author: 'Onbloom Island editors', parent: 'presentation',
      paragraphs: [
        'Discussion works best close to the actual work: point to a sentence that\'s hard to follow, say which template changed your meaning, or describe a situation where this order doesn\'t work.',
        'If you tried a template elsewhere, put the original material and the result together, and note the audience, the constraints and what you changed. Unfavourable results are worth keeping too. Record “I like it” as a preference, not as learning outcomes or efficiency.',
        'Below are prepared questions, not reader replies. Public posting and shared discussion aren\'t connected yet; you can write a private answer under “Mine”, which stays in this browser and isn\'t sent to anyone.'
      ]
    },
    {
      id: 'cost-brief', type: 'Topics in preparation', title: 'Find out where your tokens go',
      summary: 'Learn to read usage before switching tools.',
      status: 'Research outline · no cost experiment yet', tag: 'AI costs', domains: ['AI and technology'], author: 'Onbloom Island editors',
      cover: 'thread', coverState: 'In preparation',
      paragraphs: [
        'The questions to answer: why does an AI workflow feel expensive? What should you measure before switching tools? This topic will separate subscription allowances from pay-as-you-go APIs, input from output, and “cached usage in the report” from “will definitely save money”.',
        'The first trial should use a task that is repeatable, involves no sensitive information, and has visible quality requirements. Record the provider, the actual model (if reported), the date, request size, output, number of retries, measured usage and the pricing basis. What gets compared is the total cost of getting an acceptable result, not just the price per token.',
        'We started with the official prompt caching documentation as the first source. It explains when a prompt prefix can be reused, but it can\'t show that any Onbloom Island workflow will save money. There are no benchmarks, bill comparisons or recommendations yet. This outline is still only a plan.'
      ],
      related: ['library-caching']
    },
    {
      id: 'team-brief', type: 'Topics in preparation', title: 'A small team\'s first useful AI attempt',
      summary: 'Start with one clearly bounded piece of work and one way to judge it.',
      status: 'Research outline · not yet tried with any team', tag: 'Teams', domains: ['Business'], author: 'Onbloom Island editors',
      cover: 'cradle', coverState: 'In preparation',
      paragraphs: [
        'The question to answer: “using AI” is too broad, so where does a small team actually start? The suggested starting point is a recurring task with a clear owner, input material that\'s approved for use, a current way of doing it, and a result that can be reviewed.',
        'The first record should state what may go into the tool, who checks the output, what counts as acceptable, and when to stop. Training is built around that real task: one finished example, one independent attempt, one review.',
        'Before claiming any efficiency gain, record the current process and the trial process under comparable conditions, including review and rework time. Onbloom Island hasn\'t run this experiment with any company, nor trained any team. This is an editorial outline waiting for suitable material and willing participants; it is not a service promise or a success story.'
      ]
    }
  ];

  const sources = [
    {
      id: 'library-openai', type: 'Official guide', title: 'Give the model clear instructions',
      sourceTitle: 'OpenAI · Prompt engineering',
      summary: 'Start here: keep instructions, examples and the material to work on separate.',
      href: 'https://developers.openai.com/api/docs/guides/prompt-engineering',
      status: 'Link checked · 2026-10-27', tag: 'Prompts', author: 'Onbloom Island guide · Shi',
      paragraphs: [
        'Read this official guide when you want your instructions to be better organised. It covers instructions, message roles and a range of prompting techniques. For our talks topic, the useful question is whether the goal, constraints and original material are clear enough to judge a draft against.',
        'Onbloom Island\'s four fill-in templates are our own editorial work, not extracts from this guide, and the guide doesn\'t show those templates have been tested. Model behaviour changes across providers; go by the latest documentation for the tool you actually use.'
      ]
    },
    {
      id: 'library-caching', type: 'Official guide', title: 'When repeated input can be reused',
      sourceTitle: 'OpenAI · Prompt caching',
      summary: 'Understand “prefix matching” and the cached usage in your report before talking about savings.',
      href: 'https://developers.openai.com/api/docs/guides/prompt-caching',
      status: 'Link checked · 2026-10-27', tag: 'Cost and usage', author: 'Onbloom Island guide · Shi',
      paragraphs: [
        'This guide explains prompt caching in the OpenAI API. Whether something can be reused depends on whether the prompt prefix matches and on the model\'s conditions. The same words appearing again somewhere in a conversation doesn\'t mean a cache hit.',
        'For the cost topic in preparation, record actual usage and its pricing basis before drawing conclusions. Provider settings, model behaviour and workload all affect the result. This material doesn\'t cover subscription allowances, and we haven\'t measured any savings in Onbloom Island\'s workflows yet.'
      ]
    },
    {
      id: 'library-claude', type: 'Official guide', title: 'Decide what success looks like first',
      sourceTitle: 'Anthropic · Prompt engineering overview',
      summary: 'Set the criteria and the test method before polishing prompts.',
      href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
      status: 'Link checked · 2026-10-27', tag: 'Prompts', author: 'Onbloom Island guide · Shi',
      paragraphs: [
        'This overview from Anthropic starts with three things: success criteria, a way to test, and a draft prompt. It also separates problems that prompt changes can fix from ones that may need a different model or process.',
        'Use it alongside Onbloom Island\'s checklist, and first work out what you can actually observe. An answer that looks clear isn\'t a rehearsal, and one revised prompt doesn\'t prove better learning. When applying it, read the provider\'s latest model notes; our talk templates are still untested.'
      ]
    }
  ];

  const questions = [
    ['Restate', 'Without using the original sentence, how would you describe Onbloom Island\'s content work? What is still abstract?'],
    ['The hardest box', 'Audience, one sentence, evidence, structure, check — which box is hardest to fill? Can you write your own one sentence?'],
    ['Where you got stuck', 'Which template step was missing information and stopped you?'],
    ['Meaning changed', 'After handing the material to AI, did any sentence come back “sounding good but meaning something else”? Put the original next to the output and describe the difference.'],
    ['Counter-example', 'Has this order ever not worked for you? What were the audience, material and constraints that time?']
  ];

  const allEntries = [
    ...articles.map(item => ({ ...item, kind: 'article' })),
    ...sources.map(item => ({ ...item, kind: 'source' })),
    ...prompts.map(item => ({ ...item, kind: 'prompt', type: 'Original prompt', tag: item.tags[0], status: 'Original template · not yet tried', parent: 'workflow' }))
  ];
  const entryById = new Map(allEntries.map(item => [item.id, item]));

  // The AI chronicle and the bookshelf live in their own data files (chronicle.js, books.js).
  const chronicle = window.HUAYU_CHRONICLE || [];
  const chronById = new Map(chronicle.map(item => [item.id, item]));
  const shelf = window.HUAYU_BOOKS || { parts: [], books: [], people: [], notes: {}, featured: [], pending: {} };
  const bookById = new Map(shelf.books.map(book => [book.id, book]));
  const ACCESS = { free: 'Free in full', sample: 'Official sample', review: 'Reviews only' };
  const READ_STATES = { todo: 'Want to read', reading: 'Reading', done: 'Finished' };
  const partName = id => shelf.parts.find(part => part.id === id)?.name || '';

  const VIEWS = ['topics', 'ai', 'library', 'prompts', 'together', 'notes', 'legal'];
  const VIEW_TITLES = {
    topics: 'Onbloom Island · A knowledge base and study community that starts from AI',
    ai: 'AI chronicle · Onbloom Island',
    library: 'Bookshelf · Onbloom Island',
    prompts: 'Prompts · Onbloom Island',
    together: 'Study together · Onbloom Island',
    notes: 'Mine · Onbloom Island',
    legal: 'Notes and terms · Onbloom Island'
  };

  // The letter's closing lines: the home page keeps the original, every other page signs off with its own.
  const CLOSINGS = {
    topics: ['We gather here,', 'carrying the wisdom of the past,', 'and hope for what comes next'],
    ai: ['The nights so many people stayed up,', 'later all turned into light;', 'we keep them on record'],
    library: ['Someone spent a lifetime', 'writing down what they worked out;', 'all we have to do is open it'],
    prompts: ['Say clearly what\'s on your mind,', 'and even at the far end,', 'someone will catch it'],
    together: ['You\'re not the only one asking;', 'under other lamps, others', 'are thinking about the same thing'],
    notes: ['The line you write today,', 'read again years from now,', 'will show you who you were'],
    legal: ['Everything we borrow', 'has its source written down;', 'that is how we respect others']
  };

  // The three looks a reader can ask the AI for in the resume maker under 我的.
  const RESUME_STYLES = {
    steady: 'Steady and clear: single-column layout in three parts (profile, experience, skills), plain tone, suitable for most companies.',
    creative: 'Creative: open with one sentence on who I am and what I bring; give each role a short heading; then suggest a colour scheme and layout. The layout can be bold, but the content must still come only from the facts I gave.',
    portfolio: 'Portfolio-style: write my experience as three short project stories (the trigger, what I did, the result), and suggest what kind of image should go with each project.'
  };

  /* ---------- local notebook ---------- */

  let localAvailable = true;
  const localState = { saved: [], notes: [], checks: [], books: {}, resume: { facts: '', job: '', style: 'steady' } };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored && typeof stored === 'object') {
      localState.saved = Array.isArray(stored.saved) ? stored.saved.filter(id => typeof id === 'string' && entryById.has(id)).slice(0, 200) : [];
      localState.notes = Array.isArray(stored.notes) ? stored.notes.filter(note => note && typeof note.text === 'string' && typeof note.id === 'string').slice(0, 100).map(note => ({ id: note.id.slice(0, 80), text: note.text.slice(0, 10000), createdAt: typeof note.createdAt === 'string' ? note.createdAt : '', kind: note.kind === 'discussion' ? 'discussion' : 'note' })) : [];
      localState.checks = Array.isArray(stored.checks) ? stored.checks.filter(number => Number.isInteger(number) && number >= 0 && number < 10) : [];
      if (stored.books && typeof stored.books === 'object') {
        Object.entries(stored.books).slice(0, 200).forEach(([id, value]) => {
          if (!bookById.has(id) || !value || !READ_STATES[value.state]) return;
          localState.books[id] = { state: value.state, chapter: typeof value.chapter === 'string' ? value.chapter.slice(0, 40) : '' };
        });
      }
      if (stored.resume && typeof stored.resume === 'object') {
        const { facts, job, style } = stored.resume;
        localState.resume = {
          facts: typeof facts === 'string' ? facts.slice(0, 6000) : '',
          job: typeof job === 'string' ? job.slice(0, 6000) : '',
          style: RESUME_STYLES[style] ? style : 'steady'
        };
      }
    }
  } catch (_) {
    // A blocked or full store never prevents reading or copying a template.
    localAvailable = false;
  }
  const activeSaved = new Set(localState.saved);

  let toastTimer;
  function notify(message) {
    const toast = $('#toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    const host = $('dialog[open]') || document.body;
    if (toast.parentElement !== host) host.append(toast);
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3200);
  }

  function persist() {
    localState.saved = [...activeSaved];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
      localAvailable = true;
      return true;
    } catch (_) {
      localAvailable = false;
      notify('Browser storage isn\'t available. This change only lasts while the page is open.');
      return false;
    }
  }

  /* ---------- home: the AI chronicle ---------- */

  function renderChronList() {
    const list = $('#chronList');
    if (!list) return;
    list.replaceChildren(...chronicle.map(item => {
      const li = el('li', 'chron-item');
      li.setAttribute('data-reveal', 'slant');
      const a = link(`#/ai/${item.id}`);
      a.dataset.cursor = 'Read this';
      const text = el('span', 'chron-text');
      text.append(el('span', 'chron-kind', `${item.kind} · ${item.who}`), el('strong', '', item.title), el('span', 'chron-short', item.short));
      a.append(el('span', 'chron-date latin', item.date), text, el('i', 'go', '↗'));
      li.append(a);
      return li;
    }));
  }

  function chronSection(title, paragraphs) {
    const section = el('section', 'chron-section');
    section.append(el('h2', '', title));
    paragraphs.forEach(text => section.append(el('p', '', text)));
    return section;
  }

  function renderChronPage(id) {
    const index = chronicle.findIndex(item => item.id === id);
    const item = chronicle[index];
    const head = $('#chronHead');
    const article = $('#chronArticle');
    if (!item || !head || !article) return;
    // Pages alternate which side the title sits on, like the home sections.
    head.classList.toggle('inner-head--right', index % 2 === 1);
    head.replaceChildren(
      el('span', 'chron-year latin', item.date),
      el('p', 'chron-kicker', `AI chronicle · No. ${index + 1} · ${item.kind} · ${item.who}`),
      el('h1', 'display inner-title chron-title', item.title),
      el('p', 'chron-lead', item.short)
    );
    const facts = el('dl', 'record chron-facts');
    item.facts.forEach(([term, text]) => {
      const row = el('div');
      row.append(el('dt', '', term), el('dd', '', text));
      facts.append(row);
    });
    const sources = el('section', 'chron-section chron-sources');
    const list = el('ul');
    item.sources.forEach(([label, href]) => {
      const a = link(href, 'u-link', `${label} ↗`);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const li = el('li');
      li.append(a);
      list.append(li);
    });
    sources.append(el('h2', '', 'Original sources'), list);
    const prev = chronicle[index - 1];
    const next = chronicle[index + 1];
    const pager = el('nav', 'chron-pager');
    pager.setAttribute('aria-label', 'Previous and next');
    pager.append(
      prev ? link(`#/ai/${prev.id}`, 'chron-prev', `← ${prev.date} · ${prev.title}`) : link('#chronicle', 'chron-prev', '← Back to the chronicle'),
      next ? link(`#/ai/${next.id}`, 'chron-next', `${next.date} · ${next.title} →`) : link('#chronicle', 'chron-next', 'Back to the chronicle →')
    );
    article.replaceChildren(
      facts,
      chronSection('What happened', item.happened),
      chronSection('Why it matters', item.why),
      chronSection('What it means for us', item.use),
      chronSection('What\'s still unsettled', item.open),
      sources,
      el('p', 'reader-byline', `Onbloom Island AI chronicle · compiled by Atuo · draft ${CHECKED} · dates and figures defer to the original sources`),
      pager
    );
    window.P8Motion?.watchReveals(head);
    window.P8Motion?.updateParallax?.();
  }

  /* ---------- 书架 ---------- */

  function readersOf(id) {
    const reading = shelf.people.filter(person => person.reading.includes(id)).map(person => person.name);
    const done = shelf.people.filter(person => person.done.includes(id)).map(person => person.name);
    const mine = localState.books[id];
    if (mine?.state === 'reading') reading.push('You');
    if (mine?.state === 'done') done.push('You');
    return { reading, done };
  }

  function bookCard(book) {
    const card = el('article', 'book');
    card.setAttribute('data-reveal', '');
    const a = link(`#/book/${book.id}`);
    a.dataset.cursor = 'Open';
    const { reading, done } = readersOf(book.id);
    a.append(el('span', `book-access is-${book.access}`, ACCESS[book.access]), el('strong', 'book-title', book.title));
    if (book.zh) a.append(el('span', 'book-zh', `“${book.zh}”`));
    a.append(
      el('span', 'book-meta', `${book.author} · ${book.year}`),
      el('p', 'book-why', book.why),
      el('span', 'book-foot', `Reading ${reading.length} · Finished ${done.length}${shelf.notes[book.id] ? ' · has a mind map and cards' : ''}`)
    );
    card.append(a);
    return card;
  }

  function renderLibrary() {
    $('#freeBooks')?.replaceChildren(...shelf.featured.map(id => bookById.get(id)).filter(Boolean).map(bookCard));
    $('#partNav')?.replaceChildren(...shelf.parts.map(part => link(`#part-${part.id}`, '', `${part.name}  ${shelf.books.filter(book => book.part === part.id).length} books`)));
    $('#bookParts')?.replaceChildren(...shelf.parts.map((part, index) => {
      const section = el('section', `book-part${index % 2 ? ' book-part--right' : ''}`);
      section.id = `part-${part.id}`;
      const head = el('header', 'part-head');
      head.append(el('h2', 'display part-name', part.name), el('p', 'part-lead', part.lead));
      section.append(head);
      part.shelves.forEach(name => {
        const books = shelf.books.filter(book => book.part === part.id && book.shelf === name);
        const layer = el('div', 'shelf-layer');
        const label = el('h3', 'shelf-name', name);
        label.append(el('small', '', books.length ? `${books.length} books` : 'Coming soon'));
        const row = el('div', 'book-row');
        if (books.length) row.append(...books.map(bookCard));
        else row.append(el('p', 'shelf-pending', shelf.pending?.[name] || 'No books on this shelf yet.'));
        layer.append(label, row);
        section.append(layer);
      });
      return section;
    }));
    renderPeople();
    const view = $('#view-library');
    if (view && state.booted) window.P8Motion?.watchReveals(view);
  }

  function bookLinks(ids) {
    const list = el('ul', 'slot-books');
    ids.map(id => bookById.get(id)).filter(Boolean).forEach(book => {
      const li = el('li');
      li.append(link(`#/book/${book.id}`, '', book.zh ? `“${book.zh}”` : book.title));
      list.append(li);
    });
    return list;
  }

  // Suggestions come from the shelves a person already reads on; with nothing read yet, the free books.
  function suggestionsFor(ids) {
    const shelves = new Set(ids.map(id => bookById.get(id)).filter(Boolean).map(book => `${book.part}/${book.shelf}`));
    const pool = shelves.size ? shelf.books.filter(book => shelves.has(`${book.part}/${book.shelf}`)) : shelf.featured.map(id => bookById.get(id));
    return pool.filter(book => book && !ids.includes(book.id)).slice(0, 2).map(book => book.id);
  }

  function myShelf() {
    const mine = Object.entries(localState.books);
    return {
      name: 'You', role: 'Saved on this device only', self: true,
      reading: mine.filter(([, value]) => value.state === 'reading').map(([id]) => id),
      done: mine.filter(([, value]) => value.state === 'done').map(([id]) => id)
    };
  }

  function personSlot(person) {
    const slot = el('article', `slot${person.self ? ' slot--self' : ''}`);
    slot.append(el('h3', '', person.name), el('p', 'slot-role', person.role));
    const block = (label, ids, empty) => {
      const div = el('div', 'slot-block');
      div.append(el('span', 'cap', label), ids.length ? bookLinks(ids) : el('p', 'slot-empty', empty));
      return div;
    };
    const known = [...person.reading, ...person.done];
    slot.append(block('Reading', person.reading, 'Nothing logged yet'), block('Finished', person.done, 'Nothing logged yet'));
    slot.append(block(known.length ? 'Read next' : 'Start with', suggestionsFor(known), ''));
    return slot;
  }

  function renderPeople() {
    $('#peopleSlots')?.replaceChildren(...shelf.people.map(personSlot), personSlot(myShelf()));
  }

  function readerSection(title) {
    const section = el('section', 'reader-section');
    section.append(el('h3', '', title));
    return section;
  }

  function recordList(rows, className = '') {
    const dl = el('dl', `record ${className}`.trim());
    rows.forEach(([term, text, missing]) => {
      const div = el('div', missing ? 'is-missing' : '');
      div.append(el('dt', '', term), el('dd', '', text));
      dl.append(div);
    });
    return dl;
  }

  function renderBook(book) {
    $('#readerEyebrow').textContent = `Bookshelf · ${partName(book.part)} · ${book.shelf}`;
    $('#readerTitle').textContent = book.title;
    const body = $('#readerBody');
    body.replaceChildren();
    if (book.zh) body.append(el('p', 'book-zh-line', `“${book.zh}”`));
    body.append(el('p', 'book-meta-line', `${book.author} · ${book.year}`), el('p', 'book-lead', book.why));

    const where = readerSection('Where to read');
    const verb = book.access === 'free' ? 'Start reading' : book.access === 'sample' ? 'Read a sample' : 'See the listing';
    const go = link(book.href, 'btn btn--solid', `${verb}: ${book.linkLabel} ↗`);
    go.target = '_blank';
    go.rel = 'noopener noreferrer';
    const badge = el('p', 'book-where');
    badge.append(el('span', `book-access is-${book.access}`, ACCESS[book.access]));
    where.append(badge, go);
    if (book.note) where.append(el('p', 'muted', book.note));
    where.append(el('p', 'book-checked', `Links checked on ${shelf.checked}`));

    const who = readerSection('Who\'s reading');
    const { reading, done } = readersOf(book.id);
    who.append(recordList([
      ['Reading', reading.length ? reading.join(', ') : 'Nobody yet', !reading.length],
      ['Finished', done.length ? done.join(', ') : 'Nobody yet', !done.length]
    ]));
    const mine = localState.books[book.id] || {};
    const states = el('div', 'read-state');
    states.setAttribute('role', 'group');
    states.setAttribute('aria-label', 'My reading status');
    Object.entries(READ_STATES).forEach(([key, label]) => {
      const button = el('button', 'btn', label);
      button.type = 'button';
      button.dataset.bookState = `${book.id}:${key}`;
      button.setAttribute('aria-pressed', String(mine.state === key));
      states.append(button);
    });
    const chapter = el('label', 'field book-chapter');
    const input = el('input');
    Object.assign(input, { value: mine.chapter || '', placeholder: 'e.g. chapter 3', maxLength: 40 });
    input.dataset.bookChapter = book.id;
    chapter.append(document.createTextNode('Which chapter you\'re on'), input);
    who.append(el('p', 'cap book-mine', 'My shelf · saved on this device only'), states, chapter);

    const ours = readerSection('What we made');
    const notes = shelf.notes?.[book.id];
    if (notes) {
      ours.append(el('h4', '', 'Analysis'));
      notes.analysis.forEach(text => ours.append(el('p', '', text)));
      ours.append(el('h4', '', 'Mind map'));
      const map = el('div', 'mind-map');
      const branches = el('ul', 'mind-branches');
      notes.map.forEach(([name, leaves]) => {
        const li = el('li');
        const sub = el('ul');
        leaves.forEach(text => sub.append(el('li', '', text)));
        li.append(el('b', '', name), sub);
        branches.append(li);
      });
      map.append(el('p', 'mind-root', book.title), branches);
      ours.append(map, el('h4', '', `Study cards · ${notes.cards.length} `));
      const cards = el('div', 'study-cards');
      notes.cards.forEach(([question, answer]) => {
        const card = el('details', 'study-card');
        card.append(el('summary', '', question), el('p', '', answer));
        cards.append(card);
      });
      ours.append(cards, el('p', 'reader-byline', notes.by));
    } else {
      ours.append(recordList([['Analysis', 'To do', true], ['Mind map', 'To do', true], ['Study cards', 'To do', true]]));
    }

    const rating = readerSection('Scores by section');
    rating.append(recordList([['Clear', 'Not rated', true], ['Useful', 'Not rated', true], ['Rewarding', 'Not rated', true]]), el('p', 'muted', 'Waiting for the first readers to finish and score it.'));
    const feedback = readerSection('Readers\' feedback');
    feedback.append(el('p', '', 'No feedback yet.'), el('p', 'muted', 'The mainland China site has no comment section. Readers\' feedback is summarised by the editors and placed here.'));
    body.append(where, who, ours, rating, feedback);
  }

  function setBookState(id, key) {
    const current = localState.books[id];
    // Pressing the state you are already in clears it.
    if (current?.state === key) delete localState.books[id];
    else localState.books[id] = { state: key, chapter: current?.chapter || '' };
    const saved = persist();
    renderBook(bookById.get(id));
    renderLibrary();
    renderNotes();
    $(`[data-book-state="${id}:${key}"]`)?.focus({ preventScroll: true });
    if (saved) notify(localState.books[id] ? `Marked as “${READ_STATES[key]}”, saved on this device only.` : 'Cleared the status for this book.');
  }

  /* ---------- inner views ---------- */

  function row(item, index) {
    const li = el('li');
    const a = link(`#/topic/${item.id}`, 'row');
    a.dataset.cursor = item.kind === 'prompt' ? 'Fill in' : 'Read';
    const main = el('span', 'main');
    main.append(el('strong', '', item.title), el('span', '', item.summary));
    const meta = el('span', 'meta');
    meta.append(el('b', '', item.sourceTitle || item.tags?.join(' · ') || item.type), document.createTextNode(item.status));
    a.append(el('span', 'idx', item.number || String(index + 1).padStart(2, '0')), main, meta, el('span', 'go', '↗'));
    li.append(a);
    return li;
  }

  function renderLists() {
    $('#promptList')?.replaceChildren(...prompts.map((item, index) => row(entryById.get(item.id), index)));
    const together = $('#togetherList');
    if (together) {
      together.replaceChildren(...questions.map(([label, question], index) => {
        const li = el('li', 'question');
        const body = el('div');
        body.append(el('span', 'cap', label), el('h3', '', question));
        const actions = el('div', 'question-actions');
        const write = el('button', 'u-link', 'Write my answer');
        write.type = 'button';
        write.dataset.discuss = String(index);
        actions.append(write, link('#/topic/discussion', 'muted', 'From the topic: How to get AI to help you explain one thing clearly ↗'));
        li.append(el('span', 'idx', String(index + 1).padStart(2, '0')), body, actions);
        return li;
      }));
    }
    renderNotes();
    syncSaved();
  }

  function renderNotes() {
    const list = $('#savedNotes');
    if (!list) return;
    list.replaceChildren(el('p', 'local-notice', localAvailable ? 'This device only · private draft · not published, not synced' : 'Browser storage unavailable · changes last only while the page is open'));
    if (!localState.notes.length) list.append(el('p', 'empty-state', 'A sentence worth keeping, a question, the next thing you want to try — your first note can start here.'));
    localState.notes.forEach(note => {
      const article = el('article', 'saved-note');
      const when = new Date(note.createdAt);
      const dateText = Number.isNaN(when.getTime()) ? 'Local draft' : when.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      const remove = el('button', 'u-link', 'Delete this');
      remove.type = 'button';
      remove.dataset.deleteNote = note.id;
      article.append(el('p', 'meta', `${note.kind === 'discussion' ? 'Discussion draft · unpublished' : 'Private note'} · ${dateText}`), el('p', 'text', note.text), remove);
      list.append(article);
    });
    const mine = myShelf();
    if (mine.reading.length || mine.done.length) {
      const section = el('section', 'saved-reading');
      section.append(el('h3', '', 'My bookshelf'));
      [...mine.reading.map(id => [id, 'Reading']), ...mine.done.map(id => [id, 'Finished'])].forEach(([id, label]) => {
        const book = bookById.get(id);
        const chapter = localState.books[id]?.chapter;
        section.append(link(`#/book/${id}`, '', `${book.zh ? `《${book.zh}》` : book.title} · ${label}${chapter ? ` · ${chapter}` : ''} ↗`));
      });
      list.append(section);
    }
    const saved = [...activeSaved].map(id => entryById.get(id)).filter(Boolean);
    if (saved.length) {
      const section = el('section', 'saved-reading');
      section.append(el('h3', '', 'Save'));
      saved.forEach(item => section.append(link(`#/topic/${item.id}`, '', `${item.title} ↗`)));
      list.append(section);
    }
  }

  function syncSaved() {
    const count = $('#savedCount');
    if (count) {
      count.textContent = String(activeSaved.size);
      count.setAttribute('aria-label', `Saved ${activeSaved.size} items`);
    }
    $$('[data-save]').forEach(button => {
      const saved = activeSaved.has(button.dataset.save);
      button.textContent = saved ? 'Saved' : 'Save';
      button.setAttribute('aria-pressed', String(saved));
    });
  }

  /* ---------- reader ---------- */

  function appendParagraphs(parent, paragraphs = []) {
    paragraphs.forEach(item => {
      if (typeof item === 'string') { parent.append(el('p', '', item)); return; }
      const list = el('ol', 'reader-list');
      item.list.forEach(([term, text]) => {
        const li = el('li');
        li.append(el('b', '', `${term}: `), document.createTextNode(text));
        list.append(li);
      });
      parent.append(list);
    });
  }

  function addRelated(parent, entry) {
    const ids = entry.related || (entry.parent ? entryById.get(entry.parent).related : null);
    if (!ids?.length) return;
    const section = el('section', 'reader-section');
    const heading = entry.id === 'workflow' ? 'Four templates' : entry.kind === 'prompt' ? 'Other templates' : entry.parent ? 'Other parts of the same topic' : 'The six parts of this topic';
    section.append(el('h3', '', heading));
    const list = el('div', 'related-list');
    ids.filter(id => id !== entry.id).forEach(id => {
      const item = entryById.get(id);
      if (!item) return;
      const a = link(`#/topic/${id}`);
      a.dataset.replace = '';
      a.append(el('span', 'kind', item.type), el('span', 't', item.title), el('i', '', '↗'));
      list.append(a);
    });
    if (entry.parent) {
      const parent = entryById.get(entry.parent);
      const a = link(`#/topic/${parent.id}`);
      a.dataset.replace = '';
      a.append(el('span', 'kind', entry.kind === 'prompt' ? 'Back to' : 'Back to the topic'), el('span', 't', parent.title), el('i', '', '↗'));
      list.prepend(a);
    }
    section.append(list);
    parent.append(section);
  }

  function renderRecord(parent, record) {
    const dl = el('dl', 'record');
    record.forEach(([term, text, missing]) => {
      const div = el('div', missing ? 'is-missing' : '');
      div.append(el('dt', '', term), el('dd', '', text));
      dl.append(div);
    });
    parent.append(dl);
  }

  function renderChecklist(parent, item) {
    const section = el('section', 'reader-section');
    section.append(el('h3', '', 'Your local working copy'));
    item.checklist.forEach((text, index) => {
      const label = el('label', 'checklist-item');
      const input = el('input');
      input.type = 'checkbox';
      input.checked = localState.checks.includes(index);
      input.addEventListener('change', () => {
        const checks = new Set(localState.checks);
        if (input.checked) checks.add(index); else checks.delete(index);
        localState.checks = [...checks];
        persist();
      });
      label.append(input, el('span', '', text));
      section.append(label);
    });
    parent.append(section);
  }

  function fillPreview(preview, text) {
    // Unfilled fields stay visible as 【label】 so nothing is silently invented.
    preview.replaceChildren(...text.split(/(【[^】]+】)/).map(part => part.startsWith('【') ? el('span', 'gap', part) : document.createTextNode(part)));
  }

  function renderPrompt(parent, prompt) {
    parent.append(el('p', 'reader-status', 'Original template · not yet run or evaluated'), el('p', 'prompt-note', prompt.note));
    const form = el('form', 'field-grid');
    form.addEventListener('submit', event => event.preventDefault());
    const controls = [];
    const preview = el('pre', 'prompt-preview');
    preview.tabIndex = 0;
    preview.setAttribute('aria-label', 'Prompt preview');
    let text = '';
    const update = () => {
      const values = Object.create(null);
      prompt.fields.forEach(([key, label], index) => { values[key] = controls[index].value.trim() || `【${label}】`; });
      text = prompt.build(values);
      fillPreview(preview, text);
    };
    prompt.fields.forEach(([key, title, placeholder, multiline]) => {
      const label = el('label', `field${multiline ? ' is-wide' : ''}`);
      const input = el(multiline ? 'textarea' : 'input');
      if (multiline) input.rows = 4; else input.type = 'text';
      Object.assign(input, { placeholder, name: key, autocomplete: 'off', maxLength: multiline ? 12000 : 1000 });
      input.addEventListener('input', update);
      controls.push(input);
      label.append(el('span', '', title), input);
      form.append(label);
    });
    const section = el('section', 'reader-section');
    section.append(el('h3', '', 'Your prompt'), el('p', 'local-notice', 'Anything left blank keeps its 【brackets】. Look it over once more before copying.'), preview);
    const copy = el('button', 'btn btn--solid', 'Copy prompt ↗');
    copy.type = 'button';
    copy.addEventListener('click', () => copyText(text, copy));
    section.append(copy);
    parent.append(form, section);
    update();
  }

  function saveButton(id) {
    const button = el('button', 'btn save-toggle', activeSaved.has(id) ? 'Saved' : 'Save');
    button.type = 'button';
    button.dataset.save = id;
    button.setAttribute('aria-pressed', String(activeSaved.has(id)));
    return button;
  }

  function renderReader(entry) {
    $('#readerEyebrow').textContent = entry.type;
    $('#readerTitle').textContent = entry.title;
    const body = $('#readerBody');
    body.replaceChildren();
    if (entry.kind === 'prompt') {
      renderPrompt(body, entry);
    } else {
      body.append(el('p', 'reader-status', entry.status));
      if (entry.record) renderRecord(body, entry.record);
      appendParagraphs(body, entry.paragraphs);
      if (entry.href) {
        const source = link(entry.href, 'source-link u-link', `Read the original: ${entry.sourceTitle} ↗`);
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        body.append(source);
      }
      if (entry.checklist) renderChecklist(body, entry);
      if (entry.id === 'discussion') {
        const list = el('ol', 'discussion-questions');
        questions.forEach(([, question]) => list.append(el('li', '', question)));
        const write = el('button', 'btn', 'Write my answer ↗');
        write.type = 'button';
        write.dataset.discuss = '0';
        body.append(list, write);
      }
    }
    addRelated(body, entry);
    if (entry.kind !== 'prompt') body.append(el('p', 'reader-byline', `${entry.author} · updated ${UPDATED}`));
    const foot = el('div', 'reader-foot');
    foot.append(saveButton(entry.id));
    body.append(foot);
  }

  /* ---------- search ---------- */

  function highlight(text, term) {
    const span = el('span');
    const at = term ? text.toLowerCase().indexOf(term) : -1;
    if (at < 0) { span.textContent = text; return span; }
    span.append(document.createTextNode(text.slice(0, at)), el('mark', '', text.slice(at, at + term.length)), document.createTextNode(text.slice(at + term.length)));
    return span;
  }

  function haystack(item) {
    const paragraphs = (item.paragraphs || []).map(p => typeof p === 'string' ? p : p.list.flat().join(' '));
    return [item.title, item.type, item.tag, item.summary, item.sourceTitle, item.status, item.tags?.join(' '), item.domains?.join(' '), ...paragraphs, ...(item.checklist || []), ...(item.record || []).flat()]
      .filter(value => typeof value === 'string').join(' ').toLowerCase();
  }
  const searchIndex = [
    ...chronicle.map(item => ({
      title: item.title, type: `Chronicle · ${item.date}`, summary: item.short, href: `#/ai/${item.id}`,
      text: [item.title, item.who, item.kind, item.short, ...item.happened, ...item.why, ...item.use, ...item.open, ...item.facts.flat()].join(' ')
    })),
    ...shelf.books.map(book => ({
      title: book.zh ? `${book.title}“${book.zh}”` : book.title, type: `Bookshelf · ${partName(book.part)}`, summary: book.why, href: `#/book/${book.id}`,
      text: [book.title, book.zh, book.author, book.shelf, partName(book.part), book.why, ACCESS[book.access]].filter(Boolean).join(' ')
    })),
    ...allEntries.map(item => ({ title: item.title, type: item.type, summary: item.summary, href: `#/topic/${item.id}`, text: haystack(item) }))
  ].map(item => [item, item.text.toLowerCase()]);
  const searchStart = ['#/ai/transformer', '#/ai/chatgpt', '#/book/shapeup', '#/book/sre'];

  function renderSearch() {
    const results = $('#searchResults');
    if (!results) return;
    const query = ($('#searchInput')?.value || '').trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const found = terms.length
      ? searchIndex.filter(([, text]) => terms.every(term => text.includes(term))).map(([item]) => item)
      : searchStart.map(href => searchIndex.find(([item]) => item.href === href)?.[0]).filter(Boolean);
    results.replaceChildren(el('p', 'search-count', terms.length ? `Found ${found.length} items` : 'You could start with these'));
    if (!found.length) results.append(el('p', 'empty-state', 'Nothing matches yet. Try “Transformer”, “Claude”, “marketing” or “free”.'));
    found.forEach(item => {
      const a = link(item.href);
      a.dataset.replace = '';
      const title = el('strong');
      title.append(highlight(item.title, terms[0]));
      a.append(el('span', 'kind', item.type), title, highlight(item.summary, terms[0]));
      results.append(a);
    });
  }

  /* ---------- router ----------
     #/topics #/library #/prompts #/together #/notes  views     #/ai/<id>  one page of the AI chronicle
     #/topic/<id> #/book/<id>  reader over the current view   #/search  search over the current view
     #/ai, #/updates  home, scrolled to the chronicle            Old #topics-style hashes still work. */

  const state = { view: null, viewHash: '#/topics', title: '', enteredInApp: false, booted: false };
  const lastActivator = new WeakMap();

  function parseRoute() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!raw) return { view: 'topics' };
    if (!raw.startsWith('/')) return VIEWS.includes(raw) ? { view: raw, legacy: true } : null;
    const [head, arg] = raw.slice(1).split('/');
    if (head === 'ai') return chronById.has(arg) ? { view: 'ai', ai: arg } : { view: 'topics', anchor: 'chronicle' };
    if (!head || VIEWS.includes(head)) return { view: head || 'topics' };
    if (head === 'topic' && entryById.has(arg)) return { entry: arg };
    if (head === 'book' && bookById.has(arg)) return { book: arg };
    if (head === 'search') return { search: true };
    if (head === 'updates') return { view: 'topics', anchor: 'chronicle' };
    return { view: 'topics' };
  }

  function themeFor(view) {
    const first = $(`#view-${view} [data-bg]`);
    if (!first) return;
    document.body.style.setProperty('--bg', first.dataset.bg);
    document.body.classList.toggle('is-dark', first.dataset.theme === 'dark');
  }

  function setView(view) {
    if (state.view === view) return;
    state.view = view;
    $$('.view').forEach(section => { section.hidden = section.dataset.viewName !== view; });
    $$('[data-nav]').forEach(a => {
      if (a.dataset.nav === view) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.body.dataset.view = view;
    renderClosing(view);
    themeFor(view);
    if (state.booted) window.scrollTo({ top: 0, behavior: 'instant' });
    window.P8Motion?.updateParallax?.();
  }

  function renderClosing(view) {
    const box = $('.footer-closing');
    if (!box) return;
    const lines = CLOSINGS[view] || CLOSINGS.topics;
    $$('.line > span', box).forEach((span, index) => {
      span.textContent = lines[index] || '';
      if (index === lines.length - 1) span.append(el('em', 'dot', '.'));
    });
    box.setAttribute('aria-label', `${lines.join('')}.`);
  }

  function baseViewFor(entry) {
    if (entry.kind === 'prompt') return 'prompts';
    if (entry.kind === 'source') return 'library';
    return 'topics';
  }

  function closeQuietly(dialog) {
    if (!dialog?.open) return;
    // The close event fires later; the flag tells its handler the route already moved on.
    dialog.dataset.quiet = '';
    dialog.close();
  }

  function openDialog(dialog) {
    if (!dialog.open) {
      lastActivator.set(dialog, document.activeElement);
      dialog.showModal();
    }
  }

  function applyRoute(fromHashChange = false) {
    const route = parseRoute();
    if (!route) return; // a plain in-page anchor
    if (route.legacy) history.replaceState(null, '', `#/${route.view}`);
    const reader = $('#readerDialog');
    const search = $('#searchDialog');
    const dialogRoute = Boolean(route.entry || route.book || route.search);
    if (dialogRoute && fromHashChange && !reader.open && !search.open) state.enteredInApp = true;
    if (!dialogRoute) state.enteredInApp = false;

    if (route.entry) {
      const entry = entryById.get(route.entry);
      if (!state.view) setView(baseViewFor(entry));
      closeQuietly(search);
      renderReader(entry);
      openDialog(reader);
      reader.scrollTop = 0;
      $('#readerTitle').focus({ preventScroll: true });
      document.title = `${entry.title} · Onbloom Island`;
      return;
    }
    if (route.book) {
      const book = bookById.get(route.book);
      if (!state.view) setView('library');
      closeQuietly(search);
      renderBook(book);
      openDialog(reader);
      reader.scrollTop = 0;
      $('#readerTitle').focus({ preventScroll: true });
      document.title = `${book.zh ? `《${book.zh}》` : book.title} · Bookshelf · Onbloom Island`;
      return;
    }
    if (route.search) {
      if (!state.view) setView('topics');
      closeQuietly(reader);
      renderSearch();
      openDialog(search);
      requestAnimationFrame(() => $('#searchInput')?.focus());
      document.title = 'Search · Onbloom Island';
      return;
    }
    closeQuietly(reader);
    closeQuietly(search);
    const before = state.view;
    setView(route.view);
    state.viewHash = route.view === 'ai' ? `#/ai/${route.ai}` : `#/${route.view}`;
    state.title = VIEW_TITLES[route.view];
    if (route.ai) {
      renderChronPage(route.ai);
      state.title = `${chronById.get(route.ai).title} · AI chronicle · Onbloom Island`;
      // setView only scrolls when the view changes; one chronicle page to the next still starts at the top.
      if (before === 'ai' && state.booted) window.scrollTo({ top: 0, behavior: 'instant' });
    }
    document.title = state.title;
    if (route.anchor) requestAnimationFrame(() => $(`#${route.anchor}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  function leaveDialogRoute() {
    const route = parseRoute();
    if (!route || !(route.entry || route.search)) return;
    if (state.enteredInApp) history.back();
    else history.replaceState(null, '', state.viewHash);
    state.enteredInApp = false;
  }

  function go(hash, replace = false) {
    if (replace) { history.replaceState(null, '', hash); applyRoute(); return; }
    history.pushState(null, '', hash);
    applyRoute(true);
  }

  /* ---------- actions ---------- */

  function startDiscussion(index) {
    const question = questions[Number(index)]?.[1] || questions[0][1];
    go('#/notes', $('#readerDialog').open);
    const input = $('#noteText');
    if (!input) return;
    const existing = input.value.trim();
    input.value = `${existing ? `${existing}\n\n` : ''}${question}\n\nMy answer:\n`;
    input.dataset.kind = 'discussion';
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    notify('This is a private draft and won\'t be published.');
  }

  async function copyText(text, button, message = 'Copied. Before using it, check for any 【brackets】 you haven\'t filled in.') {
    if (!text) return;
    try {
      // Keep the fallback inside the trusted click, including in embedded browsers.
      const field = el('textarea');
      field.value = text;
      field.readOnly = true;
      field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none';
      ($('dialog[open]') || document.body).append(field);
      field.focus({ preventScroll: true });
      field.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } finally { field.remove(); }
      button?.focus({ preventScroll: true });
      if (!copied) {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
      }
      if (button) {
        const label = button.textContent;
        button.textContent = 'Copied';
        setTimeout(() => { if (button.isConnected && button.textContent === 'Copied') button.textContent = label; }, 2400);
      }
      notify(message);
    } catch (_) {
      notify('Clipboard unavailable. Please select the prompt and copy it by hand.');
    }
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('a[href^="#"]')) {
      const href = target.getAttribute('href');
      if (href.startsWith('#/')) {
        if (target.hasAttribute('data-replace')) { event.preventDefault(); go(href, true); }
        else if (href === location.hash && !target.closest('dialog')) { event.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); }
        return;
      }
      // Plain anchors scroll within the home view without touching the route.
      const destination = href.length > 1 ? document.getElementById(href.slice(1)) : null;
      if (!destination) return;
      event.preventDefault();
      if (destination.closest('.view') && destination.closest('.view').hidden) go('#/topics');
      requestAnimationFrame(() => destination.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }));
      if (destination.id === 'main') destination.focus({ preventScroll: true });
      return;
    }
    if (target.hasAttribute('data-copy')) {
      copyText($(`#${target.dataset.copy}`)?.textContent.trim(), target, target.dataset.copyMsg || 'Copied. Paste it into your video generation tool and it\'s ready to use.');
    } else if (target.hasAttribute('data-book-state')) {
      const [id, key] = target.dataset.bookState.split(':');
      if (bookById.has(id) && READ_STATES[key]) setBookState(id, key);
    } else if (target.hasAttribute('data-save')) {
      const id = target.dataset.save;
      if (!entryById.has(id)) return;
      if (activeSaved.has(id)) activeSaved.delete(id); else activeSaved.add(id);
      const saved = persist();
      syncSaved();
      renderNotes();
      if (saved) notify(activeSaved.has(id) ? 'Saved to this device.' : 'Removed from saved items.');
    } else if (target.hasAttribute('data-discuss')) {
      startDiscussion(target.dataset.discuss);
    } else if (target.hasAttribute('data-delete-note')) {
      localState.notes = localState.notes.filter(note => note.id !== target.dataset.deleteNote);
      const saved = persist();
      renderNotes();
      if (saved) notify('This note has been deleted from this device.');
    } else if (target.hasAttribute('data-close')) {
      target.closest('dialog')?.close();
    }
  });

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      const opener = lastActivator.get(dialog);
      if (opener?.isConnected && !opener.closest('dialog') && !$('dialog[open]')) opener.focus({ preventScroll: true });
      if ('quiet' in dialog.dataset) { delete dialog.dataset.quiet; return; }
      leaveDialogRoute();
      document.title = state.title || VIEW_TITLES[state.view || 'topics'];
    });
  });

  $('#searchInput')?.addEventListener('input', renderSearch);

  // Typing a chapter marks the book as being read, if it had no state yet.
  document.addEventListener('change', event => {
    const input = event.target.closest?.('[data-book-chapter]');
    if (!input || !bookById.has(input.dataset.bookChapter)) return;
    const id = input.dataset.bookChapter;
    const chapter = input.value.trim().slice(0, 40);
    localState.books[id] = { state: localState.books[id]?.state || 'reading', chapter };
    if (persist()) notify('Noted, and kept on this device only.');
    renderLibrary();
    renderNotes();
  });

  document.addEventListener('keydown', event => {
    const typing = Boolean(event.target.closest?.('input, textarea, select, [contenteditable="true"]'));
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      go('#/search', $('#readerDialog').open);
    } else if (event.key === '/' && !typing && !$('dialog[open]')) {
      event.preventDefault();
      go('#/search');
    }
  });

  $('#noteForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = $('#noteText');
    const text = input?.value.trim();
    if (!text) { notify('Write something first, then save it.'); input?.focus(); return; }
    if (localState.notes.length >= 100) { notify('This notebook holds up to 100 notes. Delete one to add another.'); return; }
    const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localState.notes.unshift({ id, text: text.slice(0, 10000), kind: input.dataset.kind === 'discussion' ? 'discussion' : 'note', createdAt: new Date().toISOString() });
    const saved = persist();
    input.value = '';
    delete input.dataset.kind;
    renderNotes();
    if (saved) notify('Saved on this device.');
  });

  /* ---------- resume maker: the reader's facts in, one prompt out ---------- */

  function resumePrompt({ facts, job, style }) {
    return [
      'You are a résumé editor who understands hiring. Using the real experience I give below, write a résumé in English for this job, no longer than one page.',
      '',
      '【My real experience】',
      facts.trim() || '【Write what you have done here: where, what you did, how it turned out】',
      '',
      '【The job I want】',
      job.trim() || '【Paste the job description here, or describe the direction you want】',
      '',
      'Rules:',
      '1. Use only the facts I give. Don\'t invent any experience, figures or certificates I haven\'t mentioned; where something needs adding, mark it as 【To add: …】 and ask me.',
      '2. Read the job description first, pick out the three to five most important requirements, and put the parts of my experience that best match them first.',
      '3. Write each item as “what I did + how it turned out”, using numbers wherever possible.',
      `4. Style — ${RESUME_STYLES[style]}`,
      '5. Return two things: first the résumé text (Markdown), then a comparison table: each requirement of the job → which of my experience matches it → what\'s still missing.',
      '6. Finally, check your own work: is there any sentence I never said? If so, delete it or flag it.'
    ].join('\n');
  }

  let resumeTimer;
  function syncResume(save) {
    const form = $('#resumeForm');
    const out = $('#resumePrompt');
    if (!form || !out) return;
    localState.resume = {
      facts: $('#resumeFacts').value.slice(0, 6000),
      job: $('#resumeJob').value.slice(0, 6000),
      style: form.elements.resumeStyle.value in RESUME_STYLES ? form.elements.resumeStyle.value : 'steady'
    };
    out.textContent = resumePrompt(localState.resume);
    if (save) { clearTimeout(resumeTimer); resumeTimer = setTimeout(persist, 500); }
  }

  if ($('#resumeForm')) {
    $('#resumeFacts').value = localState.resume.facts;
    $('#resumeJob').value = localState.resume.job;
    $('#resumeForm').elements.resumeStyle.value = localState.resume.style;
    $('#resumeForm').addEventListener('input', () => syncResume(true));
    $('#resumeForm').addEventListener('submit', event => event.preventDefault());
    syncResume(false);
  }

  window.addEventListener('hashchange', () => applyRoute(true));

  renderChronList();
  renderLibrary();
  renderLists();
  applyRoute();
  state.booted = true;
  // motion.js themes the page from the first section on load; restate the current view's colours after it.
  document.addEventListener('DOMContentLoaded', () => themeFor(state.view));
})();
