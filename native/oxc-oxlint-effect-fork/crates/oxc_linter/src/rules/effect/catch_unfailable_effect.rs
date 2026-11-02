use oxc_macros::declare_oxc_lint;

use crate::rule::Rule;

#[derive(Debug, Default, Clone)]
pub struct CatchUnfailableEffect;

declare_oxc_lint!(
    /// ### What it does
    ///
    /// This marker rule forwards Effect's `catchUnfailableEffect` diagnostic to the native tsgolint backend.
    ///
    /// ### Why is this bad?
    ///
    /// The diagnostic is implemented by Effect-tsgo and runs inside tsgolint's type-aware pipeline.
    CatchUnfailableEffect(tsgolint),
    effect,
    correctness,
    none,
    version = "1.58.0",
);

impl Rule for CatchUnfailableEffect {}
