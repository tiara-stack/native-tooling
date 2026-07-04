use oxc_macros::declare_oxc_lint;

use crate::rule::Rule;

#[derive(Debug, Default, Clone)]
pub struct RedundantOrDie;

declare_oxc_lint!(
    /// ### What it does
    ///
    /// This marker rule forwards Effect's `redundantOrDie` diagnostic to the native tsgolint backend.
    ///
    /// ### Why is this bad?
    ///
    /// The diagnostic is implemented by Effect-tsgo and runs inside tsgolint's type-aware pipeline.
    RedundantOrDie(tsgolint),
    effect,
    correctness,
    none
);

impl Rule for RedundantOrDie {}
