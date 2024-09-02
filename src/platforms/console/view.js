import ViewBase from "../../shared/viewBase.js";
import LayoutBuilder from "./layoutBuilder.js";

export default class View extends ViewBase {
  #layoutBuilder;
  #components;
  #onFormSubmit = () => {};
  #onFormClear = () => {};

  constructor(layoutBuilder = new LayoutBuilder()) {
    super();
    this.#layoutBuilder = layoutBuilder;
  }

  /**
   * Configures the form submission behavior.
   * When the form is submitted, the provided callback function is executed with the form data.
   * @param {Function} fn - The callback function to execute on form submission.
   * @returns {void}
   */
  configureFormSubmit(fn) {
    this.#onFormSubmit = (data) => {
      this.#isValid(data.name, data.age, data.email)
        ? this.notify(`Welcome ${data.name}`, false)
        : this.notify("Please fill all the fields.", true);
      return fn(data);
    };
  }

  /**
   * Resets the form fields to their initial state.
   * @returns {void}
   */
  resetForm() {
    this.#components.form.reset();
    this.#components.screen.render();
  }

  #isValid(data) {
    return data.name && data.age && data.email;
  }

  /**
   * Displays a notification to the user.
   * This method can be overridden to change how notifications are presented.
   * @param {Object} notification - The notification to display.
   * @param {string} notification.msg - The message to display to the user.
   * @param {boolean} notification.isError - Whether the message is an error.
   * @returns {void}
   */
  notify({ msg, isError = false }) {
    switch (isError) {
      case true:
        this.#components.alert.failed.setMessage(`${msg}`);
        break;
      case false:
        this.#components.alert.success.setMessage(`${msg}`);
        break;
    }
  }

  /**
   * Configures the clear action for the form.
   * When the clear button is clicked, the form fields are reset.
   * @param {Function} fn - The callback function to execute on form submission.
   * @returns {void}
   */
  configureFormClear(fn) {
    this.#onFormClear = () => {
      this.reset();
      return fn();
    };
  }

  /**
   * Adds a new row of data to the display.
   * This method can be adapted to render data in different ways.
   * @param {FormData} data - The data to add.
   * @returns {void}
   */
  addRow(data) {}

  // facade is the design pattern to execute many functions
  // and abstract the complexity
  #initializeComponentsFacade() {
    this.#components = this.#layoutBuilder
      .setScreen({ title: "Fullstack Vanilla JS" })
      .setLayout()
      .setFormSubmit({
        onSubmit: this.#onFormSubmit.bind(this),
        onClear: this.#onFormClear.bind(this),
      })
      .setAlertComponent()
      .build();
  }

  /**
   * Adds a new row of data to the display.
   * This method can be adapted to render data in different ways.
   * @param {FormData[]} items - The data to add.
   * @returns {void}
   */
  render(items) {
    this.#initializeComponentsFacade();
  }
  0;
}
