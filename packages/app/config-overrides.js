const { override, addExternalBabelPlugin } = require('customize-cra');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// https://medium.com/@NiGhTTraX/making-typescript-monorepos-play-nice-with-other-tools-a8d197fdc680
const addPathsPlugin = (config) => {
    // Remove the ModuleScopePlugin which throws when we try
    // to import something outside of src/.
    config.resolve.plugins.pop();

    // Resolve the path aliases.
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    // Let Babel compile outside of src/.
    const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
    const tsRule = oneOfRule.oneOf.find((rule) =>
        rule.test.toString().includes("ts|tsx")
    );
    tsRule.include = undefined;
    tsRule.exclude = /node_modules/;

    return config;
};

const addFallbackOverride = (config) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "url": require.resolve("url/"),
    }
    return config;
}

module.exports = override(
    addPathsPlugin,
    addExternalBabelPlugin('@babel/plugin-syntax-import-assertions'),
    addFallbackOverride,
)