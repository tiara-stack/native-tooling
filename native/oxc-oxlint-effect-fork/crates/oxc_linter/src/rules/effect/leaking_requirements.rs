use oxc_macros::declare_oxc_lint;

use crate::rule::Rule;

#[derive(Debug, Default, Clone)]
pub struct LeakingRequirements;

declare_oxc_lint!(
    /// ### What it does
    ///
    /// This marker rule forwards Effect's `leakingRequirements` diagnostic to the native tsgolint backend.
    ///
    /// ### Why is this bad?
    ///
    /// The diagnostic is implemented by Effect-tsgo and runs inside tsgolint's type-aware pipeline.
    LeakingRequirements(tsgolint),
    effect,
    correctness,
    none
);

impl Rule for LeakingRequirements {}
