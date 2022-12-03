/**
 * Class that you use to build your regex easily while using or knowing 0 regex
 *
 * Most methods return the the ORegex to allow chaining.
 */
export class ORegex {
  // TODO Check if we should use commands instead
  // TODO Add tests
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
   * Searches the given value matches of the regex
   *
   * Same as calling value.match(oregex.build());
   *
   * @param value The string we match the regex with
   * @returns The results of the search in the array or null if nothing was found
   */
  public matchesIn(value: string) {
    return value.match(this.regex);
  }

  // TODO add general contains and count method and array matches

  /**
   * Appends the given string to the regex
   * @param value The value we append to the regex
   */
  public append(value: string): ORegex {
    this.regex += value;
    return this;
  }

  /**
   * Adds to the regex a check for strings starting with the given string (Recommended to be called only once).
   *
   * The same as adding "^start" to the regex.
   *
   * @param start The string that should be at the start of checked strings
   */
  public startsWith(start: string) {
    return this.append(`^${start}`);
  }

  /**
   * Adds to the regex a check for strings ending with the given string (Recommended to be called only once).
   *
   * The same as adding "end$" to the regex.
   *
   * @param end The string that should be at the end of checked strings
   */
  public endsWith(end: string) {
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

  /**
   * Adds to the regex a check for strings containing the given string this is the same
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
   * Adds to the regex a check for strings containing any number of the given character,
   * if "character" param contains more then one character this effects only the last character in the param.
   *
   * The same as adding "character*" to the regex.
   *
   * @param character The character that can appear any number of time
   */
  public canHave(character: string) {
    return this.append(`${character}*`);
  }
}
