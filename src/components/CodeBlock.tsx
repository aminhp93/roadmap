interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

// Token types and their Tailwind colours
type TokenType =
  | "keyword"
  | "type"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

const TS_KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "function",
  "async",
  "await",
  "return",
  "if",
  "else",
  "throw",
  "new",
  "class",
  "interface",
  "type",
  "extends",
  "implements",
  "try",
  "catch",
  "for",
  "of",
  "in",
  "default",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "Promise",
  "switch",
  "case",
  "break",
  "continue",
  "while",
  "do",
  "static",
  "public",
  "private",
  "protected",
  "readonly",
  "as",
  "typeof",
  "instanceof",
]);

const TS_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "any",
  "unknown",
  "never",
  "Record",
  "Array",
  "Set",
  "Map",
  "Error",
  "Date",
  "RegExp",
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Single-line comment
    if (line[i] === "/" && line[i + 1] === "/") {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }
    // Hash comment (yaml/dockerfile)
    if (line[i] === "#") {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }
    // String (single or double or backtick)
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "\\" && j + 1 < line.length) {
          j += 2;
          continue;
        }
        if (line[j] === q) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: "string", value: line.slice(i, j) });
      i = j;
      continue;
    }
    // Word / identifier
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let type: TokenType = "plain";
      if (TS_KEYWORDS.has(word)) type = "keyword";
      else if (TS_TYPES.has(word)) type = "type";
      // function call heuristic
      else if (j < line.length && line[j] === "(") type = "function";
      tokens.push({ type, value: word });
      i = j;
      continue;
    }
    // Number
    if (/[0-9]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\d._]/.test(line[j])) j++;
      tokens.push({ type: "number", value: line.slice(i, j) });
      i = j;
      continue;
    }
    // Plain char
    tokens.push({ type: "plain", value: line[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "text-purple-400",
  type: "text-cyan-400",
  string: "text-amber-300",
  comment: "text-gray-500 italic",
  number: "text-emerald-400",
  function: "text-blue-300",
  plain: "text-gray-300",
};

export function CodeBlock({ code, language = "ts", filename }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700/60 text-xs font-mono">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 border-b border-gray-700/60">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        </div>
        {filename && (
          <span className="text-gray-400 text-xs ml-1">{filename}</span>
        )}
        <span className="ml-auto text-gray-600 text-xs">{language}</span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto bg-gray-950/80 p-3 leading-5">
        {lines.map((line, li) => (
          <div key={li} className="flex">
            <span className="select-none text-gray-700 w-6 flex-shrink-0 text-right mr-3">
              {li + 1}
            </span>
            <span>
              {tokenizeLine(line).map((tok, ti) => (
                <span key={ti} className={TOKEN_COLORS[tok.type]}>
                  {tok.value}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
