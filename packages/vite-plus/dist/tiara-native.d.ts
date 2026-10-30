//#region src/utils/tiara-native.d.ts
declare const binaries: {
  readonly oxlint: {
    readonly overrides: readonly ["TIARA_OXLINT_EFFECT_PATH", "TIARA_REAL_OXLINT_PATH"];
    readonly local: readonly ["native", "oxc-oxlint-effect-fork", "target", "release", "oxlint"];
  };
  readonly tsgolint: {
    readonly overrides: readonly ["TIARA_TSGOLINT_EFFECT_PATH"];
    readonly local: readonly ["native", "tsgolint-effect-fork", "tsgolint"];
  };
  readonly tsgo: {
    readonly overrides: readonly ["TIARA_TSGO_EFFECT_PATH", "TIARA_TSGO_PATH"];
    readonly local: readonly ["native", "typescript-go", "built", "local", "tsgo"];
  };
};
export declare function resolveTiaraNative(tool: keyof typeof binaries): string;
export declare function resolveTiaraWrapper(tool: keyof typeof binaries): string;
//#endregion