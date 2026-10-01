type PostCssConfig = {
  plugins: Record<string, Record<string, unknown>>;
};

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
} satisfies PostCssConfig;

export default config;
