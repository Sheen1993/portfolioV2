/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  future: {
    // `hover:` only emits inside (hover: hover) and (pointer: fine), so touch
    // devices never get sticky hover states. Touch feedback uses `active:`.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        ink: '#141210',
        ink2: '#1c1916',
        line: '#2d2924',
        paper: '#ece6da',
        mute: '#8f887c',
        // Signal orange: the colour of a "now serving" LED and a failing build
        // light. Used only for state: active chapter, highlighted terms, focus.
        signal: '#ff5a1f',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        frame: '1600px',
      },
    },
  },
  plugins: [],
}
