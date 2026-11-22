// The five characters drawn small: database, server, interface, tests,
// security. Shared by the hero's crew wherever they appear outside the hero.

function Eyes({ y }) {
  return (
    <g className="cw-eyes">
      {[-5, 5].map((dx) => (
        <g key={dx}>
          <ellipse className="hs-eye" cx={dx} cy={y} rx="3.3" ry="3.8" />
          <circle className="hs-pupil cw-pupil" cx={dx + 0.8} cy={y + 0.6} r="1.7" />
        </g>
      ))}
      <path className="cw-mouth" d={`M-3 ${y + 6} q3 3 6 0`} />
    </g>
  );
}

export function Body({ k }) {
  switch (k) {
    case 'db': return (<>
      <path className="hs-f" d="M-16 -40v25a16 5 0 0 0 32 0v-25z" />
      <path className="cw-band" d="M-16 -22a16 5 0 0 0 32 0" />
      <ellipse className="hs-l" cx="0" cy="-40" rx="16" ry="5" />
      <Eyes y={-31} />
    </>);
    case 'api': return (<>
      <path className="cw-thin" d="M0 -44v-8" />
      <circle className="hs-l" cx="0" cy="-54" r="3" />
      <rect className="hs-f" x="-15" y="-45" width="30" height="31" rx="8" />
      <Eyes y={-31} />
    </>);
    case 'ui': return (<>
      <circle className="hs-f" cx="0" cy="-29" r="16" />
      <path className="hs-l" d="M-13 -37a16 16 0 0 1 26 0q-13 -6 -26 0z" />
      <Eyes y={-30} />
    </>);
    case 'test': return (<>
      <ellipse className="hs-f" cx="0" cy="-29" rx="14" ry="16" />
      <rect className="cw-board" x="10" y="-30" width="10" height="13" rx="2" />
      <Eyes y={-32} />
    </>);
    default: return (<>
      <rect className="hs-f" x="-15" y="-45" width="30" height="31" rx="11" />
      <path className="cw-shield" d="M-17 -30l7 2.5v6.5c0 5-3.5 8-7 10c-3.5-2-7-5-7-10v-6.5z" />
      <Eyes y={-33} />
    </>);
  }
}
