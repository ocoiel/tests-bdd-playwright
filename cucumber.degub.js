module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["src/support/*.ts", "src/steps/*.ts"],
    format: ["progress-bar"],
    formatOptions: { snippetInterface: "async-await" },
    publishQuiet: true,
    parallel: 1,
    retry: 0,
    worldParameters: {
      debug: true,
      timeout: 300000,
    },
  },
};
