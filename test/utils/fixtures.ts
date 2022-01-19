export const EDITOR_VERSION = '1.0.72'

export const EXERCISE_SLUG = 'hello-world'

export const CONFIG_SAMPLE = {
  port: 3000,
  address: 'http://localhost',
  editor: {
    mode: 'standalone',
    agent: null,
    version: EDITOR_VERSION,
  },
  dirPath: './.learn',
  configPath: './learn.json',
  outputPath: './.learn/dist',
  publicPath: '/preview',
  publicUrl: null,
  language: 'auto',
  grading: 'incremental',
  exercisesPath: './exercises',
  exercises: [
    {
      slug: EXERCISE_SLUG,
      path: `exercises/${EXERCISE_SLUG}`,
      entry: null,
      title: 'hello-world',
      graded: false,
      files: [
        {
          path: `exercises/${EXERCISE_SLUG}/README.md`,
          name: 'README.md',
          hidden: true,
        },
      ],
    },
  ],
  webpackTemplate: null,
  disableGrading: false,
  disabledActions: [],
  actions: [],
  entries: {
    html: 'index.html',
    vanillajs: 'index.js',
    react: 'app.jsx',
    node: 'app.js',
    python3: 'app.py',
    java: 'app.java',
  },
  difficulty: 'beginner',
  duration: 1,
  description: '',
  title: 'My Interactive Tutorial',
  slug: 'my-interactive-tutorial',
}
