const paths: Record<string, string> = {
  chevron: 'm6 9 6 6 6-6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  back15: 'M3 10a9 9 0 1 1 2 9M3 4v6h6',
  forward15: 'M21 10a9 9 0 1 0-2 9M21 4v6h-6',
  compass: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-3 5-5 3 3-5Z',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  music: 'M9 18V5l12-3v14M9 8l12-3M9 18a3 3 0 1 1-3-3h3M21 16a3 3 0 1 1-3-3h3',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
  plus: 'M12 5v14M5 12h14',
  heart: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 3 11 8 15 5-4 13-10 8-15Z',
  bookmark: 'M5 3h14v18l-7-5-7 5Z',
  studio: 'M4 4h16v16H4ZM8 9v6m4-8v10m4-6v2',
  chart: 'M4 3v18h17M8 17v-5m5 5V8m5 9V4',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  moon: 'M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z',
  play: 'm9 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
  next: 'm9 5 9 7-9 7M20 5v14',
  previous: 'm15 5-9 7 9 7M4 5v14',
  expand: 'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  share: 'M12 16V3m-4 4 4-4 4 4M5 12v8h14v-8',
  list: 'M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM8 12l3 3 5-6',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  settings: 'M3 6h18M3 18h18M8 3v6m8 6v6',
  qr: 'M3 3h6v6H3ZM15 3h6v6h-6ZM3 15h6v6H3ZM15 15h2v2h-2Zm4 4h2v2h-2Zm-4 0v2m6-6h-2',
  logout: 'M9 3H3v18h6m5-14 5 5-5 5m-7-5h12',
  menu: 'M3 6h18M3 12h18M3 18h18',
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.music} />
    </svg>
  );
}
