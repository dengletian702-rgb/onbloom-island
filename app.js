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
      id: 'prompt-materials', number: '01', title: '整理材料，保留不确定的地方',
      summary: '分开你知道的、你认为的、还要核实的。',
      tags: ['演讲与 PPT', '原创模板'],
      fields: [
        ['audience', '听众', '刚开始学 AI 的朋友'],
        ['topic', '主题', '你想讲清的是什么？'],
        ['duration', '目标时长', '约 5 分钟'],
        ['known', '听众已经知道', '他们对这个话题已有的认识'],
        ['takeaway', '希望带走的变化', '听完之后，他们应该理解或能判断什么？'],
        ['materials', '你的真实材料', '粘贴笔记、原话、事实与来源，用 S1、S2、S3 编号分开', true]
      ],
      build: v => `我准备向${v.audience}介绍${v.topic}，目标时长约${v.duration}。\n听众已经知道：${v.known}。\n我希望他们听完理解或能判断：${v.takeaway}。\n\n以下是我的真实材料：\n${v.materials}\n\n请先整理，不写完整演讲稿：\n1. 用一句话复述我想讲什么。\n2. 分开列出：材料直接支持的事实、我的看法、尚待确认的设想。\n3. 指出哪些材料与这次表达无关，说明理由。\n4. 如果缺失信息会改变主要意思，最多问三个关键问题。\n\n保留材料编号。不要补造数据、案例、听众反应或已经完成的工作。`,
      note: '已经有真实材料时使用。这个模板还没有运行或评估过；输入框里的灰字只是填写提示，不是结果。'
    },
    {
      id: 'prompt-structure', number: '02', title: '先比较结构，再写讲稿',
      summary: '先选定论证顺序，再要完整讲稿。',
      tags: ['演讲与 PPT', '原创模板'],
      fields: [
        ['point', '已确认的核心句', '你希望听众记住的那一句'],
        ['materials', '真实材料与编号', '这次分享可能用到的笔记和证据', true],
        ['mustKeep', '必须保留的意思', '含义、约束和要求', true],
        ['unknown', '仍未确定的事项', '还没决定或还不知道的事', true],
        ['pages', '最多页数', '6']
      ],
      build: v => `已确认的核心句：${v.point}。\n真实材料与编号：\n${v.materials}\n必须保留的意思：\n${v.mustKeep}\n仍未确定的事项：\n${v.unknown}\n\n请提出两个不同的表达顺序，每个不超过${v.pages}页。\n每页只写：它回答的问题、一句核心意思、对应材料编号。\n说明两个顺序各适合什么听众，指出最容易讲散的地方。\n不要把建议写成已实现的功能，不要为了凑页数添加故事。\n\n等我选择结构后，再根据所选结构写简短讲稿。`,
      note: '核心句核对过之后使用。AI 可以给出不同方案，选哪一个仍要你自己判断。尚未试用。'
    },
    {
      id: 'prompt-visual', number: '03', title: '让视觉服务内容',
      summary: '先问画面帮人理解什么，再谈装饰。',
      tags: ['演讲与 PPT', '原创模板'],
      fields: [
        ['outline', '选定的逐页结构', '每页一个问题、一句核心意思', true],
        ['feeling', '希望的气质', '例如亲切、自由、富有想象力'],
        ['reading', '不能牺牲的阅读条件', '展示设备、字号需求或其他已知条件', true]
      ],
      build: v => `下面是我选定的逐页结构：\n${v.outline}\n希望的气质：${v.feeling}。\n不能牺牲的阅读条件：${v.reading}。\n\n请逐页建议一种能帮助理解的呈现方式，并说明它帮助理解什么。\n先用文字描述，不生成图片或幻灯片。\n每页保留一个视觉焦点，区分必要信息与可选装饰。\n若某个意象需要解释很多才能看懂，请提出更直接的方案。`,
      note: '结构已定、展示条件已知时使用。它不检查可读性，请在实际设备上看真正的幻灯片。尚未试用。'
    },
    {
      id: 'prompt-review', number: '04', title: '审查事实和意思有没有被写偏',
      summary: '把草稿放回原始材料，一句一句对照。',
      tags: ['演讲与 PPT', '原创模板'],
      fields: [
        ['materials', '原始材料（带编号）', '笔记、引语、证据和编号', true],
        ['draft', '当前稿件', '粘贴要检查的逐页文字', true]
      ],
      build: v => `原始材料：\n${v.materials}\n当前稿件：\n${v.draft}\n\n请逐项检查：\n- 哪句话找不到原始材料支持？\n- 哪处把建议、计划或未知情况写成了事实？\n- 哪处虽然好听，却偏离了我原本的意思？\n- 对初学者而言，哪一步缺少解释？\n\n把问题定位到具体句子，附材料编号或写明“材料不足”。\n给出修改建议，不直接替我决定。\n你的检查也需要我复核；不能把“未发现问题”当成事实已获验证。`,
      note: '能把草稿和来源放在一起对照时使用。AI 的检查也会漏错，它是辅助，不是独立验证。尚未试用。'
    }
  ];

  const articles = [
    {
      id: 'presentation', type: '专题', title: '怎样让 AI 帮你把一件事讲清楚',
      summary: '演讲与 PPT 的第一份样板：先写清听众、一句话、证据、结构和检查方式，再请 AI 帮忙。',
      status: '文字初稿 · PPT 制作和试讲还没做', tag: '演讲与 PPT', domains: ['AI 与科技'], author: '花屿编辑部',
      cover: 'sheet', coverState: '文字初稿',
      paragraphs: [
        '你手里有材料、有听众，也有截止时间。在请 AI 做一份漂亮的 PPT 之前，先想清楚：你希望别人听懂哪一件事。这个专题从五件事开始：听众、一句话、证据、结构、检查。',
        '我们用的真实材料，是花屿自己的项目讨论。它展示了一个转折：好不好看、主题是什么、实际提供什么，是三个不同的问题。这份初稿背后，还没有做好的幻灯片，也没有试讲和听众反馈。',
        '下面六部分连在一起读。提示词可以填好后复制到你自己选的 AI 工具里；花屿不会替你运行，也不会替你生成 PPT。试作记录写明了实际做过什么、还缺什么。'
      ],
      related: ['explanation', 'case', 'workflow', 'trial', 'checklist', 'discussion']
    },
    {
      id: 'explanation', type: '01 · 解释文章', title: '先知道自己要讲清什么',
      summary: '听众、一句话、证据、结构、检查：先填这五格，再请 AI 协助。',
      status: '文字草稿 · 方法还没经过使用验证', tag: '演讲与 PPT', author: '花屿编辑部 · 拾 导读', parent: 'presentation',
      paragraphs: [
        '拿着一段想法去问 AI：“帮我做一份有创意的 PPT。”这句话表达了愿望，却没有说明听众需要理解什么。拿到结果后，我们可能只能说“再丰富一点”“再漂亮一点”，很难判断内容有没有讲到点上。',
        '花屿的讨论经历过一个真实的转折。起初的反馈是样式不好看；后来画面越来越丰富，又被说“找不见主题”；故事清楚以后，追问来了：“我们内容实质在做什么呢”。好不好看、主题是什么、实际提供什么，需要分别回答。美感依然重要。',
        '对初学者来说，可以先填五件事，再请 AI 协助：',
        { list: [
          ['听众', '他们已经知道什么，现在最困惑什么？'],
          ['一句话', '如果听完只记得一句话，我希望是哪句？'],
          ['证据', '我手里有哪些原话、事实、例子？哪些只是设想？'],
          ['结构', '听众需要按什么顺序理解，才跟得上这句话？'],
          ['检查', '哪处可以追溯来源？哪处可能被误解？哪里还要亲自试？']
        ] },
        '在花屿这个例子里，一句话可以暂定为：“我们把分散的 AI 资料和实践经验，整理成面对具体问题时能理解、判断和使用的内容。”它比一句世界观口号更直接地回答了内容工作。主题句仍然重要，它说明我们为什么愿意一起做这件事。',
        '再把材料交给 AI，请它提出结构、指出缺项、试不同说法。哪些事实成立、哪些意思被写偏了、什么呈现适合听众，由我们自己判断。好看的形式，应该帮听众看见这句话。',
        '这套方法是从这次讨论里提炼的，还没有证明能普遍提高表达能力。真正有没有用，要看初学者能不能拿自己的材料独立走一遍。'
      ]
    },
    {
      id: 'case', type: '02 · 案例分析', title: '从画面、故事，走到内容实质',
      summary: '用花屿的真实对话，看三种反馈分别在问什么。',
      status: '真实材料 · 编辑解读 · 没有可对比的 PPT 版本', tag: '演讲与 PPT', author: '花屿编辑部 · 拾 导读', parent: 'presentation',
      paragraphs: [
        '花屿起初收到的反馈很直接：“框架做的没错，但是样式做的太丑太丑了。”后来画面越来越满，又听到：“画的内容太复杂了，我找不见主题”。故事讲顺之后，问题变成：“我们内容实质在做什么呢”。',
        '这是三种不同的反馈。第一种要的是审美质量；第二种要的是层次，和一眼能看见的主题；第三种要的是对工作本身的具体说明：挑选并讲清资料、亲手试并记录、整理并更新。',
        '放到一次分享里，每个问题各有各的任务。好画面负责气氛；故事解释角色为什么同行；专题样板负责展示别人真正能读、能带走的内容。',
        '这里没有一份经实测“更好”的旧 PPT 和新 PPT，只有一段需求逐步清晰的真实对话。我们不能把继续讨论写成“满意度提升”或“学习效果提升”。'
      ]
    },
    {
      id: 'workflow', type: '03 · 提示词', title: '四个小请求，留出自己选择的余地',
      summary: '整理、比较、呈现、审查，每一步都让原始材料留在眼前。',
      status: '四个原创模板 · 等待第一次试用', tag: '演讲与 PPT', author: '花屿编辑部', parent: 'presentation',
      paragraphs: [
        '别一次要一整份成品，试着拆成四个请求。先把材料分成事实、看法和尚待确认的设想；再请 AI 比较两种表达顺序，由你自己选定一种，然后才写讲稿。',
        '第三步，给每页一个视觉任务，问清楚这个画面帮听众理解什么。第四步，把稿件放回原始材料里检查：有没有编造，有没有把建议说成已经做到，有没有写得好听却变了意思。',
        '下面四个模板是花屿编写的原创初稿。填进你理解、也有权使用的材料，再复制到你自己选的 AI 工具里。没填的地方会保留【方括号】提示；花屿里不会运行任何东西。',
        '这些模板还没有用真实材料在任何 AI 工具里试过。我们没有模型输出、耗时、费用或完成的 PPT 可以报告。第一次试用时，请把输入和输出一起留下，下一版修订才有依据。'
      ],
      related: prompts.map(prompt => prompt.id)
    },
    {
      id: 'trial', type: '04 · 试作记录', title: '我们实际做过的事',
      summary: '一次文字整理的完整记录，没做完的部分也写在这里。',
      status: '只做了文字整理 · 没有 PPT，也没有试讲', tag: '演讲与 PPT', author: '花屿编辑部 · 炉 记录', parent: 'presentation',
      record: [
        ['目标', '从花屿的真实对话，整理出可审阅的专题样板和六页内部分享文字稿，为后续真实试作准备材料。'],
        ['输入', '花屿对话里的六段原话和讨论稿（S1–S6），并要求区分事实、建议和尚未发生的工作。'],
        ['实际过程', 'Codex 从对话里选出相关原句，按视觉反馈、项目澄清、主题反馈、内容追问的顺序编排，写出方法、四个可填模板、六页讲稿和检查清单。Claude Code 随后核对了各条内容的状态，并整理了界面文字。'],
        ['实际结果', '一份文字初稿，等待审阅。'],
        ['本次修改', '分享重心放到初学者能复用的表达方法；把主题句和内容工作分开；关键陈述标明材料依据和状态。'],
        ['还没做的', '模板试跑、PPT 制作、投影阅读检查、口头试讲、听众反馈、初学者独立使用记录。', true],
        ['结论', '有了一份可以继续试用的文字初稿；不能据此说节省了时间、更容易听懂，或提高了 PPT 质量。'],
        ['耗时与费用', '没有计时，也没有记录费用。不能补写成零耗时或免费。', true],
        ['最后文字核对', '2026-10-27，只核对了对话引用与状态，不等于外部事实核验或效果测试。'],
        ['最后实际验证', '尚未进行。', true]
      ],
      paragraphs: [
        '这份记录只覆盖文字整理。之前有人反馈画面“太复杂”“找不见主题”，这份初稿据此把每页限定为一个主要问题。这是一条用户反馈，不是单独做过的画面评测，也不能证明修改有效。'
      ]
    },
    {
      id: 'checklist', type: '05 · 检查清单', title: '变成 PPT 之前，先查这十项',
      summary: '意思、证据、阅读条件和真实反馈，十项逐条核对。',
      status: '待填写 · 没有一项标记为通过', tag: '演讲与 PPT', author: '花屿编辑部 · 阿驮 核对', parent: 'presentation',
      paragraphs: [
        '有了初稿再用这份清单。没勾选，只表示这里还没记录答案，不表示失败；有几项要等真的做出幻灯片、试讲过以后才能填。',
        '勾选只保存在你这台设备上，作为你自己的工作副本。每打一个勾，最好也留下让它成立的依据。'
      ],
      checklist: [
        '一句话能说明这次分享希望听众理解什么。',
        '原话与材料编号对得上，没有把几段对话拼成一句伪原话。',
        '已确认的、编辑建议、未实现和未知的情况分得清楚。',
        '没有把文字整理写成真实 PPT 制作、模板试跑或试讲结果。',
        '关键事实有依据；主题句没有代替具体内容说明。',
        '每页围绕一个主要问题，初学者不需要先懂花屿的全部世界观。',
        '模板可以换成其他真实材料，不要求使用者虚构案例或效果。',
        '做出幻灯片后，在实际设备上检查阅读、图表、字号和来源。',
        '试讲后记录实际时长、困惑和修改，而不是凭文字长度宣布“五分钟”。',
        '公开前确认材料的公开范围；内部对话不能默认全部公开。'
      ]
    },
    {
      id: 'discussion', type: '06 · 讨论', title: '你会先质疑哪一处？',
      summary: '带一个具体的疑问、一次尝试或一个反例来。',
      status: '问题已备好 · 还没有公开评论', tag: '演讲与 PPT', author: '花屿编辑部', parent: 'presentation',
      paragraphs: [
        '讨论最好贴着具体的工作：指出哪一句难懂，说明哪个模板改变了你的意思，或者描述一个这套顺序不适用的场景。',
        '如果你在别处试了模板，请把原始材料和结果放在一起，写明听众、约束和你改了什么。不利的结果同样值得留下。“我喜欢”就记成喜好，不要换算成学习效果或效率。',
        '下面是准备好的问题，还不是读者回复。公开发帖和共享讨论还没有接入；你可以在「我的」里写一段私人回答，它只存在这个浏览器里，不会发给任何人。'
      ]
    },
    {
      id: 'cost-brief', type: '筹备中的专题', title: '弄清你的 token 花在哪里',
      summary: '换工具之前，先学会读用量。',
      status: '研究提纲 · 还没做成本实验', tag: 'AI 成本', domains: ['AI 与科技'], author: '花屿编辑部',
      cover: 'thread', coverState: '筹备中',
      paragraphs: [
        '要回答的问题：为什么一套 AI 工作流用起来觉得贵？换工具之前应该先量什么？这个专题会分开讲订阅额度和按量计费的 API、输入和输出，以及“报告里的缓存用量”和“一定会省钱”之间的区别。',
        '第一次试作应该用一个可重复、不涉及敏感信息、质量要求看得见的任务。记录服务商、实际模型（如有报告）、日期、请求大小、输出、重试次数、实测用量和计价依据。比较的是得到一个合格结果的总成本，而不只是单个 token 的价格。',
        '我们先打开了官方的提示词缓存说明，作为第一份资料。它解释了可复用提示前缀的条件，但不能说明花屿的某个工作流一定会省钱。基准测试、账单对比和推荐都还没有。这份提纲仍然只是计划。'
      ],
      related: ['library-caching']
    },
    {
      id: 'team-brief', type: '筹备中的专题', title: '小团队第一次有用的 AI 尝试',
      summary: '从一件边界清楚的工作和一个判断标准开始。',
      status: '研究提纲 · 还没在任何团队试过', tag: '团队', domains: ['商业'], author: '花屿编辑部',
      cover: 'cradle', coverState: '筹备中',
      paragraphs: [
        '要回答的问题：“用 AI”太宽，小团队到底从哪儿开始？建议的起点是一项反复出现的任务：有明确的负责人、获准使用的输入材料、现在的做法，以及可以审阅的结果。',
        '第一份记录应该写明：哪些内容允许放进工具、谁来检查输出、怎样算合格、什么时候停下。培训围绕这件真实任务展开：一个做完的示例、一次独立尝试、一次复盘。',
        '在声称提效之前，先在可比的条件下记录现在的流程和试用的流程，包括审阅和返工时间。花屿还没有和任何企业做过这个实验，也没有培训过团队。这是一份等待合适材料和自愿参与者的编辑提纲，不是服务承诺，也不是成功案例。'
      ]
    }
  ];

  const sources = [
    {
      id: 'library-openai', type: '官方指南', title: '给模型一份清楚的说明',
      sourceTitle: 'OpenAI · Prompt engineering',
      summary: '把指令、示例和要处理的材料分开，从这里开始。',
      href: 'https://developers.openai.com/api/docs/guides/prompt-engineering',
      status: '链接已核对 · 2026-10-27', tag: '提示词', author: '花屿导读 · 拾',
      paragraphs: [
        '想把说明写得更有条理时，读这份官方指南。它讲了指令、消息角色和各种提示技巧。放到我们的演讲专题里，有用的问题是：目标、约束和原始材料是否清楚到足以判断一份草稿。',
        '花屿的四个可填模板是我们自己的编辑作品，不是从这份指南摘录的；这份指南也不能证明那些模板经过测试。各家模型的行为会变化，请以你实际使用的工具的最新文档为准。'
      ]
    },
    {
      id: 'library-caching', type: '官方指南', title: '重复的输入什么时候能复用',
      sourceTitle: 'OpenAI · Prompt caching',
      summary: '先弄懂“前缀匹配”和报告里的缓存用量，再谈省钱。',
      href: 'https://developers.openai.com/api/docs/guides/prompt-caching',
      status: '链接已核对 · 2026-10-27', tag: '成本与用量', author: '花屿导读 · 拾',
      paragraphs: [
        '这份指南说明 OpenAI API 的提示词缓存。能否复用，取决于提示前缀是否一致，以及模型的适用条件。对话里某处重复出现同样的话，并不等于命中缓存。',
        '为筹备中的成本专题，先记录实际用量和对应的计价依据，再下结论。服务商设置、模型行为和工作量都会影响结果。这份资料不涉及订阅额度，我们也还没有在花屿的工作流里测出任何节省。'
      ]
    },
    {
      id: 'library-claude', type: '官方指南', title: '先决定怎样才算成功',
      sourceTitle: 'Anthropic · Prompt engineering overview',
      summary: '先定标准和测试方法，再去打磨提示词。',
      href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
      status: '链接已核对 · 2026-10-27', tag: '提示词', author: '花屿导读 · 拾',
      paragraphs: [
        'Anthropic 的这份概览从三件事开始：成功标准、检验方法、一份提示词草稿。它也区分了哪些问题靠改提示词能解决，哪些可能需要换模型或换流程。',
        '配合花屿的检查清单使用，先想清楚你实际能观察到什么。一个看起来清楚的回答不等于试讲，改一版提示词也不能证明学得更好。应用时请看服务商最新的模型说明；我们的演讲模板仍未经过测试。'
      ]
    }
  ];

  const questions = [
    ['复述', '不用原句，你会怎样说花屿的内容工作？哪里还抽象？'],
    ['最难的一格', '听众、一句话、证据、结构、检查——哪一格最难填？能写出你自己的那一句吗？'],
    ['卡住的地方', '哪个模板步骤缺了信息，让你没法继续？'],
    ['意思变了', '把材料交给 AI 后，有没有出现“写得好听但意思变了”的句子？请把原句和输出放在一起，说说差别。'],
    ['反例', '这套顺序有没有不适合你的时候？那次的听众、材料和约束是什么？']
  ];

  const allEntries = [
    ...articles.map(item => ({ ...item, kind: 'article' })),
    ...sources.map(item => ({ ...item, kind: 'source' })),
    ...prompts.map(item => ({ ...item, kind: 'prompt', type: '原创提示词', tag: item.tags[0], status: '原创模板 · 尚未试用', parent: 'workflow' }))
  ];
  const entryById = new Map(allEntries.map(item => [item.id, item]));

  // The AI chronicle and the bookshelf live in their own data files (chronicle.js, books.js).
  const chronicle = window.HUAYU_CHRONICLE || [];
  const chronById = new Map(chronicle.map(item => [item.id, item]));
  const shelf = window.HUAYU_BOOKS || { parts: [], books: [], people: [], notes: {}, featured: [], pending: {} };
  const bookById = new Map(shelf.books.map(book => [book.id, book]));
  const ACCESS = { free: '全文免费', sample: '官方样章', review: '只有书评' };
  const READ_STATES = { todo: '待读', reading: '在读', done: '读完了' };
  const partName = id => shelf.parts.find(part => part.id === id)?.name || '';

  const VIEWS = ['topics', 'ai', 'library', 'prompts', 'together', 'notes', 'legal'];
  const VIEW_TITLES = {
    topics: '花屿 Onbloom Island · 以 AI 为起点的知识库与共学社区',
    ai: 'AI 编年史 · 花屿',
    library: '书架 · 花屿',
    prompts: '提示词 · 花屿',
    together: '共学 · 花屿',
    notes: '我的 · 花屿',
    legal: '说明与条款 · 花屿'
  };

  // The letter's closing lines: the home page keeps the original, every other page signs off with its own.
  const CLOSINGS = {
    topics: ['我们在此相聚，', '带着过去的智慧，', '和对未来的希望'],
    ai: ['许多人熬过的夜，', '后来都成了光，', '我们替它们记着'],
    library: ['有人花了一辈子，', '把想明白的事写下来，', '我们只需翻开'],
    prompts: ['把心里的话说清楚，', '再远的那一头，', '也会有人接住'],
    together: ['你不是一个人在问，', '灯下还有别人，', '也在想同一件事'],
    notes: ['今天写下的这一行，', '很多年后再看，', '会认出当时的自己'],
    legal: ['每一样借来的东西，', '都写清来处，', '这是对别人的敬意']
  };

  // The three looks a reader can ask the AI for in the resume maker under 我的.
  const RESUME_STYLES = {
    steady: '稳重清楚：单栏排版，分成个人简介、经历、技能三块，语气平实，适合大多数公司。',
    creative: '有创意：开头用一句话说清我是谁、能带来什么；每段经历起一个小标题；再建议一套配色和版式。版式可以大胆，内容仍然只来自我给的事实。',
    portfolio: '作品集式：把经历写成三个项目小故事（起因、我做了什么、结果），并为每个项目建议配一张什么样的图。'
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
      notify('浏览器存储不可用。这次改动只在页面打开期间有效。');
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
      a.dataset.cursor = '读这篇';
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
      el('p', 'chron-kicker', `AI 编年史 · 第 ${index + 1} 篇 · ${item.kind} · ${item.who}`),
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
    sources.append(el('h2', '', '原始出处'), list);
    const prev = chronicle[index - 1];
    const next = chronicle[index + 1];
    const pager = el('nav', 'chron-pager');
    pager.setAttribute('aria-label', '上一篇和下一篇');
    pager.append(
      prev ? link(`#/ai/${prev.id}`, 'chron-prev', `← ${prev.date} · ${prev.title}`) : link('#chronicle', 'chron-prev', '← 回到编年史'),
      next ? link(`#/ai/${next.id}`, 'chron-next', `${next.date} · ${next.title} →`) : link('#chronicle', 'chron-next', '回到编年史 →')
    );
    article.replaceChildren(
      facts,
      chronSection('发生了什么', item.happened),
      chronSection('为什么重要', item.why),
      chronSection('对我们有什么用', item.use),
      chronSection('还没有定论的地方', item.open),
      sources,
      el('p', 'reader-byline', `花屿 AI 编年史 · 阿驮整理 · 初稿 ${CHECKED} · 日期和数字以原始出处为准`),
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
    if (mine?.state === 'reading') reading.push('你');
    if (mine?.state === 'done') done.push('你');
    return { reading, done };
  }

  function bookCard(book) {
    const card = el('article', 'book');
    card.setAttribute('data-reveal', '');
    const a = link(`#/book/${book.id}`);
    a.dataset.cursor = '翻开';
    const { reading, done } = readersOf(book.id);
    a.append(el('span', `book-access is-${book.access}`, ACCESS[book.access]), el('strong', 'book-title', book.title));
    if (book.zh) a.append(el('span', 'book-zh', `《${book.zh}》`));
    a.append(
      el('span', 'book-meta', `${book.author} · ${book.year}`),
      el('p', 'book-why', book.why),
      el('span', 'book-foot', `在读 ${reading.length} · 读过 ${done.length}${shelf.notes[book.id] ? ' · 有导图和卡片' : ''}`)
    );
    card.append(a);
    return card;
  }

  function renderLibrary() {
    $('#freeBooks')?.replaceChildren(...shelf.featured.map(id => bookById.get(id)).filter(Boolean).map(bookCard));
    $('#partNav')?.replaceChildren(...shelf.parts.map(part => link(`#part-${part.id}`, '', `${part.name}  ${shelf.books.filter(book => book.part === part.id).length} 本`)));
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
        label.append(el('small', '', books.length ? `${books.length} 本` : '待上架'));
        const row = el('div', 'book-row');
        if (books.length) row.append(...books.map(bookCard));
        else row.append(el('p', 'shelf-pending', shelf.pending?.[name] || '这一层还没有书。'));
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
      li.append(link(`#/book/${book.id}`, '', book.zh ? `《${book.zh}》` : book.title));
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
      name: '你', role: '只记在这台设备上', self: true,
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
    slot.append(block('在读', person.reading, '还没登记'), block('读过', person.done, '还没登记'));
    slot.append(block(known.length ? '接着可以读' : '可以先读', suggestionsFor(known), ''));
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
    $('#readerEyebrow').textContent = `书架 · ${partName(book.part)} · ${book.shelf}`;
    $('#readerTitle').textContent = book.title;
    const body = $('#readerBody');
    body.replaceChildren();
    if (book.zh) body.append(el('p', 'book-zh-line', `《${book.zh}》`));
    body.append(el('p', 'book-meta-line', `${book.author} · ${book.year}`), el('p', 'book-lead', book.why));

    const where = readerSection('去哪里读');
    const verb = book.access === 'free' ? '开始读' : book.access === 'sample' ? '看样章' : '看书目';
    const go = link(book.href, 'btn btn--solid', `${verb}：${book.linkLabel} ↗`);
    go.target = '_blank';
    go.rel = 'noopener noreferrer';
    const badge = el('p', 'book-where');
    badge.append(el('span', `book-access is-${book.access}`, ACCESS[book.access]));
    where.append(badge, go);
    if (book.note) where.append(el('p', 'muted', book.note));
    where.append(el('p', 'book-checked', `链接核对于 ${shelf.checked}`));

    const who = readerSection('谁在读');
    const { reading, done } = readersOf(book.id);
    who.append(recordList([
      ['在读', reading.length ? reading.join('、') : '还没有人', !reading.length],
      ['读过', done.length ? done.join('、') : '还没有人', !done.length]
    ]));
    const mine = localState.books[book.id] || {};
    const states = el('div', 'read-state');
    states.setAttribute('role', 'group');
    states.setAttribute('aria-label', '我的阅读状态');
    Object.entries(READ_STATES).forEach(([key, label]) => {
      const button = el('button', 'btn', label);
      button.type = 'button';
      button.dataset.bookState = `${book.id}:${key}`;
      button.setAttribute('aria-pressed', String(mine.state === key));
      states.append(button);
    });
    const chapter = el('label', 'field book-chapter');
    const input = el('input');
    Object.assign(input, { value: mine.chapter || '', placeholder: '比如：第 3 章', maxLength: 40 });
    input.dataset.bookChapter = book.id;
    chapter.append(document.createTextNode('读到哪一章'), input);
    who.append(el('p', 'cap book-mine', '我的这一格 · 只记在这台设备上'), states, chapter);

    const ours = readerSection('我们做的');
    const notes = shelf.notes?.[book.id];
    if (notes) {
      ours.append(el('h4', '', '分析'));
      notes.analysis.forEach(text => ours.append(el('p', '', text)));
      ours.append(el('h4', '', '思维导图'));
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
      ours.append(map, el('h4', '', `学习卡片 · ${notes.cards.length} 张`));
      const cards = el('div', 'study-cards');
      notes.cards.forEach(([question, answer]) => {
        const card = el('details', 'study-card');
        card.append(el('summary', '', question), el('p', '', answer));
        cards.append(card);
      });
      ours.append(cards, el('p', 'reader-byline', notes.by));
    } else {
      ours.append(recordList([['分析', '待做', true], ['思维导图', '待做', true], ['学习卡片', '待做', true]]));
    }

    const rating = readerSection('分模块评分');
    rating.append(recordList([['好懂', '待评', true], ['好用', '待评', true], ['耐读', '待评', true]]), el('p', 'muted', '等第一批读完的人来打分。'));
    const feedback = readerSection('大家的反馈');
    feedback.append(el('p', '', '还没有反馈。'), el('p', 'muted', '大陆站不开评论区。读者的反馈由编辑整理成摘要，放在这里。'));
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
    if (saved) notify(localState.books[id] ? `已记为「${READ_STATES[key]}」，只存在这台设备上。` : '已清除这本书的状态。');
  }

  /* ---------- inner views ---------- */

  function row(item, index) {
    const li = el('li');
    const a = link(`#/topic/${item.id}`, 'row');
    a.dataset.cursor = item.kind === 'prompt' ? '填写' : '阅读';
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
        const write = el('button', 'u-link', '写下我的回答');
        write.type = 'button';
        write.dataset.discuss = String(index);
        actions.append(write, link('#/topic/discussion', 'muted', '来自专题：怎样让 AI 帮你把一件事讲清楚 ↗'));
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
    list.replaceChildren(el('p', 'local-notice', localAvailable ? '只在这台设备 · 私人草稿 · 不发布、不同步' : '浏览器存储不可用 · 改动只在页面打开期间有效'));
    if (!localState.notes.length) list.append(el('p', 'empty-state', '一句值得留下的话、一个问题、下一件想试的事——第一条笔记可以从这里开始。'));
    localState.notes.forEach(note => {
      const article = el('article', 'saved-note');
      const when = new Date(note.createdAt);
      const dateText = Number.isNaN(when.getTime()) ? '本机草稿' : when.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      const remove = el('button', 'u-link', '删除这条');
      remove.type = 'button';
      remove.dataset.deleteNote = note.id;
      article.append(el('p', 'meta', `${note.kind === 'discussion' ? '讨论草稿 · 未发布' : '私人笔记'} · ${dateText}`), el('p', 'text', note.text), remove);
      list.append(article);
    });
    const mine = myShelf();
    if (mine.reading.length || mine.done.length) {
      const section = el('section', 'saved-reading');
      section.append(el('h3', '', '我的书架'));
      [...mine.reading.map(id => [id, '在读']), ...mine.done.map(id => [id, '读完了'])].forEach(([id, label]) => {
        const book = bookById.get(id);
        const chapter = localState.books[id]?.chapter;
        section.append(link(`#/book/${id}`, '', `${book.zh ? `《${book.zh}》` : book.title} · ${label}${chapter ? ` · ${chapter}` : ''} ↗`));
      });
      list.append(section);
    }
    const saved = [...activeSaved].map(id => entryById.get(id)).filter(Boolean);
    if (saved.length) {
      const section = el('section', 'saved-reading');
      section.append(el('h3', '', '收藏'));
      saved.forEach(item => section.append(link(`#/topic/${item.id}`, '', `${item.title} ↗`)));
      list.append(section);
    }
  }

  function syncSaved() {
    const count = $('#savedCount');
    if (count) {
      count.textContent = String(activeSaved.size);
      count.setAttribute('aria-label', `已收藏 ${activeSaved.size} 条`);
    }
    $$('[data-save]').forEach(button => {
      const saved = activeSaved.has(button.dataset.save);
      button.textContent = saved ? '已收藏' : '收藏';
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
        li.append(el('b', '', `${term}：`), document.createTextNode(text));
        list.append(li);
      });
      parent.append(list);
    });
  }

  function addRelated(parent, entry) {
    const ids = entry.related || (entry.parent ? entryById.get(entry.parent).related : null);
    if (!ids?.length) return;
    const section = el('section', 'reader-section');
    const heading = entry.id === 'workflow' ? '四个模板' : entry.kind === 'prompt' ? '其他模板' : entry.parent ? '同一专题里的其他部分' : '这个专题的六部分';
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
      a.append(el('span', 'kind', entry.kind === 'prompt' ? '回到' : '回到专题'), el('span', 't', parent.title), el('i', '', '↗'));
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
    section.append(el('h3', '', '你的本机工作副本'));
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
    parent.append(el('p', 'reader-status', '原创模板 · 尚未运行或评估'), el('p', 'prompt-note', prompt.note));
    const form = el('form', 'field-grid');
    form.addEventListener('submit', event => event.preventDefault());
    const controls = [];
    const preview = el('pre', 'prompt-preview');
    preview.tabIndex = 0;
    preview.setAttribute('aria-label', '提示词预览');
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
    section.append(el('h3', '', '你的提示词'), el('p', 'local-notice', '没填的地方会保留【方括号】。复制前再看一遍。'), preview);
    const copy = el('button', 'btn btn--solid', '复制提示词 ↗');
    copy.type = 'button';
    copy.addEventListener('click', () => copyText(text, copy));
    section.append(copy);
    parent.append(form, section);
    update();
  }

  function saveButton(id) {
    const button = el('button', 'btn save-toggle', activeSaved.has(id) ? '已收藏' : '收藏');
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
        const source = link(entry.href, 'source-link u-link', `读原文：${entry.sourceTitle} ↗`);
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        body.append(source);
      }
      if (entry.checklist) renderChecklist(body, entry);
      if (entry.id === 'discussion') {
        const list = el('ol', 'discussion-questions');
        questions.forEach(([, question]) => list.append(el('li', '', question)));
        const write = el('button', 'btn', '写下我的回答 ↗');
        write.type = 'button';
        write.dataset.discuss = '0';
        body.append(list, write);
      }
    }
    addRelated(body, entry);
    if (entry.kind !== 'prompt') body.append(el('p', 'reader-byline', `${entry.author} · 更新于 ${UPDATED}`));
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
      title: item.title, type: `编年史 · ${item.date}`, summary: item.short, href: `#/ai/${item.id}`,
      text: [item.title, item.who, item.kind, item.short, ...item.happened, ...item.why, ...item.use, ...item.open, ...item.facts.flat()].join(' ')
    })),
    ...shelf.books.map(book => ({
      title: book.zh ? `${book.title}《${book.zh}》` : book.title, type: `书架 · ${partName(book.part)}`, summary: book.why, href: `#/book/${book.id}`,
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
    results.replaceChildren(el('p', 'search-count', terms.length ? `找到 ${found.length} 条` : '可以从这几条开始'));
    if (!found.length) results.append(el('p', 'empty-state', '还没有对应的内容。试试“Transformer”“Claude”“营销”或“免费”。'));
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
      if (index === lines.length - 1) span.append(el('em', 'dot', '。'));
    });
    box.setAttribute('aria-label', `${lines.join('')}。`);
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
      document.title = `${entry.title} · 花屿`;
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
      document.title = `${book.zh ? `《${book.zh}》` : book.title} · 书架 · 花屿`;
      return;
    }
    if (route.search) {
      if (!state.view) setView('topics');
      closeQuietly(reader);
      renderSearch();
      openDialog(search);
      requestAnimationFrame(() => $('#searchInput')?.focus());
      document.title = '搜索 · 花屿';
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
      state.title = `${chronById.get(route.ai).title} · AI 编年史 · 花屿`;
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
    input.value = `${existing ? `${existing}\n\n` : ''}${question}\n\n我的回答：\n`;
    input.dataset.kind = 'discussion';
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    notify('这是一份私人草稿，不会发布。');
  }

  async function copyText(text, button, message = '已复制。用之前，先看看还有没有没填的【方括号】。') {
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
        button.textContent = '已复制';
        setTimeout(() => { if (button.isConnected && button.textContent === '已复制') button.textContent = label; }, 2400);
      }
      notify(message);
    } catch (_) {
      notify('剪贴板不可用。请手动选中提示词复制。');
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
      copyText($(`#${target.dataset.copy}`)?.textContent.trim(), target, target.dataset.copyMsg || '已复制。粘贴到你用的视频生成工具里就能用。');
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
      if (saved) notify(activeSaved.has(id) ? '已收藏到这台设备。' : '已从收藏中移除。');
    } else if (target.hasAttribute('data-discuss')) {
      startDiscussion(target.dataset.discuss);
    } else if (target.hasAttribute('data-delete-note')) {
      localState.notes = localState.notes.filter(note => note.id !== target.dataset.deleteNote);
      const saved = persist();
      renderNotes();
      if (saved) notify('这条笔记已从本机删除。');
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
    if (persist()) notify('记下了，只存在这台设备上。');
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
    if (!text) { notify('先写点什么，再记下来。'); input?.focus(); return; }
    if (localState.notes.length >= 100) { notify('这本笔记最多放 100 条。删掉一条再记。'); return; }
    const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localState.notes.unshift({ id, text: text.slice(0, 10000), kind: input.dataset.kind === 'discussion' ? 'discussion' : 'note', createdAt: new Date().toISOString() });
    const saved = persist();
    input.value = '';
    delete input.dataset.kind;
    renderNotes();
    if (saved) notify('已记在这台设备上。');
  });

  /* ---------- resume maker: the reader's facts in, one prompt out ---------- */

  function resumePrompt({ facts, job, style }) {
    return [
      '你是一位懂招聘的简历编辑。请根据我下面给的真实经历，为这个职位写一份一页以内的中文简历。',
      '',
      '【我的真实经历】',
      facts.trim() || '【这里写你做过的事：在哪里、做了什么、结果怎样】',
      '',
      '【想去的职位】',
      job.trim() || '【这里贴职位描述，或写想做的方向】',
      '',
      '规则：',
      '1. 只用我给的事实。没写到的经历、数字、证书一律不要编；需要补充的地方，用【待补充：……】标出来问我。',
      '2. 先读职位描述，挑出最要紧的三到五个要求，把我经历里最能对上的放在最前面。',
      '3. 每条经历写成「做了什么 + 结果怎样」，能用数字就用数字。',
      `4. 风格——${RESUME_STYLES[style]}`,
      '5. 交回两样：先是简历正文（Markdown），再是一张对照表：职位的每个要求 → 我的哪条经历对上了 → 还缺什么。',
      '6. 最后自查一遍：有没有哪一句是我没说过的？有就删掉，或者标出来。'
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
