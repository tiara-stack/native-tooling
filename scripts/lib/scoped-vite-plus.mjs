import ts from "typescript";

const scope = (value) =>
  value
    .replace(/^(npm:)?vite-plus(?=\/|@|$)/, "$1@tiara-stack/vite-plus")
    .replace(/^(npm:)?@voidzero-dev\/vite-plus-core(?=\/|@|$)/, "$1@tiara-stack/vite-plus-core");

export function rewriteScopedVitePlus(text, path) {
  if (path.endsWith(".md"))
    return text
      .replaceAll("@voidzero-dev/vite-plus-core", "@tiara-stack/vite-plus-core")
      .replace(/(["'`])vite-plus(?=\/|["'`])/g, "$1@tiara-stack/vite-plus")
      .replace(
        /(--package(?:=|[ \t]+)["'`]?)vite-plus(?=@|[ \t"'`]|$)/gm,
        "$1@tiara-stack/vite-plus",
      )
      .replace(/^[ \t]*vp install(?:[ \t]+[^\r\n]*)?$/gm, (command) =>
        command.replace(/([ \t]["'`]?)vite-plus(?=@|[ \t"'`]|$)/g, "$1@tiara-stack/vite-plus"),
      );
  if (path.endsWith(".json")) {
    // Project templates install the scoped package. Toolchain graph identities
    // and other data are upstream inputs, rather than module references.
    if (!path.includes("templates/") || !path.endsWith("package.json")) return text;
    const value = JSON.parse(text);
    for (const field of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ])
      if (value[field])
        value[field] = Object.fromEntries(
          Object.entries(value[field]).map(([key, version]) => [scope(key), version]),
        );
    return JSON.stringify(value, null, 2) + "\n";
  }
  if (!/\.[cm]?[jt]s$/.test(path)) return text;
  const tree = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  if (tree.parseDiagnostics.length) throw new Error(`Cannot parse scoped package input ${path}`);
  const edits = [];
  let migrationTables = 0;
  function enclosing(node, predicate) {
    for (let current = node.parent; current; current = current.parent)
      if (predicate(current)) return current;
  }
  const named = (node, name) => ts.isVariableDeclaration(node) && node.name.getText(tree) === name;
  function visit(node) {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken &&
      ts.isStringLiteral(node.right) &&
      scope(node.right.text) !== node.right.text
    ) {
      const alignment = enclosing(
        node,
        (item) => ts.isFunctionDeclaration(item) && item.name?.text === "targetVersion",
      );
      if (alignment && node.left.getText(tree) === alignment.parameters[0]?.name.getText(tree)) {
        // These are package names to READ. Accept both namespaces while the
        // protocol's upstream toolchain graph identities remain unchanged.
        edits.push([
          node.getStart(tree),
          node.end,
          `${JSON.stringify([node.right.text, scope(node.right.text)])}.includes(${node.left.getText(tree)})`,
        ]);
        return;
      }
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "startsWith" &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === "npm:@voidzero-dev/vite-plus-" &&
      enclosing(
        node,
        (item) => ts.isFunctionDeclaration(item) && item.name?.text === "isVitePlusOverrideSpec",
      )
    ) {
      edits.push([
        node.getStart(tree),
        node.end,
        `(${node.getText(tree)} || ${node.expression.getText(tree)}("npm:@tiara-stack/vite-plus-core@"))`,
      ]);
      return;
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(tree) === "source.startsWith" &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === "vite-plus/" &&
      enclosing(node, (item) => named(item, "TSCONFIG_TYPE_REPLACEMENTS"))
    ) {
      edits.push([
        node.getStart(tree),
        node.end,
        `(${node.getText(tree)} || source.startsWith("@tiara-stack/vite-plus/"))`,
      ]);
      return;
    }
    // These keys describe OLD module specifiers accepted by the migrator.
    // Keep them, add the scoped equivalents, and scope only replacement values.
    if (
      ts.isObjectLiteralExpression(node) &&
      named(node.parent, "vitest_v5_entry_points_default")
    ) {
      migrationTables++;
      const entries = [];
      for (const property of node.properties) {
        if (
          !ts.isPropertyAssignment(property) ||
          !ts.isStringLiteral(property.name) ||
          !ts.isStringLiteral(property.initializer)
        )
          throw new Error(`Unexpected Vitest migration table in ${path}`);
        const key = property.name.text,
          value = scope(property.initializer.text);
        entries.push([key, value]);
        if (scope(key) !== key) entries.push([scope(key), value]);
      }
      edits.push([
        node.getStart(tree),
        node.end,
        JSON.stringify(Object.fromEntries(entries), null, 2),
      ]);
      return;
    }
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node)
    ) {
      const value = scope(node.text);
      if (value !== node.text) {
        const parent = node.parent;
        const call =
          ts.isCallExpression(parent) &&
          parent.arguments.includes(node) &&
          (parent.expression.kind === ts.SyntaxKind.ImportKeyword ||
            /^(?:require|(?:[\w$]+\.)*(?:resolve|resolveSync)|resolveBundled)$/.test(
              parent.expression.getText(tree),
            ));
        const module =
          ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
            parent.moduleSpecifier === node) ||
          ts.isExternalModuleReference(parent) ||
          ts.isModuleDeclaration(parent) ||
          (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent));
        const output =
          enclosing(
            node,
            (item) =>
              ts.isFunctionDeclaration(item) &&
              item.name?.text === "rewriteVitePlusImportSpecifier",
          ) &&
          !ts.isBinaryExpression(parent) &&
          !(ts.isPropertyAssignment(parent) && parent.name === node);
        const lintModule =
          ts.isVariableDeclaration(parent) &&
          /^VITE_PLUS_LINT_PLUGINS(?:_DEV)?$/.test(parent.name.getText(tree));
        // These constants identify the scoped CLI/core outputs. Other literal
        // identities used to recognize existing installations remain inputs.
        const packageOutput = named(parent, "VITE_PLUS_NAME") || named(parent, "CORE_PACKAGE_NAME");
        const managedAliasOutput = enclosing(
          node,
          (item) =>
            ts.isPropertyAssignment(item) &&
            item.name.text === "vite" &&
            enclosing(item, (declaration) => named(declaration, "VITE_PLUS_OVERRIDE_PACKAGES")),
        );
        const tsconfigValue =
          ts.isPropertyAssignment(parent) &&
          parent.initializer === node &&
          enclosing(node, (item) => named(item, "TSCONFIG_TYPE_REPLACEMENTS"));
        if (
          call ||
          module ||
          output ||
          lintModule ||
          packageOutput ||
          managedAliasOutput ||
          tsconfigValue
        ) {
          // Keep the original quoting, template expressions, and every other byte.
          const prefix = /^(?:npm:)?(?:vite-plus|@voidzero-dev\/vite-plus-core)/.exec(node.text)[0];
          const start = node.getStart(tree) + 1;
          if (text.slice(start, start + prefix.length) === prefix)
            edits.push([start, start + prefix.length, scope(prefix)]);
          else if (!ts.isTemplateHead(node))
            edits.push([node.getStart(tree), node.end, JSON.stringify(value)]);
          else throw new Error(`Unexpected escaped module template prefix in ${path}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (/(?:^|\/)vitest-v5-entry-points-[^/]+\.js$/.test(path) && migrationTables !== 1)
    throw new Error(`Missing pinned Vitest migration table in ${path}`);
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0]))
    text = text.slice(0, start) + value + text.slice(end);
  return text;
}
