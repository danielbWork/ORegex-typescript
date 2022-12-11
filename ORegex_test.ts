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

Deno.test(function replaceFirst() {
  const regex = ORegex.create().append("b");

  assertEquals(regex.replaceFirst("bbb", "t"), "tbb");

  assertEquals(regex.replaceFirst("mmm", "t"), "mmm");

  assertEquals(regex.replaceFirst("Bob", "b", false), "bob");
});

Deno.test(function replaceAll() {
  const regex = ORegex.create("t");

  assertEquals(regex.replaceAll("bbb", "t"), "bbb");

  assertEquals(regex.replaceAll("btobtt", ""), "bob");

  assertEquals(regex.replaceAll("bTobTT", ""), "bTobTT");

  assertEquals(regex.replaceAll("bTobTT", "", false), "bob");
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

Deno.test(function containsOneCharacterOf() {
  const regex = ORegex.create().containsOneCharacterOf("a5Ty");

  assert(regex.isIn("5"));
  assert(regex.isIn("T"));
  assert(regex.isIn("asfasf000"));
  assertFalse(regex.isIn(""));
  assertFalse(regex.isIn("bob"));
  assertEquals(regex.build(), "[a5Ty]");
});

Deno.test(function containsAnyExceptCharacterOf() {
  const regex = ORegex.create().containsAnyExceptCharacterOf("a5Ty");

  assertFalse(regex.isIn("5"));
  assertFalse(regex.isIn("T"));
  assert(regex.isIn("asfasf000"));
  assertFalse(regex.isIn(""));
  assert(regex.isIn("bob"));
  assertEquals(regex.build(), "[^a5Ty]");
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

Deno.test(function hasWord() {
  const regex = ORegex.create().hasWord("bob");

  assert(regex.isIn("bob"));
  assert(regex.isIn("test bob name"));
  assertFalse(regex.isIn("bober"));
  assertFalse(regex.isIn("Debob"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "\\bbob\\b");
});

Deno.test(function hasPrefix() {
  const regex = ORegex.create().hasPrefix("bob");

  assertFalse(regex.isIn("bob"));
  assertFalse(regex.isIn("test bob name"));
  assert(regex.isIn("bober"));
  assertFalse(regex.isIn("Debob"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "\\bbob\\B");
});

Deno.test(function hasSuffix() {
  const regex = ORegex.create().hasSuffix("bob");

  assertFalse(regex.isIn("bob"));
  assertFalse(regex.isIn("test bob name"));
  assertFalse(regex.isIn("bober"));
  assert(regex.isIn("Debob"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "\\Bbob\\b");
});

Deno.test(function hasInsideWord() {
  const regex = ORegex.create().hasInsideWord("bob");

  assertFalse(regex.isIn("bob"));
  assertFalse(regex.isIn("test bob name"));
  assertFalse(regex.isIn("bober"));
  assertFalse(regex.isIn("Debob"));
  assert(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "\\Bbob\\B");
});

Deno.test(function isLetter() {
  const regex = ORegex.create().isLetter();

  assert(regex.isIn("b"));
  assert(regex.isIn("O"));
  assert(regex.isIn("B"));
  assertFalse(regex.isIn("51125-&*%^$$%*("));
  assert(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "[a-zA-Z]");
});

Deno.test(function isLetter() {
  const regex = ORegex.create().isLetter();

  assert(regex.isIn("b"));
  assert(regex.isIn("O"));
  assert(regex.isIn("B"));
  assertFalse(regex.isIn("51125-&*%^$$%*("));
  assert(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "[a-zA-Z]");
});

Deno.test(function isLowercaseLetter() {
  const regex = ORegex.create().isLowercaseLetter();

  assert(regex.isIn("b"));
  assert(regex.isIn("o"));
  assertFalse(regex.isIn("B"));
  assertFalse(regex.isIn("51125-&*%^$$%*("));
  assert(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "[a-z]");
});

Deno.test(function isUppercaseLetter() {
  const regex = ORegex.create().isUppercaseLetter();

  assertFalse(regex.isIn("b"));
  assertFalse(regex.isIn("o"));
  assert(regex.isIn("B"));
  assertFalse(regex.isIn("51125-&*%^$$%*("));
  assert(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "[A-Z]");
});

Deno.test(function isInteger() {
  const regex = ORegex.create().isInteger();

  assert(regex.isIn("0"));
  assert(regex.isIn("-123"));
  assertFalse(regex.isIn("B"));
  assertFalse(regex.isIn("511.5"));
  assertFalse(regex.isIn("1/5"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "^(-?\\d+)$");
});

Deno.test(function isDecimal() {
  const regex = ORegex.create().isDecimal();

  assertFalse(regex.isIn("0"));
  assertFalse(regex.isIn("-123"));
  assertFalse(regex.isIn("B"));
  assert(regex.isIn("511.5"));
  assert(regex.isIn("-67.5"));
  assertFalse(regex.isIn("1/5"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "^(-?\\d*)[.,](\\d+)$");
});

Deno.test(function isFraction() {
  const regex = ORegex.create().isFraction();

  assert(regex.isIn("1/5"));
  assert(regex.isIn("-2/3"));
  assert(regex.isIn("-1090/-3"));
  assertFalse(regex.isIn("0"));
  assertFalse(regex.isIn("B"));
  assertFalse(regex.isIn("511.5"));
  assertFalse(regex.isIn("Debober"));
  assertFalse(regex.isIn(""));
  assertEquals(regex.build(), "^(-?\\d+)[/](-?\\d+)$");
});

Deno.test(function isHexColor() {
  const regex = ORegex.create().isHexColor();
  assertFalse(regex.isIn("0"));
  assertFalse(regex.isIn("B"));
  assert(regex.isIn("#fff"));
  assert(regex.isIn("#42ED42"));
  assert(regex.isIn("#A2eD4f"));
  assertEquals(regex.build(), "\\B#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b");
});
