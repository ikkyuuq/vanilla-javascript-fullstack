import ViewBase from "./../../shared/viewBase.js";

export default class View extends ViewBase {
  #form = document.querySelector("#form");
  #btn_form_clear = document.querySelector("#btnFormClear");

  #table_body = document.querySelector(".flex-table");

  #name = document.querySelector("#name");
  #age = document.querySelector("#age");
  #email = document.querySelector("#email");

  addRow(data) {
    const row = document.createElement("div");
    row.classList.add("flex-table-row");

    row.innerHTML = `
      <div>${data.name}</div>
      <div>${data.age}</div>
      <div>${data.email}</div>
    `;

    this.#table_body.appendChild(row);
  }

  /**
   * Configures the form submission behavior.
   * When the form is submitted, the provided callback function is executed with the form data.
   * @param {Function} fn - The callback function to execute on form submission.
   * @returns {void}
   */
  configureFormSubmit(fn) {
    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = this.#name.value;
      const age = this.#age.value;
      const email = this.#email.value;

      return fn({ name, age, email });
    });
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
        alert(msg);
        break;
      case false:
        alert(msg);
        break;
      default:
        alert("Something went wrong!");
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
    this.#btn_form_clear.addEventListener("click", () => {
      this.resetForm();
    });
  }

  /**
   * Resets the form fields to their initial state.
   * @returns {void}
   */
  resetForm() {
    this.#form.reset();
  }

  /**
   * Adds a new row of data to the display.
   * This method can be adapted to render data in different ways.
   * @param {FormData[]} items - The data to add.
   * @returns {void}
   */
  render(items) {
    items.forEach((item) => this.addRow(item));
  }
}
