import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

console.log(process.env.NODE_ENV);

const devMode = process.env.NODE_ENV === "development";

const sharedPlugins = devMode
  ? [typescript()]
  : [
      typescript(),
      terser({
        ecma: 2020,
        mangle: { toplevel: true },
        compress: {
          module: true,
          toplevel: true,
          unsafe_arrows: true,
          drop_console: !devMode,
          drop_debugger: !devMode,
        },
        output: { quote_style: 1 },
      }),
    ];

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "wyrd",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      ...sharedPlugins,
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    external: ["ms"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [...sharedPlugins],
  },
];
