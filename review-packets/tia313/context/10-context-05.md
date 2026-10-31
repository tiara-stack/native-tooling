# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/_tools/oxlint-configuration-base-schema.json`

Mode `100644`, blob `a9560600573b08cfab146c21c0145dbd60a06059`, SHA256 `c81fc542b3cfa0caa0be61dcea847cac35a440301a72643bf54c64b4785b1e45`, 762467 bytes.

Dependency role: Parsed stock Oxlint base schema: plugin enum has15 built-in plugins and excludes effecttsgo; DummyRuleMap has only generic stock rule properties and no effecttsgo/* keys. The generated package schema adds the Effect-specific plugin/rule surface on top of this base.

Extracted current JSON subtrees relevant to plugin/rule integration. Descriptions and examples are omitted; structural keys and values are preserved. Internal116 schema support is separate from the public82 marker bridge.

```json
{
  "properties": {
    "plugins": {
      "default": null,
      "allOf": [
        {
          "$ref": "#/definitions/LintPlugins"
        }
      ]
    },
    "rules": {
      "default": {},
      "allOf": [
        {
          "$ref": "#/definitions/OxlintRules"
        }
      ]
    },
    "overrides": {
      "allOf": [
        {
          "$ref": "#/definitions/OxlintOverrides"
        }
      ]
    }
  },
  "plugin_definitions": {
    "LintPluginOptionsSchema": {
      "type": "string",
      "enum": [
        "eslint",
        "react",
        "unicorn",
        "typescript",
        "oxc",
        "import",
        "jsdoc",
        "jest",
        "vitest",
        "jsx-a11y",
        "nextjs",
        "react-perf",
        "promise",
        "node",
        "vue"
      ]
    },
    "LintPlugins": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/definitions/LintPluginOptionsSchema"
          }
        ]
      }
    }
  },
  "effect_rule_property_names": []
}
```

### `native/effect-tsgo/_tools/repoctl/tsconfig.json`

Mode `100644`, blob `cdb3520b71ae3b6ea01a5619926015de25213222`, SHA256 `123f11bfb12fe91f89a6023cae2e1c84df02dbcea9bfadfcf0ac955883e9fdcb`, 341 bytes.

Dependency role: Read tsconfig compilerOptions/plugins/files keys: {'allowImportingTsExtensions': True, 'erasableSyntaxOnly': True, 'module': 'NodeNext', 'moduleResolution': 'NodeNext', 'noEmit': True, 'skipLibCheck': True, 'strict': True, 'target': 'ES2022', 'types': ['node'], 'verbatimModuleSyntax': True}; checked plugin-enabled vs plugin-free fixture boundary and included file set.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022",
    "types": ["node"],
    "verbatimModuleSyntax": true
  },
  "include": ["src", "test"]
}
```

### `native/effect-tsgo/_tools/tsconfig-base-schema.json`

Mode `100644`, blob `813bbff16b5f97ed0683daaa7c7d687111924398`, SHA256 `a319eacd99551638459c2f939178dd0744c81f7b4ffe7fc47a0d9fd700cf81a6`, 469992 bytes.

Dependency role: Parsed the stock TSConfig base compilerOptions.plugins schema: plugins are null or an array of generic objects with a string name; it contains no @effect/language-service name constant, Effect options, or Effect rule keys. This is the base template consumed by schema generation.

Extracted current JSON subtrees for compilerOptions.plugins and Effect plugin options. Generic TS options remain the stock template; derived Effect state is not a direct user option. Descriptive strings are omitted; validation structure remains.

```json
{
  "compilerOptions_plugin_nodes": [
    {
      "json_pointer": "/properties/compilerOptions/anyOf/0/properties/plugins",
      "value": {
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                }
              }
            }
          },
          {
            "type": "null"
          }
        ],
        "x-intellij-html-description": "<p>List of language service plugins to run inside the editor.</p>\n<p>Language service plugins are a way to provide additional information to a user based on existing TypeScript files. They can enhance existing messages between TypeScript and an editor, or to provide their own error messages.</p>\n<p>For example:</p>\n<ul>\n<li><a href=\"https://github.com/xialvjun/ts-sql-plugin#readme\">ts-sql-plugin</a> &mdash; Adds SQL linting with a template strings SQL builder.</li>\n<li><a href=\"https://github.com/Microsoft/typescript-styled-plugin\">typescript-styled-plugin</a> &mdash; Provides CSS linting inside template strings .</li>\n<li><a href=\"https://github.com/Quramy/typescript-eslint-language-service\">typescript-eslint-language-service</a> &mdash; Provides eslint error messaging and fix-its inside the compiler&#39;s output.</li>\n<li><a href=\"https://github.com/Quramy/ts-graphql-plugin\">ts-graphql-plugin</a> &mdash; Provides validation and auto-completion inside GraphQL query template strings.</li>\n</ul>\n<p>VS Code has the ability for a extension to <a href=\"https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins\">automatically include language service plugins</a>, and so you may have some running in your editor without needing to define them in your <code>tsconfig.json</code>.</p>\n"
      }
    }
  ],
  "effect_definitions": {}
}
```

### `native/effect-tsgo/etscore/go.mod`

Mode `100644`, blob `f50248bd42d765b4c1329f96277cf5fca0bad6a5`, SHA256 `ee50fb56ef334befaaf69e17297647a70cb53a2a73ffbd262db08952e39a17cd`, 123 bytes.

Dependency role: Inspected module identity and dependency/replacement boundary against selected provider/compiler modules and local consumer graph.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

Source block 4 representation: `literal-and-json-source-lines-v1`; original language `text`. Decode lines prefixed `@@json-source-line: ` as JSON strings, including their exact line endings. Keep all other lines literal, concatenate in order and review the recovered source.

```text
@@json-source-line: "module github.com/effect-ts/tsgo/etscore\r\n"
@@json-source-line: "\r\n"
@@json-source-line: "go 1.26\r\n"
@@json-source-line: "\r\n"
require github.com/microsoft/TypeScript/tsc/shim/collections v0.0.0
```

### `native/effect-tsgo/etsdiagnostics/testdata/native-diagnostics/tsconfig.json`

Mode `100644`, blob `931453585b96cacb60265d976ca76ed63d6eb9db`, SHA256 `922919ecb5d69e6a9d11199efac6d869e5acd87f2a91408bc38ce1f8c398ed07`, 241 bytes.

Dependency role: Read tsconfig compilerOptions/plugins/files keys: {'skipLibCheck': True, 'plugins': [{'name': '@effect/language-service', 'diagnosticSeverity': {'asyncFunction': 'error'}}]}; checked plugin-enabled vs plugin-free fixture boundary and included file set.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "compilerOptions": {
    "skipLibCheck": true,
    "plugins": [
      {
        "name": "@effect/language-service",
        "diagnosticSeverity": {
          "asyncFunction": "error"
        }
      }
    ]
  },
  "files": ["main.ts"]
}
```

### `native/effect-tsgo/etsdiagnostics/testdata/without-plugin/tsconfig.json`

Mode `100644`, blob `83b4779e08a63394b7e449ef237e334a13a38862`, SHA256 `9223c3d942c6caec2b7db1a3dd944b93788c82d04dbee32a1e8ca6e105ace2a3`, 80 bytes.

Dependency role: Read tsconfig compilerOptions/plugins/files keys: {'skipLibCheck': True}; checked plugin-enabled vs plugin-free fixture boundary and included file set.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "compilerOptions": {
    "skipLibCheck": true
  },
  "files": ["main.ts"]
}
```

### `native/effect-tsgo/flake.lock`

Mode `100644`, blob `08d5298cf74721f1f06179b07da83429aaf6283c`, SHA256 `b213f25185be984470444dbe4b48103f4c154fbc77c261829e3ad3e606b59188`, 1605 bytes.

Dependency role: Parsed full flake lock graph: nodes=['nixpkgs', 'nixpkgsUnstable', 'root', 'typescript-src']; locked revisions/hashes correspond to the pinned Nix source references inspected in flake.nix.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "nodes": {
    "nixpkgs": {
      "locked": {
        "lastModified": 1767313136,
        "narHash": "sha256-16KkgfdYqjaeRGBaYsNrhPRRENs0qzkQVUooNHtoy2w=",
        "owner": "NixOS",
        "repo": "nixpkgs",
        "rev": "ac62194c3917d5f474c1a844b6fd6da2db95077d",
        "type": "github"
      },
      "original": {
        "owner": "NixOS",
        "ref": "nixos-25.05",
        "repo": "nixpkgs",
        "type": "github"
      }
    },
    "nixpkgsUnstable": {
      "locked": {
        "lastModified": 1789921291,
        "narHash": "sha256-Ft/BRnIqw1MywFoXydKobjjWmDFgDdYtSpJliE8+yUw=",
        "owner": "NixOS",
        "repo": "nixpkgs",
        "rev": "44a91898084f46797b5fac650c7e8c9ac38c43d4",
        "type": "github"
      },
      "original": {
        "owner": "NixOS",
        "ref": "nixos-unstable",
        "repo": "nixpkgs",
        "type": "github"
      }
    },
    "root": {
      "inputs": {
        "nixpkgs": "nixpkgs",
        "nixpkgsUnstable": "nixpkgsUnstable",
        "typescript-src": "typescript-src"
      }
    },
    "typescript-src": {
      "flake": false,
      "locked": {
        "lastModified": 1790208036,
        "narHash": "sha256-KxY5JoLtDCfJDW5ysINUER8HOECk2aNedrK+w5yzMFs=",
        "owner": "microsoft",
        "repo": "TypeScript",
        "rev": "df1a31e6d5c4aa4485f276fdfb4218a7bfcdf348",
        "type": "github"
      },
      "original": {
        "owner": "microsoft",
        "repo": "TypeScript",
        "rev": "df1a31e6d5c4aa4485f276fdfb4218a7bfcdf348",
        "type": "github"
      }
    }
  },
  "root": "root",
  "version": 7
}
```

### `native/effect-tsgo/flake.nix`

Mode `100644`, blob `8c06ee39f13b7fabf3e1b0a77fa1a43ae6d611b2`, SHA256 `3480f5417e065b333ae22e8219fc5f66a2842cb96f371332a719a2a4261b8353`, 6254 bytes.

Dependency role: Read full flake package derivation: pinned nixpkgs/nixpkgs-unstable and TypeScript source input, Go 1.27 override, source filtering and patch ordering, generated diagnostics build step, declared supported systems and package/app outputs.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  description = "Self-contained Effect Language Service (TypeScript-Go)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    nixpkgsUnstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    /* Source of truth: the next profile in `_packages/tsgo/upstream.json`. */
    typescript-src = {
      url = "github:microsoft/TypeScript/df1a31e6d5c4aa4485f276fdfb4218a7bfcdf348";
      flake = false;
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgsUnstable,
      typescript-src,
    }:
    let
      lib = nixpkgs.lib;
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      /*
       Go module vendor hash for buildGoModule (proxyVendor mode).
       proxyVendor is required because this project has deps with
       mixed-case module paths (Microsoft/go-winio vs microsoft/
       TypeScript/tsc) — `go work vendor` produces different directory
       layouts on case-sensitive (Linux) vs case-insensitive (macOS)
       filesystems. The download cache uses `!` escaping for uppercase
       letters, making it deterministic across both.

       Refresh: pnpm exec repoctl flake update
       Manual:  set to lib.fakeHash, build, copy the reported hash.
      */
      vendorHash = "sha256-2Uj8bkfazW5ydzg6yFtkBW/7BneU45RGsQ1D/s4UjcE=";
      forAllSystems =
        f: lib.genAttrs supportedSystems (system: f system (import nixpkgs { inherit system; }));
    in
    {
      packages = forAllSystems (
        system: pkgs:
        let
          root = toString ./.;
          pkgsUnstable = import nixpkgsUnstable { inherit system; };
          patchEntries = builtins.readDir ./_patches/typescript;
          patchFiles = builtins.filter (
            name: patchEntries.${name} == "regular" && lib.hasSuffix ".patch" name
          ) (builtins.attrNames patchEntries);
          sortedPatchFiles = builtins.sort builtins.lessThan patchFiles;
          rootSrc = lib.cleanSourceWith {
            src = ./.;
            filter =
              path: type:
              let
                pathString = toString path;
                relPath = if pathString == root then "" else lib.removePrefix "${root}/" pathString;
                topLevel = if relPath == "" then "" else builtins.head (lib.splitString "/" relPath);
              in
              lib.cleanSourceFilter path type
              && !builtins.elem topLevel [
                ".direnv"
                ".git"
                ".repos"
                "build"
                "built"
                "coverage"
                "node_modules"
                "tmp"
                "typescript"
                "typescript-go"
              ];
          };
          patchedTypeScript = pkgs.applyPatches {
            name = "patched-typescript-source";
            src = typescript-src;
            patches = builtins.map (name: ./. + "/_patches/typescript/${name}") sortedPatchFiles;
          };
          src = pkgs.runCommandNoCC "effect-tsgo-source" { } ''
            mkdir source
            cp -R ${rootSrc}/. source/
            chmod -R u+w source
            cp -R ${patchedTypeScript} source/typescript
            chmod -R u+w source/typescript
            cp -R source $out
            chmod -R a-w $out
          '';

          buildGoModule = pkgsUnstable.buildGoModule.override { go = pkgsUnstable.go_1_27; };

          tsgo = buildGoModule {
            pname = "effect-tsgo";
            version = "0.0.0";
            inherit src vendorHash;
            proxyVendor = true;
            env = {
              CGO_ENABLED = "0";
              GOWORK = "auto";
            };
            /* Prevent codegen (preBuild) from leaking into the goModules
               derivation — generate.go imports internal/repo which panics
               when compiled with -trimpath. */
            overrideModAttrs = _: { preBuild = ""; };
            preBuild = ''
              # Codegen needs repo path detection; temporarily remove -trimpath
              _saved_goflags="$GOFLAGS"
              export GOFLAGS="''${GOFLAGS//-trimpath/}"
              (
                cd typescript/tsc/internal/diagnostics
                export GOWORK=off
                go run generate.go -diagnostics ./diagnostics_generated.go -loc ./loc_generated.go -locdir ./loc \
                  -locproject ../../../tools/LocProject.json -locsource ./diagnosticMessages.generated.json
              )
              export GOFLAGS="$_saved_goflags"
            '';
            subPackages = [ "typescript/tsc/cmd/tsc" ];
            postInstall = ''
              mv $out/bin/tsc $out/bin/tsgo
            '';
            ldflags = [
              "-s"
              "-w"
            ];
            doCheck = false;
          };

          effectTsgo = pkgs.symlinkJoin {
            name = "effect-tsgo";
            paths = [ tsgo ];
            nativeBuildInputs = [ pkgs.makeWrapper ];
            postBuild = ''
              # tsgo shells out to npm for typings acquisition in LSP mode.
              wrapProgram $out/bin/tsgo \
                --prefix PATH : ${lib.makeBinPath [ pkgs.nodejs ]}

              makeWrapper $out/bin/tsgo $out/bin/effect-tsgo \
                --add-flags "--lsp --stdio"
            '';
            meta = {
              description = "Self-contained Effect Language Service binary built on TypeScript-Go";
              license = lib.licenses.mit;
              mainProgram = "effect-tsgo";
              platforms = supportedSystems;
            };
          };
        in
        {
          default = effectTsgo;
          effect-tsgo = effectTsgo;
          inherit tsgo;
        }
      );

      apps = forAllSystems (
        system: _pkgs:
        let
          package = self.packages.${system}.effect-tsgo;
        in
        {
          default = {
            type = "app";
            program = "${package}/bin/effect-tsgo";
          };
          effect-tsgo = {
            type = "app";
            program = "${package}/bin/effect-tsgo";
          };
        }
      );

      checks = forAllSystems (
        system: _pkgs: {
          inherit (self.packages.${system}) effect-tsgo;
        }
      );
    };
}
```
