# Tiara Setup Vite+

GitHub Action fork of `voidzero-dev/setup-vp` for Tiara Stack tooling.

This action preserves the upstream setup-vp inputs, caching behavior, optional
`vp install`, Node setup via `vp env use`, and registry auth handling. The
installer is intentionally changed to install `@tiara-stack/vite-plus` from npm
instead of upstream `vite-plus`.

```yaml
- uses: tiara-stack/native-tooling/packages/setup-vp@main
  with:
    version: "0.2.2"
    node-version: "22"
    cache: true
```

For local workflows inside this repository, use the checked-out action path:

```yaml
- uses: ./packages/setup-vp
  with:
    version: "0.2.2"
    node-version: "22"
    cache: true
```

The action runs:

```sh
npm install --global @tiara-stack/vite-plus@<version>
```

The `version` input is recommended for deterministic CI. If it is omitted, the
action follows the upstream resolution order but looks for
`@tiara-stack/vite-plus` in `package.json`, workspace catalogs, and supported
lockfiles before falling back to `latest`.
