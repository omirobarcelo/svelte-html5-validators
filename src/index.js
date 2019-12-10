import { get, writable } from "svelte/store";

/**
 * Add validators attributes to formElement
 * @param {HTMLElement} formElement
 * @param {string[]} validators
 */
function setValidators(formElement, validators) {
  validators.forEach(validator => {
    // Separate key and value
    const sepValidator = validator.split(":");
    switch (sepValidator[0]) {
      case "pattern":
        // The value of pattern might include : and thus be splitted previously
        // Join with : to get the intended value
        formElement.setAttribute(
          sepValidator[0],
          sepValidator.slice(1).join(":")
        );
        break;
      case "min":
      case "max":
      case "minlength":
      case "maxlength":
        formElement.setAttribute(sepValidator[0], sepValidator[1]);
        break;
      case "datetime":
      case "datetime-local":
        formElement.setAttribute("type", "datetime-local");
        break;
      case "date":
      case "email":
      case "month":
      case "password":
      case "tel":
      case "time":
      case "url":
      case "week":
        formElement.setAttribute("type", sepValidator[0]);
        break;
      case "required":
        formElement.setAttribute("required", "");
        break;
      case "disabled":
        formElement.setAttribute("disabled", "");
        break;
      default:
        break;
    }
  });
}

/**
 * Returns the form structure for the store
 * @param {HTMLFormControlsCollection} formElements
 * @param {{ formControlName: string[] }} validators formControlName is the key to the validators string array
 */
function getForm(formElements, validators) {
  return {
    entries: Object.entries(validators).map(([controlName]) => ({
      name: controlName,
      value: formElements[controlName].value,
      valid: formElements[controlName].validity.valid
    })),
    valid: Object.entries(validators).every(
      ([controlName]) => formElements[controlName].validity.valid
    )
  };
}

/**
 * Returns the form store with functions getControl --returns the control of a form, only available on validateOnChange--
 * and validate --manual validation, and applyValidators action
 * @param {{ formControlName: string[] }} validators formControlName is the key to the validators string array
 * @param {{ initialValidation: boolean; validateOnChange: boolean }} config initialValidation, validateOnChange are true by default
 */
export function buildForm(validators, config = {}) {
  config = Object.assign(
    { initialValidation: true, validateOnChange: true },
    config
  );
  let _form;
  const { subscribe, set, update } = writable({ entries: [], valid: true });

  return {
    form: {
      subscribe,
      getControl(formControlName) {
        return get(this).entries.find(entry => entry.name === formControlName);
      },
      validate() {
        set(
          getForm(
            _form.elements,
            filterExistingValidators(_form.elements, validators)
          )
        );
      },
      clear() {
        update(({ entries }) => ({
          entries: entries.map(entry => ({
            name: entry.name,
            value: undefined,
            valid: false
          })),
          valid: false
        }));
      }
    },
    applyValidators: node => {
      _form = node;
      Object.entries(
        filterExistingValidators(_form.elements, validators)
      ).forEach(([controlName, arrValidators]) =>
        setValidators(_form.elements[controlName], arrValidators)
      );
      if (config.initialValidation) {
        set(
          getForm(
            _form.elements,
            filterExistingValidators(_form.elements, validators)
          )
        );
      }
      if (config.validateOnChange) {
        const updateForm = () =>
          set(
            getForm(
              _form.elements,
              filterExistingValidators(_form.elements, validators)
            )
          );
        node.addEventListener("input", updateForm);
        return {
          destroy() {
            node.removeEventListener("input", updateForm);
          }
        };
      }
    }
  };
}

/**
 * Filters the validators that exist in the form
 * @param {HTMLFormControlsCollection} formElements
 * @param {{ formControlName: string[] }} validators formControlName is the key to the validators string array
 */
function filterExistingValidators(formElements, validators) {
  const existingValidators = {};
  Object.entries(validators).forEach(([controlName, arrValidators]) => {
    if (formElements[controlName]) {
      existingValidators[controlName] = arrValidators;
    }
  });
  return existingValidators;
}
