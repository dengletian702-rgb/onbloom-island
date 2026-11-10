"""Find every piece of visible Chinese text in the site, so it can be translated as a table.

  python3 tools/i18n/segments.py extract   -> writes tools/i18n/zh-segments.json (one entry per unique segment)
  python3 tools/i18n/segments.py build     -> reads tools/i18n/en.json, writes the English site into en/

A segment is a JavaScript string literal (or the literal part of a template string), an HTML text run, or an
HTML attribute value, that contains Chinese characters or Chinese punctuation. Comments are skipped.
The English build replaces each segment in place, so the code around it never changes.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = ROOT / "tools" / "i18n"
CJK = re.compile(r"[　-〿㐀-鿿＀-￯—…“”‘’]")
HAN = re.compile(r"[㐀-鿿]")
JS_FILES = ["app.js", "books.js", "chronicle.js"]
HTML_FILES = ["index.html"]


def js_segments(src):
    """Yield (start, end) of literal text inside strings; skip comments and regex literals."""
    i, n = 0, len(src)
    prev = ""  # last significant character, to tell a regex from a division
    while i < n:
        c = src[i]
        if c == "/" and src.startswith("//", i):
            i = src.find("\n", i)
            i = n if i < 0 else i
            continue
        if c == "/" and src.startswith("/*", i):
            i = src.find("*/", i + 2) + 2
            continue
        if c == "/" and (prev == "" or prev in "(,=:[!&|?{};+-*%<>~^" or src[max(0, i - 6):i].rstrip().endswith("return")):
            j = i + 1
            in_class = False
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    in_class = True
                elif src[j] == "]":
                    in_class = False
                elif src[j] == "/" and not in_class:
                    break
                j += 1
            i = j + 1
            prev = "/"
            continue
        if c in "'\"":
            j = i + 1
            while src[j] != c:
                j += 2 if src[j] == "\\" else 1
            yield (i + 1, j, c)
            i = j + 1
            prev = "a"
            continue
        if c == "`":
            i = yield from template(src, i + 1)
            prev = "a"
            continue
        if not c.isspace():
            prev = c
        i += 1


def template(src, i):
    """Literal chunks of a template string starting after the backtick; returns the index after the closing one."""
    start = i
    while True:
        c = src[i]
        if c == "\\":
            i += 2
            continue
        if c == "`":
            yield (start, i, "`")
            return i + 1
        if c == "$" and src[i + 1] == "{":
            yield (start, i, "`")
            i = expression(src, i + 2)
            start = i
            continue
        i += 1


def expression(src, i):
    """Skip a ${...} expression, including nested strings and templates; return index after its closing brace."""
    depth = 1
    while depth:
        c = src[i]
        if c in "'\"":
            j = i + 1
            while src[j] != c:
                j += 2 if src[j] == "\\" else 1
            i = j + 1
            continue
        if c == "`":
            for _ in template_skip(src, i + 1):
                pass
            i = template_end(src, i + 1)
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    return i


def template_skip(src, i):
    yield from ()


def template_end(src, i):
    while True:
        c = src[i]
        if c == "\\":
            i += 2
            continue
        if c == "`":
            return i + 1
        if c == "$" and src[i + 1] == "{":
            i = expression(src, i + 2)
            continue
        i += 1


def html_segments(src):
    """Text runs between tags, and attribute values; skip comments, <script> and <style> bodies."""
    for m in re.finditer(r"<!--.*?-->|<(script|style)\b.*?</\1>|<[^>]*>|[^<]+", src, re.S):
        tok = m.group(0)
        if tok.startswith("<!--") or m.group(1):
            continue
        if tok.startswith("<"):
            for a in re.finditer(r"""=\s*(["'])(.*?)\1""", tok, re.S):
                yield (m.start() + a.start(2), m.start() + a.end(2), "attr" + a.group(1))
        else:
            yield (m.start(), m.end(), "text")


def trim(src, a, b):
    """Shrink a segment to the stretch that holds Chinese, keeping surrounding whitespace and markup outside."""
    s = src[a:b]
    if not CJK.search(s):
        return None
    left = len(s) - len(s.lstrip())
    right = len(s.rstrip())
    return (a + left, a + right) if right > left else None


def collect(path):
    src = path.read_text(encoding="utf-8")
    gen = js_segments(src) if path.suffix == ".js" else html_segments(src)
    out = []
    for a, b, kind in gen:
        t = trim(src, a, b)
        if t:
            out.append((*t, kind))
    return src, out


def extract():
    table = {}
    for f in JS_FILES + HTML_FILES:
        src, segs = collect(ROOT / f)
        for a, b, _ in segs:
            table.setdefault(src[a:b], []).append(f)
    entries = [{"zh": k, "files": sorted(set(v))} for k, v in table.items()]
    (HERE / "zh-segments.json").write_text(json.dumps(entries, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(entries), "segments,", sum(len(HAN.findall(e["zh"])) for e in entries), "Han characters")


def build():
    en = {}
    for p in sorted(HERE.glob("en-*.json")):
        en.update(json.loads(p.read_text(encoding="utf-8")))
    missing = []
    (ROOT / "en").mkdir(exist_ok=True)
    for f in JS_FILES + HTML_FILES:
        src, segs = collect(ROOT / f)
        parts, last = [], 0
        for a, b, kind in segs:
            zh = src[a:b]
            if zh not in en:
                missing.append((f, zh))
                continue
            parts.append(src[last:a])
            parts.append(escape(en[zh], kind))
            last = b
        parts.append(src[last:])
        out = "".join(parts)
        for zh, t in NESTED.items():  # strings inside ${...} are not segments; swap them whole
            out = out.replace(zh, t)
        if f == "index.html":
            out = localise_html(out)
        (ROOT / "en" / f).write_text(out, encoding="utf-8")
    if missing:
        for f, zh in missing:
            print("MISSING", f, repr(zh[:80]))
        sys.exit(1)
    print("en/ built")


NESTED = {
    "' · 有导图和卡片'": "' · has a mind map and cards'",
    "'讨论草稿 · 未发布'": "'Discussion draft · unpublished'",
    "'私人笔记'": "'Private note'",
}


def escape(t, kind):
    """Keep the translation valid inside whatever holds it: a quoted string, a template, or HTML."""
    if kind in ("'", '"'):
        return re.sub(r"(?<!\\)" + re.escape(kind), "\\" + kind, t)
    if kind == "`":
        return re.sub(r"(?<!\\)`", "\\`", t).replace("${", "\\${")
    if kind.startswith("attr"):
        return t.replace(kind[4:], "&quot;" if kind[4:] == '"' else "&#39;")
    return t


def localise_html(s):
    """Point the English page at the shared files one level up, and set its language."""
    s = s.replace('<html lang="zh-CN">', '<html lang="en">', 1)
    s = re.sub(r'(href|src)="(assets/|theme\.css|styles\.css|motion\.js|comic-v3/|resume-method/)', r'\1="../\2', s)
    s = s.replace("url(assets/", "url(../assets/")
    s = s.replace('<a class="lang-link" href="en/" hreflang="en" lang="en"',
                  '<a class="lang-link" href="../" hreflang="zh-CN" lang="zh-CN"', 1)
    s = s.replace('location.hash">EN</a>', 'location.hash">中文</a>', 1)
    # The two-line title reads in the other order in English.
    s = s.replace('<span>From one question</span></span><span class="line"><span>Start<em',
                  '<span>It starts with</span></span><span class="line"><span>one question<em', 1)
    s = re.sub(r'(<link rel="stylesheet" href="\.\./styles\.css[^"]*">)', r'\1\n  <link rel="stylesheet" href="../en.css">', s, count=1)
    return s


if __name__ == "__main__":
    {"extract": extract, "build": build}[sys.argv[1]]()
