/**
 * What a terminal would show after printing a recording, as lines of text: the model the
 * build log viewer renders.
 *
 * The build server's recordings are a log, not a screen: output only, from scripts run
 * without a terminal, so they hold no cursor addressing - what they do hold is thousands
 * of carriage returns from curl, gradle and podman redrawing a progress line. So this is
 * a line buffer, not a grid: `\n` starts a line, `\r` goes back to its start so the next
 * text overwrites it, `\b` steps back one, `ESC[K` erases the rest of the line, and the
 * SGR colours and bold are kept as a style per character. Every other escape is dropped.
 *
 * A recording that does address the cursor - an interactive program - would come out
 * scrambled, so the sequences that move it between lines set `cursorMoved` and the viewer
 * says so. Moving along the current line (`ESC[nC`, `ESC[nD`, `ESC[nG`) is harmless and is
 * followed.
 *
 * Output arrives in chunks that can cut an escape sequence in two, so the parse is a state
 * machine that lives across calls to `feed`.
 *
 * A port of the Android app's TerminalLines (ui/log/TerminalLines.kt).
 */

/** Style bit for bold; the low bits are the colour index. */
export const BOLD = 0x20;
/** Mask of the colour index: 0 the terminal's default, 1-8 the normal colours, 9-16 the bright ones. */
export const COLOUR = 0x1f;

const TAB = 8;
const MAX_COLUMN = 4096;

const STATE_TEXT = 0;
const STATE_ESC = 1;
const STATE_CSI = 2;
const STATE_OSC = 3;
const STATE_OSC_ESC = 4;
const STATE_SKIP_ONE = 5;

/** One line: its characters and the style of each. */
export class TerminalLine {
  constructor() {
    /** @type {string[]} one entry per character */
    this.chars = [];
    /** @type {number[]} the style of each character */
    this.styles = [];
  }

  get length() {
    return this.chars.length;
  }

  styleAt(index) {
    return this.styles[index] ?? 0;
  }

  put(column, c, style) {
    while (this.chars.length < column) {
      this.chars.push(' ');
      this.styles.push(0);
    }
    if (column < this.chars.length) {
      this.chars[column] = c;
      this.styles[column] = style;
    } else {
      this.chars.push(c);
      this.styles.push(style);
    }
  }

  truncate(column) {
    if (column < this.chars.length) {
      this.chars.length = column;
      this.styles.length = column;
    }
  }

  /** Blanks `from` up to `to`, as `ESC[1K` does, without moving the end of the line. */
  blank(from, to) {
    const end = Math.min(to, this.chars.length);
    for (let i = from; i < end; i++) {
      this.chars[i] = ' ';
      this.styles[i] = 0;
    }
  }

  /** True when any character has a colour or bold; most lines of a build log have none. */
  get isStyled() {
    return this.styles.some(style => style !== 0);
  }

  toString() {
    return this.chars.join('');
  }
}

export class TerminalLines {
  constructor() {
    /** @type {TerminalLine[]} */
    this.lines = [new TerminalLine()];
    /** True once a sequence moved the cursor to another line, which this model cannot follow. */
    this.cursorMoved = false;
    this.column = 0;
    this.style = 0;
    this.state = STATE_TEXT;
    this.params = '';
  }

  get current() {
    return this.lines[this.lines.length - 1];
  }

  /** @param {string} text a chunk of terminal output */
  feed(text) {
    for (const c of text) {
      switch (this.state) {
        case STATE_TEXT:
          this.text(c);
          break;
        case STATE_ESC:
          this.escape(c);
          break;
        case STATE_CSI:
          this.csi(c);
          break;
        case STATE_OSC:
          if (c === '\u0007') {
            this.state = STATE_TEXT;
          } else if (c === '\u001b') {
            this.state = STATE_OSC_ESC;
          }
          break;
        case STATE_OSC_ESC:
          this.state = c === '\\' ? STATE_TEXT : STATE_OSC;
          break;
        default:
          this.state = STATE_TEXT;
      }
    }
  }

  text(c) {
    switch (c) {
      case '\n':
        this.lines.push(new TerminalLine());
        this.column = 0;
        break;
      case '\r':
        this.column = 0;
        break;
      case '\b':
        if (this.column > 0) {
          this.column--;
        }
        break;
      case '\t': {
        const next = (Math.floor(this.column / TAB) + 1) * TAB;
        while (this.column < next) {
          this.current.put(this.column++, ' ', this.style);
        }
        break;
      }
      case '\u001b':
        this.state = STATE_ESC;
        this.params = '';
        break;
      default:
        if (c >= ' ' && c !== '\u007f') {
          this.current.put(this.column++, c, this.style);
        }
    }
  }

  escape(c) {
    switch (c) {
      case '[':
        this.state = STATE_CSI;
        break;
      case ']':
      case 'P':
      case '^':
      case '_':
        this.state = STATE_OSC;
        break;
      case '(':
      case ')':
      case '*':
      case '+':
      case '#':
        this.state = STATE_SKIP_ONE;
        break;
      default:
        this.state = STATE_TEXT;
    }
  }

  csi(c) {
    if ((c >= '0' && c <= '?') || (c >= ' ' && c <= '/')) {
      this.params += c;
      return;
    }
    this.state = STATE_TEXT;
    if (c < '@' || c > '~') {
      return;
    }
    const numbers = this.params.split(';').map((part) => {
      const digits = part.replace(/\D/g, '');
      return digits === '' ? null : Number.parseInt(digits, 10);
    });
    const first = numbers[0];
    const line = this.current;
    switch (c) {
      case 'm':
        this.sgr(numbers);
        break;
      case 'K':
        switch (first ?? 0) {
          case 0:
            line.truncate(this.column);
            break;
          case 1:
            line.blank(0, this.column + 1);
            break;
          case 2:
            line.truncate(0);
            break;
          default:
        }
        break;
      case 'J':
        if ((first ?? 0) === 0) {
          line.truncate(this.column);
        }
        break;
      // Moves along the line are followed, but not past MAX_COLUMN: a forward move pads
      // the line with spaces, and a file can ask for any number.
      case 'C':
        this.column = Math.min(this.column + Math.max(first ?? 1, 1), MAX_COLUMN);
        break;
      case 'D':
        this.column = Math.max(this.column - Math.max(first ?? 1, 1), 0);
        break;
      case 'G':
        this.column = Math.min(Math.max((first ?? 1) - 1, 0), MAX_COLUMN);
        break;
      case 'A': case 'B': case 'E': case 'F': case 'H': case 'f':
      case 'd': case 'S': case 'T': case 'L': case 'M': case 's': case 'u':
        this.cursorMoved = true;
        break;
      default:
    }
  }

  sgr(numbers) {
    if (numbers.every(n => n === null)) {
      this.style = 0;
      return;
    }
    for (let i = 0; i < numbers.length; i++) {
      const n = numbers[i] ?? 0;
      if (n === 0) {
        this.style = 0;
      } else if (n === 1) {
        this.style |= BOLD;
      } else if (n === 22) {
        this.style &= ~BOLD;
      } else if (n === 39) {
        this.style &= BOLD;
      } else if (n >= 30 && n <= 37) {
        this.style = (this.style & BOLD) | (n - 29);
      } else if (n >= 90 && n <= 97) {
        this.style = (this.style & BOLD) | (n - 81);
      } else if (n === 38 || n === 48) {
        // Extended colours (256 and truecolour) are not kept, but their arguments must
        // be stepped over: "38;5;208" is one colour, not three.
        if (n === 38) {
          this.style &= BOLD;
        }
        const kind = numbers[i + 1];
        i += kind === 5 ? 2 : kind === 2 ? 4 : 0;
      }
    }
  }
}

/**
 * A line as DOM for the viewer: a plain text node when it is in the terminal's default
 * style, otherwise one span per run of the same style, with classes for the colour
 * (`ws-log-c1` to `ws-log-c16`) and bold (`ws-log-b`).
 *
 * @param {TerminalLine} line
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderTerminalLine(line, doc = document) {
  const element = doc.createElement('div');
  element.className = 'build-log-line';
  const text = line.toString();
  if (!line.isStyled) {
    element.textContent = text;
    return element;
  }
  let start = 0;
  while (start < text.length) {
    const style = line.styleAt(start);
    let end = start + 1;
    while (end < text.length && line.styleAt(end) === style) {
      end++;
    }
    const run = text.slice(start, end);
    if (style === 0) {
      element.appendChild(doc.createTextNode(run));
    } else {
      const span = doc.createElement('span');
      const classes = [];
      const colour = style & COLOUR;
      if (colour !== 0) {
        classes.push(`ws-log-c${colour}`);
      }
      if (style & BOLD) {
        classes.push('ws-log-b');
      }
      span.className = classes.join(' ');
      span.textContent = run;
      element.appendChild(span);
    }
    start = end;
  }
  return element;
}
