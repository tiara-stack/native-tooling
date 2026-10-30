import * as Arbitrary from "effect/Arbitrary";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import { afterAll, assert, it } from "../src/index.ts";

let recordRuns = 0;
afterAll(() => assert.strictEqual(recordRuns, 3));

it.effect.prop(
  "checks records containing stable Schema and Arbitrary inputs",
  { count: Schema.Int, label: Arbitrary.Constant("stable") },
  ({ count, label }, ctx) =>
    Effect.sync(() => {
      const number: number = count;
      const text: "stable" = label;
      recordRuns++;
      assert.isTrue(Number.isInteger(number));
      assert.strictEqual(text, "stable");
      assert.strictEqual(
        ctx.task.name,
        "checks records containing stable Schema and Arbitrary inputs",
      );
    }),
  { arbitrary: { runs: 3, seed: "stable-record" } },
);

let tupleRuns = 0;
afterAll(() => assert.strictEqual(tupleRuns, 2));

it.prop(
  "checks tuples containing stable Schema and Arbitrary inputs",
  [Schema.Int, Arbitrary.Constant("tuple")],
  ([count, label]) => {
    const number: number = count;
    const text: "tuple" = label;
    tupleRuns++;
    assert.isTrue(Number.isInteger(number));
    assert.strictEqual(text, "tuple");
  },
  { arbitrary: { runs: 2, seed: "stable-tuple" } },
);

it.live.prop(
  "checks Schema inputs in live properties",
  [Schema.Struct({ count: Schema.Int })],
  ([value]) => Effect.sync(() => assert.isTrue(Number.isInteger(value.count))),
  { arbitrary: { runs: 2, seed: "stable-live" } },
);

class Label extends Context.Service<Label, string>()("test/Label") {}

it.layer(Layer.succeed(Label, "provided"))("layer properties", (it) => {
  it.effect.prop(
    "provides layer services to each generated property",
    { label: Schema.Literal("provided") },
    ({ label }) =>
      Effect.gen(function* () {
        assert.strictEqual(yield* Label, label);
      }),
    { arbitrary: { runs: 2, seed: "stable-layer" } },
  );
});

it.prop("reports returned false as a property failure", [Arbitrary.Constant(1)], () => false, {
  fails: true,
  arbitrary: { runs: 1 },
});

const Input = Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 1_000 }));
const defectValues: Array<number> = [];
const failureValues: Array<number> = [];
let interruptedRuns = 0;

afterAll(() => {
  assert.isAbove(defectValues.length, 1);
  assert.strictEqual(defectValues.at(-1), 1);
  assert.isAbove(failureValues.length, 1);
  assert.strictEqual(failureValues.at(-1), 1);
  assert.strictEqual(interruptedRuns, 1);
});

it.prop(
  "shrinks synchronous assertion failures",
  [Input],
  ([value]) => {
    defectValues.push(value);
    assert.strictEqual(value, 0);
  },
  { fails: true, arbitrary: { runs: 1, seed: "assertion-shrink" } },
);

it.effect.prop(
  "shrinks typed Effect failures",
  [Input],
  ([value]) => {
    failureValues.push(value);
    return Effect.fail("property failure");
  },
  { fails: true, arbitrary: { runs: 1, seed: "assertion-shrink" } },
);

it.effect.prop(
  "preserves interruption instead of shrinking it",
  [Input],
  () => {
    interruptedRuns++;
    return Effect.interrupt;
  },
  { fails: true, arbitrary: { runs: 1, seed: "assertion-shrink" } },
);
