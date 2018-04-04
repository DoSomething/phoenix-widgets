/* global window, document */
import 'json-editor';
import json from './schema.json';
import debounce from 'lodash.debounce';

// Reference to the extension API
const contentfulExtension = window.contentfulExtension;

/**
 * Custom JSON form editor widget for Contentful.
 * Displays a form generated by a JSON Schema. The form input will generate JSON.
 */
contentfulExtension.init((extension) => {
  extension.window.startAutoResizer();

  const editorElement = document.createElement('div');
  editorElement.classList.add('jfe-editor-root');
  document.body.appendChild(editorElement);

  const fieldId = extension.field.id;

  const editor = new window.JSONEditor(editorElement, {
    schema: json,
    no_additional_properties: true,
    required_by_default: true,
    startval: extension.field.getValue(),
    disable_collapse: true,
    disable_properties: true,
    show_errors: 'always',
  });

  const validateAndSave = debounce(() => {
    const errors = editor.validate();

    if (errors.length === 0) {
      const currentJSON = editor.getValue();
      console.log(currentJSON);
      extension.field.setValue(currentJSON);
    }
  }, 150);

  const inputChanged = () => {
    extension.window.updateHeight();
    validateAndSave();
  };

  editor.on('change', inputChanged);
});