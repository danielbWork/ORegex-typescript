import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { ORegex } from "./ORegex.ts";

Deno.test(function append() {
  const regex = ORegex.create().append("bob");
  assertEquals(regex.build(), "bob");

  assertEquals(regex.append("hi").build(), "bobhi");
});

Deno.test(function startsWith() {
  const regex = ORegex.create().startsWith("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("bob is great")?.at(0), "bob");
  assertEquals(regex.build(), "^bob");
});

Deno.test(function endsWith() {
  const regex = ORegex.create().endsWith("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("he is bob")?.at(0), "bob");
  assertEquals(regex.build(), "bob$");
});

Deno.test(function equalsTo() {
  const regex = ORegex.create().equalsTo("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("he is bob"), null);
  assertEquals(regex.build(), "^bob$");
});

Deno.test(function containsInIt() {
  const regex = ORegex.create().containsInIt("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("My bob's friend")?.at(0), "bob");
  assertEquals(regex.build(), "bob");
});

Deno.test(function canHave() {
  const regex = ORegex.create().canHave("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bo")?.at(0), "bo");
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bob*");
});

Deno.test(function hasOneOrMore() {
  const regex = ORegex.create().hasOneOrMore("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bo"), null);
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("test bobbbb's code")?.at(0), "bobbbb");
  assertEquals(regex.build(), "bob+");
});

Deno.test(function canHaveOne() {
  const regex = ORegex.create().canHaveOne("bob");

  assertEquals(regex.matchesIn(""), null);
  assertEquals(regex.matchesIn("bo")?.at(0), "bo");
  assertEquals(regex.matchesIn("bob")?.at(0), "bob");
  assertEquals(regex.matchesIn("test bobbbb's code")?.at(0), "bob");
  assertEquals(regex.build(), "bob?");
  assertEquals(regex.append("s").matchesIn("test bobbs code"), null);
});
