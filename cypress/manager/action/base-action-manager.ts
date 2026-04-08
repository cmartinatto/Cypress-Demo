/** *********************************************************************
 *
 * Base Action Manager
 *
 * This file contains functions that are common across all action
 * managers
 *
 ********************************************************************* */

export abstract class BaseActionManager {
  /**
   * Selects an option in a `<select>` element by matching partial option text.
   * @param selector - CSS selector of the `<select>` element.
   * @param text - Partial text to match against the option labels.
   */
  selectByPartialText(selector: string, text: string) {
    cy.get(selector)
      .find("option")
      .contains(text)
      .then((option) => {
        cy.get(selector).select(option.val() as string);
      });
  }
}
