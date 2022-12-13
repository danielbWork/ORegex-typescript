# ORegex-typescript
Simplifies regex in typescirpt
## Table of Contents

- [Description](#description)
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Basic Operations](#basic-operations)
  - [Sequences](#sequences)
  - [Options](#options)
  - [Characters](#characters)
  - [Words](#words)
  - [Utils](#utils)
- [License](#license)

## Description

`ORegex` is a Deno library that allows you to use regex while actually understanding 0 regex using human-readable terms instead of needing to search it online or asking github copilot to do it for you
## Overview

- Regex pattern generators with human readable names
- Basic regex operations such as match and replace
- Common utils operations such checking if a value is a integer or not

## Getting Started

To get started all you need to do is import the oregex library and and call *ORegex.create()*
to be able to create a regex

```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create();

```
## Examples

The following are examples for the various ways you can create a regex,
it's still recommended to read the documentation if something is unclear.

### Basic Operations

Check if test is in the regex:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create("test"); // can also use ORegex.create().containsInIt("test")
  console.log(regex.isIn("hello test")); // Prints true
```

Find count of all lines starting with test:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().startsWith("test");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 1
  console.log(regex.countOfMatchesIn("test\nhello\ntest")); // Prints 2

```

Replace all lines ending with "!":
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().endsWith("!");
  console.log(regex.replaceAll("!",".")); // Prints .
  console.log(regex.replaceAll("test!\nhello!\ntest")); // Prints test.\nhello.test

```

Replace first appearance of test:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().append("test");
  console.log(regex.replaceFirst("test","bob")); // Prints bob
  console.log(regex.replaceFirst("test!\nhello!\ntest")); // Prints bob!\nhello!\ntest

```

Check if the string matches exactly with test:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().equalsTo("test"); 
  console.log(regex.isIn("hello test")); // Prints false
  console.log(regex.isIn("test")); // Prints true

```

Get the regex string:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().equalsTo("test"); 
  console.log(regex.build()); // Prints ^test$

```
### Sequences

Find count of all appearances of "a" followed by a some number of "bc"s:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create("a").canHaveAnyAmount("bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 1
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 3
```
Find count of all appearances of "a" followed by at least one "bc":
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create("a").hasOneOrMore("bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 1
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 2
```
Find count of all appearances of "bc" :
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().canHaveOne("bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 4
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 2
```
Find count of all appearances of two consecutive "bc"s:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().ofAmount(2,"bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 2
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 0
```

Find count of all appearances of one-three consecutive "bc"s:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().ofAmountInRange(1, 3, "bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 2
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 2
```

Find count of all appearances of at least two consecutive "bc"s:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().ofAmountInRange(2, undefined, "bc");
  console.log(regex.countOfMatchesIn("test hello")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 1
  console.log(regex.countOfMatchesIn("abcb a abc")); // Prints 0
```

### Options

Find count of all Lines starting with a or ending with b:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().startEnteringOptions()
                      .startsWith("a").or()
                      .endsWith("b")
                      stopEnteringOptions();
  console.log(regex.countOfMatchesIn("a")); // Prints 1
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 1
  console.log(regex.countOfMatchesIn("abcb\nb\nab")); // Prints 3
  console.log(regex.countOfMatchesIn("ba")); // Prints 0
```

Find count of all appearances of c or test:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().containsOneOf(["c","test"]);
  console.log(regex.countOfMatchesIn("a")); // Prints 0
  console.log(regex.countOfMatchesIn("abcbcbcbc")); // Prints 4
  console.log(regex.countOfMatchesIn("test")); // Prints 1
  console.log(regex.countOfMatchesIn("ctest")); // Prints 2
```

### Characters

Find count of all appearances of a-f, A, B, 2-5 and 8:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().containsOneCharacterOf("a-fAB2-58");
  console.log(regex.countOfMatchesIn("a")); // Prints 1
  console.log(regex.countOfMatchesIn("afAB38")); // Prints 6
  console.log(regex.countOfMatchesIn("test")); // Prints 1
  console.log(regex.countOfMatchesIn("F9")); // Prints 0
```


Find count of all appearances of characters which aren't a-f, A, B, 2-5 and 8:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().containsAnyExceptCharacterOf("a-fAB2-58");
  console.log(regex.countOfMatchesIn("a")); // Prints 0
  console.log(regex.countOfMatchesIn("afAB38")); // Prints 0
  console.log(regex.countOfMatchesIn("test")); // Prints 3
  console.log(regex.countOfMatchesIn("F9")); // Prints 2
```

Check if string matches character based regex:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().digit().nonDigit()
                      .wordCharacter().nonWordCharacter()
                      .space().nonSpace()
                      .any();
  console.log(regex.isIn("a")); // Prints false
  console.log(regex.isIn("1b_! 87")); // Prints true
  console.log(regex.isIn("33333333")); // Prints false
  console.log(regex.isIn("9 b\n h")); // Prints false (no any)
  console.log(regex.isIn("9 b\n h_")); // Prints true
```

### Words

Find count of all appearances of word bob:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().hasWord("bob");
  console.log(regex.countOfMatchesIn("bob")); // Prints 1
  console.log(regex.countOfMatchesIn("bober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbob")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober testbob bober bob")); // Prints 1
  console.log(regex.countOfMatchesIn("bob bob bob")); // Prints 3
```

Find count of all appearances of prefix bob:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().hasPrefix("bob");
  console.log(regex.countOfMatchesIn("bob")); // Prints 0
  console.log(regex.countOfMatchesIn("bober")); // Prints 1
  console.log(regex.countOfMatchesIn("testbob")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober testbob bober bob")); // Prints 1
  console.log(regex.countOfMatchesIn("bober bober bober")); // Prints 3
```

Find count of all appearances of suffix bob:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().hasSuffix("bob");
  console.log(regex.countOfMatchesIn("bob")); // Prints 0
  console.log(regex.countOfMatchesIn("bober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbob")); // Prints 1
  console.log(regex.countOfMatchesIn("testbober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober testbob bober bob")); // Prints 1
  console.log(regex.countOfMatchesIn("testbob testbob testbob")); // Prints 3
```

Find count of all appearances of sequence bob inside a word:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create().hasInsideWord("bob");
  console.log(regex.countOfMatchesIn("bob")); // Prints 0
  console.log(regex.countOfMatchesIn("bober")); // Prints 0
  console.log(regex.countOfMatchesIn("testbob")); // Prints 0
  console.log(regex.countOfMatchesIn("testbober")); // Prints 1
  console.log(regex.countOfMatchesIn("testbober testbob bober bob")); // Prints 1
  console.log(regex.countOfMatchesIn("testbober testbober testbober")); // Prints 3
```

### Utils

ORegex also contains a few default values for common scenarios for needed patterns

Find count of all appearances of sequence bob inside a word:
```typescript
  import { ORegex } from "https://deno.land/x/oregex/ORegex.ts";

  const regex = ORegex.create()
                      .isLetter()
                      .isLowercaseLetter()
                      .isUppercaseLetter()
                      .isInteger()
                      .isDecimal()
                      .isFraction()
                      .isHexColor();
```

## License

This project is licensed under the terms of the [MIT License](LICENSE).
