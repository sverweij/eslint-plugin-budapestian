/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* rules from the 'recommended' preset: */
    {
      name: "no-circular",
      severity: "warn",
      comment:
        "This dependency is part of a circular relationship. You might want to revise " +
        "your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-orphans",
      severity: "error",
      comment:
        "This is an orphan module - it's likely not used (anymore?). Either use it or remove it. If it's " +
        "logical this module is an orphan (i.e. it's a config file), add an exception for it in your " +
        "dependency-cruiser configuration.",
      from: {
        orphan: true,
        pathNot: "[.]d[.]ts$",
      },
      to: {},
    },
    {
      name: "no-unreachable-from-index",
      severity: "error",
      comment:
        "If there's one or more modules in the lib folder not accessible from the index, they're probably " +
        "'dead wood', which means they can be removed safely.",
      from: {
        path: "^lib/index[.]js$",
      },
      to: {
        path: "^lib",
        reachable: false,
      },
    },
    {
      name: "no-deprecated-core",
      comment:
        "A module depends on a node core module that has been deprecated. Find an alternative - these are " +
        "bound to exist - node doesn't deprecate lightly.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: "^(punycode|domain|constants|sys|_linklist|_stream_wrap)$",
      },
    },
    {
      name: "not-to-deprecated",
      comment:
        "This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later " +
        "version of that module, or find an alternative. Deprecated modules are a security risk.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
        "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
        "available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
        "in your package.json.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-unresolvable",
      comment:
        "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
        "module: add it to your package.json. In all other cases you likely already know what to do.",
      severity: "error",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: "no-duplicate-dep-types",
      comment:
        "Likley this module depends on an external ('npm') package that occurs more than once " +
        "in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
        "maintenance problems later on.",
      severity: "warn",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        pathNot: "eslint",
      },
    },

    /* rules you might want to tweak for your specific situation: */
    {
      name: "not-to-test",
      comment:
        "This module depends on code within a folder that should only contain test. As test don't " +
        "implement functionality this is odd. Either you're writing a test outside the folder " +
        "or there's something in the test folder that isn't a test.",
      severity: "error",
      from: {
        pathNot: "^test",
      },
      to: {
        path: "^test",
      },
    },
    {
      name: "not-to-spec",
      comment:
        "This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. " +
        "If there's something in a spec that's of use to other modules, it doesn't have that single " +
        "responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.",
      severity: "error",
      from: {},
      to: {
        path: "[.]spec[.]js$",
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "This module depends on an npm package from the 'devDependencies' section of your " +
        "package.json. It looks like something that ships to production, though. To prevent problems " +
        "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
        "section of your package.json. If this module is development only - add it to the " +
        "from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration",
      from: {
        path: "^(lib)",
        pathNot: "[.]spec[.]js$",
      },
      to: {
        dependencyTypes: ["npm-dev"],
      },
    },
    {
      name: "optional-deps-used",
      severity: "info",
      comment:
        "This module depends on an npm package that is declared as an optional dependency " +
        "in your package.json. As this makes sense in limited situations only, it's flagged here. " +
        "If you're using an optional dependency here by design - add an exception to your" +
        "dependency-cruiser configuration.",
      from: {},
      to: {
        dependencyTypes: ["npm-optional"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },

    enhancedResolveOptions: {
      extensions: [".js", ".mjs"],
    },
    moduleSystems: ["cjs", "es6"],

    prefix: "https://github.com/sverweij/eslint-plugin-budapestian/blob/main/",

    enhancedResolveOptions: {
      exportsFields: ["exports"],
      aliasFields: ["browser"],
      conditionNames: ["import", "require"],
      extensions: [
        ".cjs",
        ".mjs",
        ".js",
        // ".jsx",
        // ".ts",
        // ".cts",
        // ".mts",
        // ".tsx",
        ".d.ts",
        // ".d.cts",
        ".d.mts",
        // ".coffee",
        // ".litcoffee",
        // "cofee.md",
        // ".csx",
        // ".cjsx",
        // ".vue",
        // ".svelte"
      ],
    },

    combinedDependencies: true,
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",

        theme: {
          graph: {
            /* use splines: 'ortho' for straight lines. Be aware though
              graphviz might take a long time calculating ortho(gonal)
              routings.
           */
            splines: "ortho",
          },
        },
      },
      archi: {
        collapsePattern: "^(node_modules|packages|src|lib|app|test|spec)/[^/]+",
      },
    },
  },
};
// generated: dependency-cruiser@8.0.0 on 2020-03-07T16:09:16.338Z
