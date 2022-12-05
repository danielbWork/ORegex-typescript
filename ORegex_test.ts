import {
  assert,
  assertEquals,
  assertFalse,
} from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { ORegex } from "./ORegex.ts";

Deno.test(function append() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.build(), "bob");

  assertEquals(regex.append("hi").build(), "bobhi");
});

Deno.test(function doesExistIn() {
  const regex = ORegex.create().append("bob");
  assertFalse(regex.isIn("flam"));
  assert(regex.isIn("flambob"));
});

Deno.test(function allMatchesIn() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.allMatchesIn("flam"), null);
  assertEquals(regex.allMatchesIn("flambob")?.at(0), "bob");
});

Deno.test(function countOfMatchesIn() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.countOfMatchesIn("flam"), 0);
  assertEquals(regex.countOfMatchesIn("flambob"), 1);
  assertEquals(regex.countOfMatchesIn("bob bob"), 2);
  assertEquals(regex.countOfMatchesIn("flam-bobob"), 1);
  assertEquals(regex.countOfMatchesIn("bob-bobob"), 2);
});

Deno.test(function startsWith() {
  const regex = ORegex.create().startsWith("bob");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assert(regex.isIn("bober is great"));
  assertEquals(regex.build(), "^bob");

  assertEquals(ORegex.create().startsWith().build(), "^");
});

Deno.test(function endsWith() {
  const regex = ORegex.create().endsWith("bob");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assert(regex.isIn("he is bob"));
  assertEquals(regex.build(), "bob$");

  assertEquals(ORegex.create().endsWith().build(), "$");
});

Deno.test(function equalsTo() {
  const regex = ORegex.create().equalsTo("bob");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assertFalse(regex.isIn("he is bob"));
  assertEquals(regex.build(), "^bob$");
});

Deno.test(function containsInIt() {
  const regex = ORegex.create().containsInIt("bob");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assert(regex.isIn("My bob's friend"));
  assertEquals(regex.build(), "bob");
});

Deno.test(function canHave() {
  const regex = ORegex.create("bo").canHave("b");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assert(regex.isIn("My bob's friend"));
  assertEquals(regex.allMatchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bo(b)*");

  assertEquals(ORegex.create().canHave().build(), "*");
});

Deno.test(function hasOneOrMore() {
  const regex = ORegex.create("bo").hasOneOrMore("b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.allMatchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bo(b)+");

  assertEquals(ORegex.create().hasOneOrMore().build(), "+");
});

Deno.test(function canHaveOne() {
  const regex = ORegex.create("bo").canHaveOne("b");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.allMatchesIn("test bobbbb's code")?.at(0), "bob");
  assertEquals(regex.build(), "bo(b)?");

  assertFalse(regex.append("s").isIn("test bobbs code"));

  assertEquals(ORegex.create().canHaveOne().build(), "?");
});

Deno.test(function hasAmount() {
  const regex = ORegex.create("bo").hasAmount(2, "b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assertFalse(regex.isIn("bob"));
  assert(regex.isIn("test bobb code"));
  assertEquals(regex.build(), "bo(b){2}");

  assert(regex.append("s").isIn("test bobbs code"));

  assertEquals(ORegex.create().hasAmount(3).build(), "{3}");
});

Deno.test(function hasAmountInRange() {
  const regex = ORegex.create("bo").hasAmountInRange(2, 3, "b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assertFalse(regex.isIn("bob"));
  assert(regex.isIn("test bobb code"));
  assert(regex.isIn("test bobbb code"));

  assertEquals(regex.build(), "bo(b){2,3}");

  const regexNoMax = ORegex.create("bo")
    .hasAmountInRange(2, undefined, "b")
    .append("s");

  assertFalse(regexNoMax.isIn("bobs"));
  assert(regexNoMax.isIn("test bobbs code"));
  assert(regexNoMax.isIn("bobbbbbbbbbbs"));

  assertEquals(ORegex.create().hasAmountInRange(3).build(), "{3,}");
  assertEquals(ORegex.create().hasAmountInRange(3, 8).build(), "{3,8}");
});
