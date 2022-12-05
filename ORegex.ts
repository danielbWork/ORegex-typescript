/**
 * Class that you use to build your regex easily while using or knowing 0 regex
 *
 * Most methods return the the ORegex to allow chaining.
 */
export class ORegex {
  // TODO Add all symbols in documentation to inform users about how to block them and maybe method
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

  // TODO decide what to do with this mess maybe have multiple methods for each flag
  /**
   * Searches the given value for matches of the regex
   *
   * Same as calling value.match(new RegExp(oregex.build(), "g"));
   *
   * @param value The string we match the regex with
   * @returns The results of the search in a array or null if nothing was found
   */
  public allMatchesIn(value: string) {
    return value.match(new RegExp(this.regex, "g"));
  }

  /**
   * Returns how many matches of the regex are in the given value
   * @param value The value we check how many times the regex is in it
   * @returns The number of matches in the value
   */
  public countOfMatchesIn(value: string) {
    return this.allMatchesIn(value)?.length || 0;
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
  public canHave(sequence?: string) {
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
  public hasAmount(amount: number, sequence?: string): ORegex {
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
  public hasAmountInRange(min: number, max?: number, sequence?: string) {
    const sequencePrefix = sequence ? `(${sequence})` : "";

    return this.append(`${sequencePrefix}{${min},${max ?? ""}}`);
  }
}
