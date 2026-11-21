import * as Arbitrary from "effect/Arbitrary";
import * as Cause from "effect/Cause";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import { constVoid, flow, pipe } from "effect/Function";
import * as Layer from "effect/Layer";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as TestClock from "effect/testing/TestClock";
import * as TestConsole from "effect/testing/TestConsole";
import * as V from "@tiara-stack/vite-plus/test";
export * from "@tiara-stack/vite-plus/test";
//#region src/internal/internal.ts
/**
* @since 4.0.0
*/
const getCurrentSuite = V.TestRunner.getCurrentSuite;
const runPromise = Effect.fnUntraced(function* (effect, _ctx) {
	const exit = yield* Effect.exit(effect);
	if (Exit.isFailure(exit)) {
		const errors = Cause.prettyErrors(exit.cause);
		for (let i = 0; i < errors.length; i++) yield* Effect.logError(errors[i]);
	}
	return yield* exit;
}, (effect, _, ctx) => Effect.runPromise(effect, { signal: ctx?.signal }));
/** @internal */
const runTest = (ctx) => (effect) => {
	const promise = runPromise(effect, ctx);
	if (ctx) {
		const onAbort = () => ctx.onTestFinished(() => promise.then(constVoid, constVoid));
		ctx.signal.addEventListener("abort", onAbort, { once: true });
		const cleanup = () => ctx.signal.removeEventListener("abort", onAbort);
		promise.then(cleanup, cleanup);
		if (ctx.signal.aborted) onAbort();
	}
	return promise;
};
const TestEnv = Layer.mergeAll(TestConsole.layer, TestClock.layer());
/** @internal */
const addEqualityTesters$1 = () => {
	V.expect.addEqualityTesters([]);
};
/** @internal */
const testOptions = (timeout) => typeof timeout === "number" ? { timeout } : timeout ?? {};
const hookTimeout = (timeout) => timeout === void 0 ? void 0 : Duration.toMillis(Duration.fromInputUnsafe(timeout));
const propertyTestOptions = (timeout) => typeof timeout === "number" ? void 0 : timeout;
const checkOptions = (timeout) => propertyTestOptions(timeout)?.arbitrary;
const compileArbitraryInput = (input) => Arbitrary.isArbitrary(input) ? input : Arbitrary.schema(input);
const makeArbitrary = (arbitraries) => Arbitrary.all(Array.isArray(arbitraries) ? arbitraries.map(compileArbitraryInput) : Object.fromEntries(Object.entries(arbitraries).map(([key, input]) => [key, compileArbitraryInput(input)])));
const normalizeProperty = (property, value) => Effect.catchCause(Effect.suspend(() => {
	const output = property(value);
	return Effect.isEffect(output) ? output : Effect.succeed(output);
}), (cause) => Cause.hasInterrupts(cause) ? Effect.failCause(cause) : Effect.fail(cause));
const runCheck = (ctx, arbitrary, property, options) => runTest(ctx)(Effect.flatMapEager(Arbitrary.checkEffect(arbitrary, (value) => normalizeProperty(property, value), options), (result) => {
	const failure = Arbitrary.formatCheckFailure(result);
	return failure === void 0 ? Effect.void : Effect.die(new Error(failure));
}));
const withFixturesOf = (source, f) => Object.defineProperty(f, "toString", { value: () => source.toString() });
const makeItProxy = (it, overrides) => new Proxy(it, {
	apply(target, thisArg, argArray) {
		return Reflect.apply(target, thisArg, argArray);
	},
	get(target, property, receiver) {
		if (Object.hasOwn(overrides, property)) return Reflect.get(overrides, property);
		return Reflect.get(target, property, receiver);
	}
});
const collectTasks = (tasks, acc = []) => {
	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		if (task.type === "test" && task.mode !== "skip" && task.mode !== "todo") acc.push(task);
		else if (task.tasks !== void 0) collectTasks(task.tasks, acc);
	}
	return acc;
};
const registerProp = (it, name, arbitraries, property, timeout) => {
	const arbitrary = makeArbitrary(arbitraries);
	it(name, testOptions(timeout), withFixturesOf(() => {}, (ctx) => runCheck(ctx, arbitrary, (values) => property(values, ctx), checkOptions(timeout))));
};
const makeTester = (mapEffect, it) => {
	const run = (ctx, args, self) => pipe(Effect.suspend(() => self(...args)), mapEffect, runTest(ctx));
	const register = (test) => (name, self, timeout) => test(name, testOptions(timeout), withFixturesOf(self, (ctx) => run(ctx, [ctx], self)));
	const each = (cases) => (name, self, timeout) => it.for(cases)(name, testOptions(timeout), withFixturesOf(self, (args, ctx) => run(ctx, [args, ctx], self).then(constVoid)));
	const prop = (name, arbitraries, self, timeout) => registerProp(it, name, arbitraries, (values, ctx) => Effect.mapEager(mapEffect(Effect.suspend(() => self(values, ctx))), (value) => value !== false), timeout);
	return Object.assign(register(it), {
		skip: register(it.skip),
		skipIf: (condition) => register(it.skipIf(condition)),
		runIf: (condition) => register(it.runIf(condition)),
		only: register(it.only),
		each,
		fails: register(it.fails),
		prop
	});
};
const makeProp = (it) => (name, arbitraries, self, timeout) => registerProp(it, name, arbitraries, (values, ctx) => self(values, ctx) !== false, timeout);
const makeLayer = (it) => (layer_, options) => (...args) => {
	const excludeTestServices = options?.excludeTestServices ?? false;
	const withTestEnv = excludeTestServices ? layer_ : Layer.provideMerge(layer_, TestEnv);
	const memoMap = options?.memoMap ?? Effect.runSync(Layer.makeMemoMap);
	const scope = Effect.runSync(Scope.make());
	const contextEffect = Layer.buildWithMemoMap(withTestEnv, memoMap, scope).pipe(Effect.orDie, Effect.cached, Effect.runSync);
	let closed = false;
	const closeScope = () => {
		if (closed) return Promise.resolve();
		closed = true;
		return runPromise(Scope.close(scope, Exit.void));
	};
	const methods = makeItProxy(it, {
		effect: makeTester((effect) => Effect.flatMap(contextEffect, (context) => effect.pipe(Effect.scoped, Effect.provide(context))), it),
		prop: makeProp(it),
		flakyTest: flakyTest$1,
		layer(nestedLayer, options) {
			return makeLayer(it)(Layer.provideMerge(nestedLayer, withTestEnv), {
				...options,
				memoMap: Layer.forkMemoMapUnsafe(memoMap),
				excludeTestServices
			});
		}
	});
	if (args.length === 1) {
		const currentSuite = getCurrentSuite();
		const previousTasks = new Set(currentSuite.tasks);
		args[0](methods);
		const blockTasks = collectTasks(currentSuite.tasks.filter((task) => !previousTasks.has(task)));
		if (blockTasks.length === 0) {
			V.afterAll(() => closeScope(), hookTimeout(options?.timeout));
			return;
		}
		const blockTaskSet = new Set(blockTasks);
		let remaining = blockTasks.length;
		V.beforeEach(({ onTestFinished, signal, task }) => {
			if (!blockTaskSet.has(task)) return;
			onTestFinished(() => {
				remaining--;
				if (remaining === 0) return closeScope();
			});
			return runPromise(Effect.asVoid(contextEffect), { signal });
		}, hookTimeout(options?.timeout));
		V.afterAll(() => closeScope(), hookTimeout(options?.timeout));
		return;
	}
	const suiteOptions = options?.concurrent === void 0 ? {} : { concurrent: options.concurrent };
	return V.describe(args[0], suiteOptions, () => {
		V.beforeAll(() => runPromise(Effect.asVoid(contextEffect)), hookTimeout(options?.timeout));
		V.afterAll(() => closeScope(), hookTimeout(options?.timeout));
		return args[1](methods);
	});
};
/** @internal */
const flakyTest$1 = (self, timeout = Duration.seconds(30)) => pipe(self, Effect.scoped, Effect.sandbox, Effect.retry(pipe(Schedule.recurs(10), Schedule.while((_) => Effect.succeed(Duration.isLessThanOrEqualTo(Duration.fromInputUnsafe(_.elapsed), Duration.fromInputUnsafe(timeout)))))), Effect.orDie);
/** @internal */
const makeMethods$1 = (it) => makeItProxy(it, {
	effect: makeTester(flow(Effect.scoped, Effect.provide(TestEnv)), it),
	live: makeTester(Effect.scoped, it),
	flakyTest: flakyTest$1,
	layer: makeLayer(it),
	prop: makeProp(it)
});
/** @internal */
const it$1 = makeMethods$1(V.it);
/** @internal */
const { effect: effect$1, layer: layer$1, live: live$1, prop: prop$1 } = it$1;
/** @internal */
const describeWrapped$1 = (name, f) => V.describe(name, () => f(it$1));
//#endregion
//#region src/index.ts
/**
* @since 4.0.0
*/
const addEqualityTesters = addEqualityTesters$1;
/**
* @since 4.0.0
*/
const effect = effect$1;
/**
* @since 4.0.0
*/
const live = live$1;
/**
* Share a `Layer` between multiple tests, optionally wrapping
* the tests in a `describe` block if a name is provided.
*
* Named layers accept `concurrent` to override inherited suite concurrency.
* Anonymous layers always inherit the enclosing suite's concurrency.
* Use `ctx.expect` in concurrent tests for test-local snapshots and assertion counts.
*
* @since 4.0.0
*
* ```ts
* import { assert, layer } from "@tiara-stack/effect-vitest"
* import { Effect, Layer, Context } from "effect"
*
* class Foo extends Context.Service<Foo, "foo">()("Foo") {
*   static layer = Layer.succeed(Foo, "foo")
* }
*
* class Bar extends Context.Service<Bar, "bar">()("Bar") {
*   static layer = Layer.effect(
*     Bar,
*     Effect.map(Foo, () => "bar" as const)
*   )
* }
*
* layer(Foo.layer)("layer", (it) => {
*   it.effect("adds context", () =>
*     Effect.gen(function*() {
*       const foo = yield* Foo
*       assert.strictEqual(foo, "foo")
*     }))
*
*   it.layer(Bar.layer)("nested", (it) => {
*     it.effect("adds context", () =>
*       Effect.gen(function*() {
*         const foo = yield* Foo
*         const bar = yield* Bar
*         assert.strictEqual(foo, "foo")
*         assert.strictEqual(bar, "bar")
*       }))
*   })
* })
* ```
*/
const layer = layer$1;
/**
* @since 4.0.0
*/
const flakyTest = flakyTest$1;
/**
* @since 4.0.0
*/
const prop = prop$1;
/**
* @since 4.0.0
*/
/**
* @since 4.0.0
*/
const it = it$1;
/**
* Creates the Effect test helpers for a Vitest test API, such as one extended with fixtures.
*
* **Details**
*
* Tests receive the fixtures they destructure from their context. Vitest sets them up before the test and tears
* them down after the test's scope closes, as it does for its own tests. `it.effect.each` passes the context
* after the test case, and named and anonymous `it.layer` blocks keep the fixtures.
*
* **Gotchas**
*
* Vitest reads the destructured names to decide which fixtures to set up. Once any fixture is defined, a test that
* takes the whole context as a plain parameter, such as `(ctx) =>`, fails with a `FixtureParseError`. Property
* tests receive only the base test context and cannot request fixtures; auto fixtures still run.
*
* **Example** (Using a Vitest fixture in an Effect test)
*
* ```ts
* import { assert, makeMethods, test } from "@tiara-stack/effect-vitest"
* import { Effect } from "effect"
*
* const it = makeMethods(
*   test.extend("config", { scope: "file" }, () => ({ port: 3000 }))
* )
*
* it.effect("reads the config fixture", ({ config }) =>
*   Effect.sync(() => {
*     assert.strictEqual(config.port, 3000)
*   }))
* ```
*
* @since 4.0.0
*/
const makeMethods = makeMethods$1;
/**
* @since 4.0.0
*/
const describeWrapped = describeWrapped$1;
//#endregion
export { addEqualityTesters, describeWrapped, effect, flakyTest, it, layer, live, makeMethods, prop };

//# sourceMappingURL=index.mjs.map