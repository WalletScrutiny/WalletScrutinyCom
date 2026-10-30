// node --test reporter: a dot per test, then only the failures in full,
// then the totals. The spec reporter lists every passing test. Console
// output is printed only for files that had a failure, since a file that
// fails to load reports nothing but its stderr.
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inspect } from 'node:util'

function where (data) {
  if (!data.file) return 'unknown file'
  const file = data.file.startsWith('file:') ? fileURLToPath(data.file) : data.file
  const path = relative(process.cwd(), file)
  return data.line ? `${path}:${data.line}` : path
}

export default async function * summaryReporter (source) {
  const failures = []
  const totals = []
  const output = new Map()
  let count = 0
  for await (const { type, data } of source) {
    if (type === 'test:pass' || type === 'test:fail') {
      // A suite fails whenever one of its tests does; report only the test.
      if (data.details?.type === 'suite') continue
      if (type === 'test:fail') failures.push(data)
      yield (type === 'test:fail' ? 'X' : '.') + (++count % 80 === 0 ? '\n' : '')
    } else if (type === 'test:stdout' || type === 'test:stderr') {
      // stdout/stderr events give the file relative, test events absolute.
      const file = where({ file: data.file })
      if (!output.has(file)) output.set(file, [])
      output.get(file).push(data.message)
    } else if (type === 'test:diagnostic' && data.nesting === 0) {
      totals.push(data.message)
    }
  }
  yield '\n'
  for (const f of failures) {
    yield `\n✖ ${f.name}  (${where(f)})\n`
    yield inspect(f.details.error?.cause ?? f.details.error).replace(/^/gm, '    ') + '\n'
  }
  for (const file of new Set(failures.map(f => where({ file: f.file })))) {
    if (!output.has(file)) continue
    yield `\nOutput of ${file}:\n` + output.get(file).join('').replace(/^/gm, '    ').trimEnd() + '\n'
  }
  yield '\n' + totals.join('  ·  ') + '\n'
}
