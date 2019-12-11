# Svelte HTML5 Validators

![npm](https://img.shields.io/npm/v/svelte-html5-validators)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/svelte-html5-validators)
![GitHub](https://img.shields.io/github/license/omirobarcelo/svelte-html5-validators)

Simple library that adds validator attributes --required, min, maxlength...-- to form elements using Svelte. By directly adding these attributes to the form elements, the native HTML5 validation controls can be used. That includes the pseudo-classes `valid` and `invalid` to style form elements according to its validity status.

## Install
`npm i svelte-html5-validators`  
or  
`yarn add svelte-html5-validators`

## How to use
```javascript
<script>
  import { buildForm } from "svelte-html5-validators";

  const { form, applyValidators } = buildForm({ 
    "name": ["required", "pattern:^[A-Z][a-zA-Z\\s]*$"],
  }, { initialValidation: true, validateOnChange: true });

  let formData = {
    name: "world"
  };
</script>

<style type="text/scss">
  input {
    &:invalid {
      border: 2px dashed red;
    }

    &:valid {
      border: 2px solid black;
    }
  }
</style>

<form use:applyValidators>
  <input
    type="text"
    name="name"
    bind:value={formData.name} />
</form>
```

## API
### `buildForm(validators: FieldValidators, config: Config = {}): { form: Form; applyValidators: SvelteAction }`
Returns a [Form object](#form-object) and the `applyValidators` action, which uses the validators given as the first parameters.

As second parameter you can pass a configuration object. The possible options are as follow:  

| **Property**   |      **Description**      |  **Default** |
|----------|-------------|------|
| initialValidation | Set to true if you want to perform an initial validation check  | true |
| validateOnChange | Set to true if you want to perform a validation check after every input   | true |


### `applyValidators: SvelteAction `
A Svelte [action](https://svelte.dev/docs#use_action) to use on the form HTML element. Finds all the form elements (input, textarea, select) and adds the validators given to `buildForm`. 

It is necessary to give to all the form elements, or at least to the ones where you want to apply validators, an `id` or `name` attribute. In either case, there exists a form element and a validator for it is not provided or a validator is defined for a not added form element, `applyValidators` will not error out.

#### Field Validators Object
Object to be provided to the `buildForm` function. The properties for this object are the form elements `id` or `name` attributes, and the assigned value to each property is a string array with the validators.  
The validators that require a value (e.g.: min) are on the form `min:6`.

```
{ "name": ["required", "minlength:6"], "age": ["min:0", "max:99"] }

<input type="text" name="name" />
<input type="number" name="age" />
```

#### Form Object
Svelte [store](https://svelte.dev/docs#svelte_store) returned by the `buildForm` function. This store provides the object value, the `getControl` function, and the `validate` function.

##### Value
> ```javascript
> {
>   entries: {
>     name: string;
>     value: any;
>     valid: boolean;
>   }[];
>   valid: boolean
> }
> ```

`entries` is an array of objects. Each entry has `name`, the control name of the form element; value, the value of the form element; and valid, the validity of the form element.  
`valid` indicates the entire form validity.

##### `getControl: (formControlName: string) => { name: string; value: any; valid: boolean }`
Returns the entry of the given `formControlName` of the form object.

##### `validate: () => void`
Checks the validity of the form and updates the form object with the current form data.

##### `clear: () => void`
Clears the form object --undefines the values from each entry-- and invalidates each entry and the form. If you want to check if the form object is valid after clearing it, you will need to execute `validate`.

## Validators
### required
> `{ "control": ["required"] }`  

Adds the attribute `required` to the form element with `id` or `name` control.  
Valid when it has some value.

### disabled
> `{ "control": ["disabled"] }`  

Adds the attribute `disabled` to the form element with `id` or `name` control.  
Blocks editing of the form element.

### pattern
> `{ "control": ["pattern:^[A-Z][a-zA-Z\\s]*$"] }`  

Adds the attribute `pattern` with the pattern given after the : to the form element with `id` or `name` control.  
Valid when the value matches the pattern.

### min
> `{ "control": ["min:3"] }`  

Adds the attribute `min` with the given argument to the form element with `id` or `name` control.  
Valid for inputs of type `range`, `number`, `date`, `month`, `week`, `datetime`, `datetime-local`, and `time` when the value is higher than the given argument.

### max
> `{ "control": ["max:30"] }`  

Adds the attribute `max` with the given argument to the form element with `id` or `name` control.  
Valid for inputs of type `range`, `number`, `date`, `month`, `week`, `datetime`, `datetime-local`, and `time` when the value is lower than the given argument.

### minlength
> `{ "control": ["minlength:3"] }`  

Adds the attribute `minlength` with the given argument to the form element with `id` or `name` control.  
Valid for inputs of type `text`, `search`, `url`, `tel`, `email`, `password`, and also on textareas when the number of characters is larger than the given argument.

### maxlength
> `{ "control": ["maxlength:30"] }`  

Adds the attribute `maxlength` with the given argument to the form element with `id` or `name` control.  
Valid for inputs of type `text`, `search`, `url`, `tel`, `email`, `password`, and also on textareas when the number of characters is smaller than the given argument.

### datetime
> `{ "control": ["datetime"] }`  

Sets the input's attribute `type` with `id` or `name` control to `datetime-local`.  
Valid when the value is a datetime.

### datetime-local
> `{ "control": ["datetime-local"] }`  

Sets the input's attribute `type` with `id` or `name` control to `datetime-local`.  
Valid when the value is a datetime.

### date
> `{ "control": ["date"] }`  

Sets the input's attribute `type` with `id` or `name` control to `date`.  
Valid when the value is a date.

### time
> `{ "control": ["time"] }`  

Sets the input's attribute `type` with `id` or `name` control to `time`.  
Valid when the value is a time.

### month
> `{ "control": ["month"] }`  

Sets the input's attribute `type` with `id` or `name` control to `month`.  
Valid when the value is a month.

### week
> `{ "control": ["week"] }`  

Sets the input's attribute `type` with `id` or `name` control to `week`.  
Valid when the value is a week.

### email
> `{ "control": ["email"] }`  

Sets the input's attribute `type` with `id` or `name` control to `email`.  
Valid when the value is an e-mail address.

### tel
> `{ "control": ["tel"] }`  

Sets the input's attribute `type` with `id` or `name` control to `tel`.  
Valid when the value is a telephone number.

### url
> `{ "control": ["url"] }`  

Sets the input's attribute `type` with `id` or `name` control to `url`.  
Valid when the value is an URL.

### password
> `{ "control": ["password"] }`  

Sets the input's attribute `type` with `id` or `name` control to `password`.  
Hides the value of the form element.
