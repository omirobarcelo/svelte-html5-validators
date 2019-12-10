declare module "svelte-html5-validators";

export interface ValidatorsConfig {
  initialValidation: boolean;
  validateOnChange: boolean;
}

export interface Entry {
  name: string;
  value: any;
  valid: boolean;
}

export interface FormObject {
  /**
   * Svelte's store returned subscribe function
   */
  subscribe: any;
  /**
   * Returns the entry of the given formControlName of the form object
   * @param formControlName 
   */
  getControl(formControlName: string): Entry;
  /**
   * Checks the validity of the form and updates the form object with the current form data
   */
  validate(): void;
  /**
   * Clears the form object --undefines the values from each entry-- and invalidates each entry and the form
   * If you want to check if the form object is valid after clearing it, you will need to execute validate
   */
  clear(): void;
}

export = buildForm;

export declare function buildForm(
  validators: { [formControlName: string]: string[] },
  config: ValidatorsConfig = { initialValidation: true, validateOnChange: true }
): { form: FormObject; applyValidators(node: HTMLElement): { destroy(): void } };
