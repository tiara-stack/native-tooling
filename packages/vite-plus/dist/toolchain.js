export const toolchain = {
  "schemaVersion": 1,
  "nodes": [
    {
      "id": "@tiara-stack/vite-plus",
      "name": "@tiara-stack/vite-plus",
      "version": "1.0.0",
      "kind": "package",
      "delivery": [
        "dependency"
      ],
      "aliases": []
    },
    {
      "id": "vite-plus-core",
      "name": "@tiara-stack/vite-plus-core",
      "version": "1.0.0",
      "kind": "package",
      "delivery": [
        "dependency"
      ],
      "aliases": [
        "vite-plus-core"
      ]
    },
    {
      "id": "vite",
      "name": "vite",
      "version": "8.3.1",
      "kind": "tool",
      "delivery": [
        "bundled"
      ],
      "aliases": []
    },
    {
      "id": "rolldown",
      "name": "rolldown",
      "version": "1.2.11",
      "kind": "tool",
      "delivery": [
        "bundled",
        "compiled"
      ],
      "aliases": []
    },
    {
      "id": "vitest",
      "name": "vitest",
      "version": "5.0.1",
      "kind": "tool",
      "delivery": [
        "dependency"
      ],
      "aliases": []
    },
    {
      "id": "oxlint",
      "name": "oxlint",
      "version": "1.85.0",
      "kind": "tool",
      "delivery": [
        "dependency"
      ],
      "aliases": []
    },
    {
      "id": "oxfmt",
      "name": "oxfmt",
      "version": "0.70.0",
      "kind": "tool",
      "delivery": [
        "dependency"
      ],
      "aliases": []
    },
    {
      "id": "oxlint-tsgolint",
      "name": "oxlint-tsgolint",
      "version": "7.0.2003",
      "kind": "tool",
      "delivery": [
        "dependency"
      ],
      "aliases": [
        "tsgolint"
      ]
    },
    {
      "id": "tsdown",
      "name": "tsdown",
      "version": "0.23.0",
      "kind": "tool",
      "delivery": [
        "bundled"
      ],
      "aliases": []
    },
    {
      "id": "vite-task",
      "name": "vite-task",
      "revision": "7d69d6577ecf6bd83deee32186de59918a712873",
      "builtAt": "2026-10-30T18:13:58Z",
      "kind": "tool",
      "delivery": [
        "compiled"
      ],
      "aliases": []
    },
    {
      "id": "oxc",
      "name": "oxc",
      "version": "0.151.0",
      "kind": "engine",
      "delivery": [
        "compiled"
      ],
      "aliases": []
    },
    {
      "id": "oxc-resolver",
      "name": "oxc-resolver",
      "version": "11.24.3",
      "kind": "engine",
      "delivery": [
        "compiled"
      ],
      "aliases": []
    }
  ],
  "edges": [
    {
      "from": "@tiara-stack/vite-plus",
      "to": "vite-plus-core",
      "relationship": "depends-on"
    },
    {
      "from": "vite-plus-core",
      "to": "vite",
      "relationship": "bundles"
    },
    {
      "from": "vite",
      "to": "rolldown",
      "relationship": "uses"
    },
    {
      "from": "vite-plus-core",
      "to": "rolldown",
      "relationship": "bundles"
    },
    {
      "from": "rolldown",
      "to": "oxc",
      "relationship": "compiles"
    },
    {
      "from": "rolldown",
      "to": "oxc-resolver",
      "relationship": "compiles"
    },
    {
      "from": "vite-plus-core",
      "to": "tsdown",
      "relationship": "bundles"
    },
    {
      "from": "@tiara-stack/vite-plus",
      "to": "vitest",
      "relationship": "depends-on"
    },
    {
      "from": "@tiara-stack/vite-plus",
      "to": "oxlint",
      "relationship": "depends-on"
    },
    {
      "from": "@tiara-stack/vite-plus",
      "to": "oxlint-tsgolint",
      "relationship": "depends-on"
    },
    {
      "from": "@tiara-stack/vite-plus",
      "to": "oxfmt",
      "relationship": "depends-on"
    },
    {
      "from": "@tiara-stack/vite-plus",
      "to": "vite-task",
      "relationship": "compiles"
    }
  ]
};
export default toolchain;
