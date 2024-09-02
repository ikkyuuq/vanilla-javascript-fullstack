import blessed from "blessed";
import contrib from "blessed-contrib";

export default class LayoutBuilder {
  #screen;
  #layout;
  #form;
  #inputs = {};
  #buttons = {};
  #alert = {
    success: () => {},
    failed: () => {},
  };

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title,
    });
    this.#screen.key(["escape", "q", "C-c"], () => process.exit(0));

    return this;
  }

  setLayout() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: "100%",
      height: "100%",
    });

    return this;
  }

  #createButton({ parent, name, content, bg, fg, left, bottom }) {
    const button = blessed.button({
      parent,
      name,
      content,
      left,
      bottom,
      style: {
        fg,
        bg,
        focus: { bg: `light${bg}` },
        hover: { bg: `light${bg}`, fg: `black` },
      },
      mouse: true,
      keys: true,
      shrink: true,
      padding: { left: 1, right: 1 },
      width: "shrink",
    });

    return button;
  }

  #createInputField({ parent, name, top, label }) {
    const input = blessed.textbox({
      parent,
      name,
      top,
      label,
      inputOnFocus: true,
      left: "center",
      width: "60%",
      height: "25%",
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "transparent",
      },
    });

    return input;
  }

  setFormSubmit({ onSubmit, onClear }) {
    const form = blessed.form({
      parent: this.#layout,
      keys: true,
      vi: false,
      width: "100%",
      height: "40%",
      top: 0,
      left: "center",
      label: "Users Form",
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "transparent",
      },
    });

    const nameInput = this.#createInputField({
      parent: form,
      name: "name",
      top: 1,
      label: "Name",
    });
    nameInput.focus();

    const ageInput = this.#createInputField({
      parent: form,
      name: "age",
      top: 4,
      label: "Age",
    });

    const emailInput = this.#createInputField({
      parent: form,
      name: "email",
      top: 7,
      label: "Email",
    });

    const submitButton = this.#createButton({
      parent: form,
      name: "submit",
      content: "Submit",
      bg: "green",
      fg: "white",
      left: "40%",
      bottom: 1,
    });

    const clearButton = this.#createButton({
      parent: form,
      name: "clear",
      content: "Clear",
      bg: "red",
      fg: "white",
      left: "52%",
      bottom: 1,
    });

    submitButton.on("press", () => {
      form.submit();
    });

    clearButton.on("press", () => {
      onClear();
    });

    form.on("submit", (data) => {
      onSubmit(data);
    });

    this.#form = form;

    this.#inputs.name = nameInput;
    this.#inputs.age = ageInput;
    this.#inputs.email = emailInput;

    this.#buttons.submit = submitButton;
    this.#buttons.clear = clearButton;

    return this;
  }

  setAlertComponent() {
    const createAlertBox = (type, bgColor) => {
      return blessed.box({
        parent: this.#form,
        width: "40%",
        height: "10%",
        left: "center",
        bottom: -1,
        style: {
          bg: bgColor,
          fg: "white",
        },
        content: "",
        tags: true,
        padding: {
          left: 1,
          right: 1,
        },
        align: "center",
        justify: "center",
        hidden: true,
      });
    };

    const setAlertMessage = (alertBox) => (msg) => {
      alertBox.setContent(`{bold}${msg}{/bold}`);
      alertBox.show();
      this.#screen.render();

      setTimeout(() => {
        alertBox.hide();
        this.#screen.render();
      }, 3000);
    };

    this.#alert.success = createAlertBox("success", "green");
    this.#alert.failed = createAlertBox("failed", "red");

    this.#alert.success.setMessage = setAlertMessage(this.#alert.success);
    this.#alert.failed.setMessage = setAlertMessage(this.#alert.failed);

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      layout: this.#layout,
      form: this.#form,
      alert: this.#alert,
    };

    components.screen.render();

    return components;
  }
}
