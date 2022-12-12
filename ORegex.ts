/**
 * Class that you use to build your regex easily while using or knowing 0 regex
 *
 * Most methods return the the ORegex to allow chaining.
 */
export class ORegex {
  private regex: string;

  private constructor(regex?: string) {
    this.regex = regex || "";
  }

  /**
   * Creates an ORegex to be used
   * @param startingValue Optional starting value for the regex
   */
  public static create(startingValue?: string) {
    return new ORegex(startingValue);
  }

  /**
   * Returns the regex built
   * @returns The regex string created by the user
   */
  public build() {
    return this.regex;
  }

  /**
   * Appends the given string to the regex
   * @param value The value we append to the regex
   */
  public append(value: string): ORegex {
    this.regex += value;

    return this;
  }

  /**
   * Checks the given value to see if it contains a match for the regex
   * @param value The value we check if it contains the regex
   * @returns true if regex is contained in the value false otherwise
   */
  public isIn(value: string) {
    return new RegExp(this.regex).test(value);
  }

  /**
   * Searches the given value for matches of the regex
   *
   * Same as calling value.match(new RegExp(oregex.build())) with the appropriate flags
   *
   * @param value The string we match the regex with
   * @param isAllMatches If true (which is the default value) gets every appearance of the regex from the value
   * this will not find "intersecting/nested values" as after finding a regex it continues the search after it
   * @param isMultiLine Only effects directly the {@link startsWith}, {@link endsWith} and {@link equalsTo} commands making them effect
   * every line of the string and not just the start and end of a string. Defaults to true.
   * @param isCaseSensitive Defaults to true, if changed to false regex will ignore the cases for letter meaning a == A
   * @returns The results of the search in a array or null if nothing was found
   */
  public getMatchesIn(
    value: string,
    isAllMatches = true,
    isMultiLine = true,
    isCaseSensitive = true
  ) {
    let flags = "";

    if (isAllMatches) flags += "g";
    if (isMultiLine) flags += "m";
    if (!isCaseSensitive) flags += "i";

    return value.match(new RegExp(this.regex, flags));
  }

  /**
   * Returns how many matches of the regex are in the given value
   * @param value The value we check how many times the regex is in it
   * @param isMultiLine Only effects directly the {@link startsWith}, {@link endsWith} and {@link equalsTo} commands making them effect
   * every line of the string and not just the start and end of a string. Defaults to true.
   * @param isCaseSensitive Defaults to true, if changed to false regex will ignore the cases for letter meaning a == A
   *
   * @returns The number of matches in the value
   */
  public countOfMatchesIn(
    value: string,
    isMultiLine?: boolean,
    isCaseSensitive?: boolean
  ) {
    return (
      this.getMatchesIn(value, true, isMultiLine, isCaseSensitive)?.length || 0
    );
  }

  /**
   * Adds to the regex a check for strings containing the given value this is the same
   * as calling the {@link append} method.
   *
   * The same as adding "value" to the regex.
   *
   * @param value The string that should be part of the checked strings
   */
  public containsInIt(value: string) {
    return this.append(value);
  }

  /**
   * Replaces the first appearance of the regex in the string.
   *
   * Same as calling value.replace(...)
   *
   * @param value The string we replace the first appearance of in the regex
   * @param replaceValue The new value to put instead of the regex
   * @param isCaseSensitive Defaults to true, if changed to false regex will ignore the cases for letter meaning a == A
   * @returns The new string
   */
  public replaceFirst(
    value: string,
    replaceValue: string,
    isCaseSensitive = true
  ) {
    return value.replace(
      new RegExp(this.regex, isCaseSensitive ? "" : "i"),
      replaceValue
    );
  }

  /**
   * Replaces the all appearances of the regex in the string.
   *
   * Same as calling value.replaceAll(...)
   *
   * @param value The string we replace any appearance of the regex in
   * @param replaceValue The new value to put instead of the regex
   * @param isCaseSensitive Defaults to true, if changed to false regex will ignore the cases for letter meaning a == A
   * @returns The new string
   */
  public replaceAll(
    value: string,
    replaceValue: string,
    isCaseSensitive = true
  ) {
    return value.replaceAll(
      new RegExp(this.regex, isCaseSensitive ? "gm" : "gmi"),
      replaceValue
    );
  }

  //#region Start/End

  /**
   * Adds to the regex a check for strings starting with the given string (Recommended to be called only once).
   *
   * The same as adding "^start" to the regex.
   *
   * @param start The string that should be at the start of checked strings defaults as ""
   */
  public startsWith(start = "") {
    return this.append(`^${start}`);
  }

  /**
   * Adds to the regex a check for strings ending with the given string (Recommended to be called only once).
   *
   * The same as adding "end$" to the regex.
   *
   * @param end The string that should be at the end of checked strings defaults as ""
   */
  public endsWith(end = "") {
    return this.append(`${end}$`);
  }

  /**
   * Adds to the regex a check for strings equals the given string (Recommended to be called only once).
   *
   * The same as calling both {@link startsWith} and {@link endsWith} or just adding "^value$" to the regex.
   *
   * @param value The string that should be equal to the checked strings
   */
  public equalsTo(value: string) {
    return this.append(`^${value}$`);
  }

  //#endregion

  //#region Sequence

  /**
   * Adds to the regex a check for strings containing any number of the given sequence.
   *
   * i.e. canHave("ab") => can match for "" "ab" and "ababab"
   *
   * The same as adding "(sequence)*" to the regex.
   *
   * If nothing is passed then this effects the last character (or sequence if it's inside round brackets ())
   * that was added to the regex.
   *
   * @param sequence The sequence that can appear any number of time
   */
  public canHaveAnyAmount(sequence?: string) {
    return this.append(sequence ? `(${sequence})*` : "*");
  }

  /**
   * Adds to the regex a check for strings containing one or more of the given sequence.
   *
   * i.e. hasOneOrMore("ab") => can match for "ab" and "ababab"
   *
   * The same as adding "(sequence)+" to the regex.
   *
   * If nothing is passed then this effects the last character (or sequence if it's inside round brackets ())
   * that was added to the regex.
   *
   * @param sequence The sequence that can appear one or more times
   */
  public hasOneOrMore(sequence?: string) {
    return this.append(sequence ? `(${sequence})+` : "+");
  }

  /**
   * Adds to the regex a check for strings containing zero or one of the given sequence.
   *
   * i.e. canHaveOne("ab") => can match for "" and "ab"
   *
   * The same as adding "(sequence)?" to the regex.
   *
   * If nothing is passed then this effects the last character (or sequence if it's inside round brackets ())
   * that was added to the regex.
   *
   * @param sequence The sequence that can appear once or not at all
   */
  public canHaveOne(sequence?: string) {
    return this.append(sequence ? `(${sequence})?` : "?");
  }

  /**
   * Adds to the regex a check for strings containing the exact amount of the given sequence.
   *
   * i.e. hasAmount("ab", 2) => can match for "abab"
   *
   * The same as adding "(sequence){amount}" to the regex.
   *
   * If no sequence is passed then this effects the last character (or sequence if it's inside round brackets ())
   * that was added to the regex.
   *
   * @param amount How many of the sequence should appear in the string
   * @param sequence The sequence that can appear the amount of times given
   */
  public ofAmount(amount: number, sequence?: string): ORegex {
    const sequencePrefix = sequence ? `(${sequence})` : "";

    return this.append(`${sequencePrefix}{${amount}}`);
  }

  /**
   * Adds to the regex a check for strings containing the given sequence an amount inside the given range.
   *
   * i.e. hasAmountInRange("ab", 2, 4) => can match for "abab", "ababab" and "abababab"
   * hasAmountInRange("ab", 2, ) => can match for "abab", "ababab", "abababab" ...
   * The same as adding "(sequence){min,max}" to the regex.
   *
   * If no sequence is passed then this effects the last character (or sequence if it's inside round brackets ())
   * that was added to the regex.
   *
   * @param sequence The sequence that can appear min-max times
   * @param min Inclusive number of times the sequence needs to appear
   * @param max Inclusive number of times the can appear if not passed the sequence can appear any amount of times
   */
  public ofAmountInRange(min: number, max?: number, sequence?: string) {
    const sequencePrefix = sequence ? `(${sequence})` : "";

    return this.append(`${sequencePrefix}{${min},${max ?? ""}}`);
  }

  //#endregion

  //#region Optional

  /**
   * After this is called all changes in the regex should be considered part of a selection of options.
   * Important: Between each option you should call {@link or} otherwise they would be considered the same option.
   * To exit the selection of options call {@link stopEnteringOptions}.
   *
   * If you have a collection of options already made you should use {@link containsOneOf} instead.
   *
   * This is the same as adding a (startValue to the regex.
   *
   * @param startValue If passed treated as the first option in the selection, however {@link or} still needs to be called to move to add the next option
   */
  public startEnteringOptions(startValue = "") {
    return this.append(`(${startValue}`);
  }

  /**
   * This should be called after {@link startEnteringOptions} to signify a new optional value in a selection
   *
   * This is the same as adding a |option to the regex
   *
   * @param option If passed added as a new option to the selection, however this method needs to be called again to add the next option
   */
  public or(option = "") {
    return this.append(`|${option}`);
  }

  /**
   * Should be called after {@link startEnteringOptions}, to stop adding to the option selection.
   * This method should be called the same amount of times as {@link startEnteringOptions}.
   *
   * This is the same as adding a ) to the regex.
   *
   */
  public stopEnteringOptions() {
    return this.append(")");
  }

  /**
   * Adds to the regex a check for strings containing one of the given values
   * i.e. containsOneOf(["ab", "c"]) => can match for "ab" and "c"
   *
   * The same as adding "(value[0]|value[1]...)" to the regex.
   *
   * If you want more complex options that use certain conditions such as {@link startsWith},
   * you should use {@link startEnteringOptions}
   *
   * @param values The optional values added to the regex
   */
  public containsOneOf(values: string[]) {
    this.append("(");

    values.forEach((value, index) => {
      if (index !== 0) {
        this.append("|");
      }

      this.append(value);
    });

    return this.append(")");
  }

  // TODO decide on code for [] brackets as they are wired with ranges

  //#endregion

  //#region Characters

  /**
   * Adds a selection of characters that can appear in the pattern to the regex.
   *
   * i.e if characters === abc then the next character should be "a", "b" or "c".
   *
   * Ranges can also be used for example a-c means the same as abc, 0-9 means every digit,
   * A-Z means every capital letter.
   *
   * You can can even pass A-Gbnt0-5 which means every capital between A to G inclusive, the lower case letters
   * b, n and t and every digit between 0 and 5 inclusive
   *
   * Same as adding [characters] to the regex.
   *
   * @param characters The characters expected to be in the pattern
   */
  public containsOneCharacterOf(characters: string) {
    return this.append(`[${characters}]`);
  }

  /**
   * Adds a selection of characters that can't appear in the pattern to the regex.
   *
   * i.e if characters === abc then the next character shouldn't be "a", "b" or "c".
   *
   * Ranges can also be used for example a-c means the same as abc, 0-9 means every digit,
   * A-Z means every capital letter.
   *
   * You can can even pass A-Gbnt0-5 which means every capital between A to G inclusive, the lower case letters
   * b, n and t and every digit between 0 and 5 inclusive.
   *
   * Same as adding [^characters] to the regex.
   *
   * @param characters The characters expected to be in the pattern
   */
  public containsAnyExceptCharacterOf(characters: string) {
    return this.append(`[^${characters}]`);
  }

  /**
   * Adds a check for any digit (0-9) to appear as the next character
   *
   * i.e. digit() => can match for "0" "9" and everything between
   *
   * Same as adding \d to the regex
   *
   */
  public digit() {
    return this.append("\\d");
  }

  /**
   * Adds a check for any non digit (0-9) to appear as the next character
   *
   * i.e. digit() => won't match for "0" "9" and everything between
   *
   * Same as adding \D to the regex
   *
   */
  public nonDigit() {
    return this.append("\\D");
  }

  /**
   * Adds a check for any "word character" to appear as the next character, this means
   * any character in the english alphabet (a-z or A-Z) , any digit (0-9) as well as _
   *
   * i.e. wordCharacter() => can match for "a", "B", "y" "Z","0", "9",  "_" and every other letter and digit as well
   *
   * Same as adding \w to the regex.
   *
   */
  public wordCharacter() {
    return this.append("\\w");
  }

  /**
   * Adds a check for any non "word character" to appear as the next character, this means
   * any character in the english alphabet (a-z or A-Z) , any digit (0-9) as well as _
   *
   * i.e. wordCharacter() => won't match for "a", "B", "y" "Z","0", "9",  "_" and every other letter and digit as well
   *
   * Same as adding \W to the regex.
   *
   */
  public nonWordCharacter() {
    return this.append("\\W");
  }

  /**
   * Adds a check for any space character (i.e. space, tab, new line...) to appear as the next character
   *
   * Same as adding \s to the regex
   *
   */
  public space() {
    return this.append("\\s");
  }

  /**
   * Adds a check for any non space character (i.e. space, tab, new line...) to appear as the next character
   *
   * Same as adding \S to the regex
   *
   */
  public nonSpace() {
    return this.append("\\S");
  }

  /**
   * Adds a check for any character to appear, meaning it shouldn't match ""
   *
   * Same as adding . to the regex
   *
   */
  public any() {
    return this.append(".");
  }

  //#endregion

  //#region Boundaries

  /**
   * Adds a check if the following value is a word, meaning it's between
   * two non word characters (word characters are: a-z A-Z 0-9 and _)
   *
   * i.e. hasWord("ab") => can match for "ab" "test ab hi" and alike.
   *
   * Same as adding \bvalue\b to the regex
   *
   */
  public hasWord(value: string) {
    return this.append(`\\b${value}\\b`);
  }

  /**
   * Adds a check if the following value is a word prefix, meaning it's between
   * a non word character and a word character (a-z A-Z 0-9 and _) respectively.
   *
   * i.e. hasPrefix("ab") => can match for "abc" "test abd hi" and alike.
   *
   * Same as adding \bvalue\B to the regex
   *
   */
  public hasPrefix(value: string) {
    return this.append(`\\b${value}\\B`);
  }

  /**
   * Adds a check if the following value is a word suffix, meaning it's between
   * a word character (a-z A-Z 0-9 and _) and a non word character respectively.
   *
   * i.e. hasSuffix("ab") => can match for "cab" "test dab hi" and alike.
   *
   * Same as adding \Bvalue\b to the regex
   *
   */
  public hasSuffix(value: string) {
    return this.append(`\\B${value}\\b`);
  }

  /**
   * Adds a check if the following value is inside a word meaning it's between two
   * word characters (a-z A-Z 0-9 and _).
   *
   * i.e. hasSuffix("ab") => can match for "cab" "test dab hi" and alike.
   *
   * Same as adding \Bvalue\B to the regex
   *
   */
  public hasInsideWord(value: string) {
    return this.append(`\\B${value}\\B`);
  }

  //#endregion

  //#region Util Methods

  /**
   * Adds to the regex a check for if the following character is a english letter.
   *
   * Same as adding [a-zA-Z] to the regex.
   */
  public isLetter() {
    return this.append("[a-zA-Z]");
  }

  /**
   * Adds to the regex a check for if the following character is a english lowercase letter.
   *
   * Same as adding [a-z] to the regex.
   */
  public isLowercaseLetter() {
    return this.append("[a-z]");
  }

  /**
   * Adds to the regex a check for if the following character is a english uppercase letter.
   *
   * Same as adding [A-Z] to the regex.
   */
  public isUppercaseLetter() {
    return this.append("[A-Z]");
  }

  /**
   * Adds to the regex a check for if the following value is a integer.
   *
   * Same as adding ^(-?\d+)$ to the regex.
   */
  public isInteger() {
    return this.append("^(-?\\d+)$");
  }

  /**
   * Adds to the regex a check for if the following value is a decimal.
   *
   * This matches 12.8, -0.5 and alike but not integers such as 6, 58 etc...
   *
   * Same as adding ^(-?\d*)[.,](\d+)$  to the regex.
   */
  public isDecimal() {
    return this.append("^(-?\\d*)[.,](\\d+)$");
  }

  /**
   * Adds to the regex a check for if the following value is a fraction.
   *
   * This only matches fraction with integers (-1/2, 2/3 ...) and not with decimals (12.5/6)
   *
   * Same as adding ^(-?\d+)[\/](-?\d+)$ to the regex.
   */
  public isFraction() {
    return this.append("^(-?\\d+)[/](-?\\d+)$");
  }
  /**
   * Adds to the regex a check for if the following value is a hexColor.
   *
   * Same as adding \B#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b to the regex.
   */
  public isHexColor() {
    return this.append("\\B#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b");
  }

  //#endregion
}
