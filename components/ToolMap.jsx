'use client';

import { useState } from 'react';

// The tools as one map: a column for each project, in its colour, and a row
// for each tool, grouped the way the work divides. A dot is a tool the
// project really uses. Pointing at a project lights its column -- what that
// one was built with -- and pointing at a tool lights its row -- where it was
// used; the keyboard does the same on focus.
export default function ToolMap({ projects, groups, label, notUsed }) {
  const [col, setCol] = useState(-1);
  const [row, setRow] = useState('');
  const off = () => { setCol(-1); setRow(''); };
  return (
    <div className="tm-wrap">
      <table className={`tm${col >= 0 ? ' has-col' : ''}${row ? ' has-row' : ''}`} data-m="matrix" onMouseLeave={off}>
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <td className="tm-corner" />
            {projects.map((p, n) => (
              <th key={p.slug} scope="col" className={col === n ? 'is-col' : ''} style={{ '--p': p.hue }}>
                <a href={p.href} onMouseEnter={() => { setRow(''); setCol(n); }} onFocus={() => { setRow(''); setCol(n); }} onBlur={off}>
                  <i aria-hidden="true" /><span>{p.name}</span>
                </a>
              </th>
            ))}
            <td className="tm-corner" />
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.key} style={{ '--c': g.hue }}>
            <tr className="tm-g">
              <th scope="colgroup" colSpan={projects.length + 2}>
                <span className="tm-gh">{g.h}</span>
                <span className="tm-gb">{g.b}</span>
              </th>
            </tr>
            {g.tools.map((tl) => {
              const n = tl.used.filter(Boolean).length;
              return (
                <tr key={tl.label} className={`tm-r${row === tl.label ? ' is-row' : ''}`}
                    onMouseEnter={() => { setCol(-1); setRow(tl.label); }}>
                  <th scope="row" className="lat">{tl.label}</th>
                  {tl.used.map((u, k) => (
                    <td key={projects[k].slug} className={`${u ? 'on' : ''}${col === k ? ' is-col' : ''}`} style={{ '--p': projects[k].hue }}>
                      <i aria-hidden="true" /><span className="sr-only">{u ? projects[k].name : notUsed}</span>
                    </td>
                  ))}
                  <td className="tm-n lat" aria-hidden="true"><b style={{ '--k': n / projects.length }}>{n}</b>/{projects.length}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
