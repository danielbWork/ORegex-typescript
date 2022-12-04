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
});

Deno.test(function endsWith() {
  const regex = ORegex.create().endsWith("bob");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assert(regex.isIn("he is bob"));
  assertEquals(regex.build(), "bob$");
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
});

Deno.test(function hasOneOrMore() {
  const regex = ORegex.create("bo").hasOneOrMore("b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.allMatchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bo(b)+");
});

Deno.test(function canHaveOne() {
  const regex = ORegex.create("bo").canHaveOne("b");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.allMatchesIn("test bobbbb's code")?.at(0), "bob");
  assertEquals(regex.build(), "bo(b)?");

  assertFalse(regex.append("s").isIn("test bobbs code"));
});
