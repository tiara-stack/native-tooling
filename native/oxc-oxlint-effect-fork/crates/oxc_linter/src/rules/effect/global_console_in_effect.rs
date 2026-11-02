use oxc_macros::declare_oxc_lint;

use crate::rule::Rule;

#[derive(Debug, Default, Clone)]
pub struct GlobalConsoleInEffect;

declare_oxc_lint!(
    /// ### What it does
    ///
    /// This marker rule forwards Effect's `globalConsoleInEffect` diagnostic to the native tsgolint backend.
    ///
    /// ### Why is this bad?
    ///
    /// The diagnostic is implemented by Effect-tsgo and runs inside tsgolint's type-aware pipeline.
    GlobalConsoleInEffect(tsgolint),
    effect,
    correctness,
    none,
    version = "1.58.0",
);

impl Rule for GlobalConsoleInEffect {}
