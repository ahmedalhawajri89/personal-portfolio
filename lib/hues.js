// The identity's five hues (globals.css): the data, the server, the
// interface, the tests, security. Each project wears one, and so does each
// service and each group of tools, so a colour keeps one meaning per row.
export const HUE = { diwan: 'var(--h-sec)', booking: 'var(--h-ui)', takharruj: 'var(--h-api)', lamma: 'var(--h-db)', mawaheb: 'var(--h-test)' };

// The same hues as plain colours, for the stage light (components/Scenes.jsx),
// which eases between them and so needs values it can interpolate.
export const LIGHT = { db: '#2FD3A1', api: '#9B8CFF', ui: '#4FB4FF', test: '#B6F25A', sec: '#FFB547', accent: '#FF5A1F' };
export const PROJECT_LIGHT = { diwan: LIGHT.sec, booking: LIGHT.ui, takharruj: LIGHT.api, lamma: LIGHT.db, mawaheb: LIGHT.test };
