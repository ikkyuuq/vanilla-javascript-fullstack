// Controller.init()
/**
 * @typedef {import('./viewBase.js').default} View
 */
export default class Controller {
  /** @type {View} */
  #view;
  /** @param {{view: View}} */
  constructor({ view }) {
    this.#view = view;
  }

  /** @param {{view: View}} deps */
  static init(deps) {
    const controller = new Controller(deps);
    controller.#init();
    return controller;
  }

  #isValid(data) {
    return data.name && data.age && data.email;
  }

  #onSumbit({ name, age, email }) {
    if (!this.#isValid({ name, age, email })) {
      this.#view.notify({ msg: "Please fill form fileds.", isError: true });
      return;
    }
    this.#view.notify({ msg: `Successful added ${name} account` });
    this.#view.addRow({ name, age, email });
    this.#view.resetForm();
  }

  #init() {
    this.#view.configureFormSubmit(this.#onSumbit.bind(this));
    this.#view.configureFormClear();
    const INITIAL_DATA = [
      {
        name: "Kittipong Prasompong",
        age: 21,
        email: "kittipongprasompong@gmail.com",
      },
      {
        name: "Kittipong Prasompong",
        age: 21,
        email: "the.kittipongpras@gmail.com",
      },
      { name: "Kittipong Prasompong", age: 21, email: "kittipong.pras@ku.th" },
    ];

    this.#view.render(INITIAL_DATA);
  }
}
