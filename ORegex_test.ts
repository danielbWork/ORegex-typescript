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

Deno.test(function getMatchesIn() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.getMatchesIn("flam"), null);
  assertEquals(regex.getMatchesIn("flambob")?.at(0), "bob");

  assertEquals(regex.getMatchesIn("bobflambob")?.length, 2);
  assertEquals(regex.getMatchesIn("bobflambob", false)?.length, 1);

  assertEquals(
    regex.getMatchesIn("bOBflamBoBBob", true, true, false)?.length,
    3
  );

  const regexLines = ORegex.create()
    .startEnteringOptions()
    .startsWith("bob")
    .or()
    .endsWith("jim")
    .stopEnteringOptions();
  regexLines;

  assertEquals(regexLines.getMatchesIn("bob\njim\njimbob\nrobjim")?.length, 3);
  assertEquals(
    regexLines.getMatchesIn("jim\nrobjim\njimbob\nbob", true, false),
    null
  );
});

Deno.test(function countOfMatchesIn() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.countOfMatchesIn("flam"), 0);
  assertEquals(regex.countOfMatchesIn("flambob"), 1);
  assertEquals(regex.countOfMatchesIn("bob bob"), 2);
  assertEquals(regex.countOfMatchesIn("flam-bobob"), 1);
  assertEquals(regex.countOfMatchesIn("bob-bobob"), 2);
  assertEquals(regex.countOfMatchesIn("BOB-boBob"), 0);
  assertEquals(regex.countOfMatchesIn("BOB-boBob", true, false), 2);

  const regexLines = ORegex.create().startsWith("bob");

  assertEquals(regexLines.countOfMatchesIn("bob\nbob"), 2);
  assertEquals(regexLines.countOfMatchesIn("bob\nbob", false), 1);
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

Deno.test(function canHaveAnyAmount() {
  const regex = ORegex.create("bo").canHaveAnyAmount("b");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assert(regex.isIn("My bob's friend"));
  assertEquals(regex.getMatchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bo(b)*");

  assertEquals(ORegex.create().canHaveAnyAmount().build(), "*");
});

Deno.test(function hasOneOrMore() {
  const regex = ORegex.create("bo").hasOneOrMore("b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.getMatchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bo(b)+");

  assertEquals(ORegex.create().hasOneOrMore().build(), "+");
});

Deno.test(function canHaveOne() {
  const regex = ORegex.create("bo").canHaveOne("b");

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assertEquals(regex.getMatchesIn("test bobbbb's code")?.at(0), "bob");
  assertEquals(regex.build(), "bo(b)?");

  assertFalse(regex.append("s").isIn("test bobbs code"));

  assertEquals(ORegex.create().canHaveOne().build(), "?");
});

Deno.test(function ofAmount() {
  const regex = ORegex.create("bo").ofAmount(2, "b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assertFalse(regex.isIn("bob"));
  assert(regex.isIn("test bobb code"));
  assertEquals(regex.build(), "bo(b){2}");

  assert(regex.append("s").isIn("test bobbs code"));

  assertEquals(ORegex.create().ofAmount(3).build(), "{3}");
});

Deno.test(function ofAmountInRange() {
  const regex = ORegex.create("bo").ofAmountInRange(2, 3, "b");

  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assertFalse(regex.isIn("bob"));
  assert(regex.isIn("test bobb code"));
  assert(regex.isIn("test bobbb code"));

  assertEquals(regex.build(), "bo(b){2,3}");

  const regexNoMax = ORegex.create("bo")
    .ofAmountInRange(2, undefined, "b")
    .append("s");

  assertFalse(regexNoMax.isIn("bobs"));
  assert(regexNoMax.isIn("test bobbs code"));
  assert(regexNoMax.isIn("bobbbbbbbbbbs"));

  assertEquals(ORegex.create().ofAmountInRange(3).build(), "{3,}");
  assertEquals(ORegex.create().ofAmountInRange(3, 8).build(), "{3,8}");
});

Deno.test(function enteringOptions() {
  const regex = ORegex.create()
    .startEnteringOptions("bob")
    .or("jim")
    .or()
    .startsWith("test")
    .or("hi")
    .endsWith()
    .stopEnteringOptions();

  // assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assert(regex.isIn("AAAjimlll"));
  assert(regex.isIn("testfhd"));
  assert(regex.isIn("hi"));
  assert(regex.isIn("testbobjimhi"));
  assertFalse(regex.isIn("hi bo"));

  assertEquals(regex.build(), "(bob|jim|^test|hi$)");
});

Deno.test(function containsOneOf() {
  const regex = ORegex.create().containsOneOf(["bo", "bob", "c"]);

  assertFalse(regex.isIn(""));
  assert(regex.isIn("bo"));
  assert(regex.isIn("bob"));
  assert(regex.isIn("c"));
  assertEquals(regex.build(), "(bo|bob|c)");

  regex.canHaveAnyAmount();

  assert(regex.isIn("cbocbob"));
});

Deno.test(function digit() {
  const regex = ORegex.create().digit();

  assert(regex.isIn("5"));
  assert(regex.isIn("9"));
  assert(regex.isIn("asfasf000"));
  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bob"));
  assertEquals(regex.build(), "\\d");
});

Deno.test(function nonDigit() {
  const regex = ORegex.create().nonDigit();

  assertFalse(regex.isIn("5"));
  assertFalse(regex.isIn("9"));
  assert(regex.isIn("asfasf000"));
  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assertEquals(regex.build(), "\\D");
});

Deno.test(function wordCharacter() {
  const regex = ORegex.create().wordCharacter();

  assert(regex.isIn("5"));
  assert(regex.isIn("A"));
  assert(regex.isIn("z"));
  assert(regex.isIn("_"));
  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("-+$%^&"));
  assertEquals(regex.build(), "\\w");
});

Deno.test(function nonWordCharacter() {
  const regex = ORegex.create().nonWordCharacter();

  assertFalse(regex.isIn("5"));
  assertFalse(regex.isIn("A"));
  assertFalse(regex.isIn("z"));
  assertFalse(regex.isIn("_"));
  assertFalse(regex.isIn(""));
  assert(regex.isIn("-+$%^&"));
  assertEquals(regex.build(), "\\W");
});

Deno.test(function space() {
  const regex = ORegex.create().space();

  assert(regex.isIn(" "));
  assert(regex.isIn("\t"));
  assert(regex.isIn("\n"));
  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("safdafgda-hmkfgl"));
  assertEquals(regex.build(), "\\s");
});

Deno.test(function nonSpace() {
  const regex = ORegex.create().nonSpace();

  assertFalse(regex.isIn(" "));
  assertFalse(regex.isIn("\t"));
  assertFalse(regex.isIn("\n"));
  assertFalse(regex.isIn(""));
  assert(regex.isIn("safdafgda-hmkfgl"));
  assertEquals(regex.build(), "\\S");
});

Deno.test(function any() {
  const regex = ORegex.create().any();

  assert(regex.isIn(" "));
  assert(regex.isIn("0"));
  assert(regex.isIn("_"));
  assert(regex.isIn("t"));
  assert(regex.isIn("B"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), ".");
});
