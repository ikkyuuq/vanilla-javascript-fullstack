// Controller.init()

/**
 * @typedef {import('./viewBase.js').default} View
 * @typedef {import('./service.js').default} Service
 */
export default class Controller {
  /** @type {View} */
  #view;

  /** @type {Service} */
  #service;

  /** @param {{view: View, service: Service}} */
  constructor({ view, service }) {
    this.#view = view;
    this.#service = service;
  }

  /** @param {{view: View, service: Service}} */
  static async init(view, service) {
    const controller = new Controller(view, service);
    await controller.#init();
    return controller;
  }

  #isValid(data) {
    return data.name && data.age && data.email;
  }

  async #onSumbit({ name, age, email }) {
    if (!this.#isValid({ name, age, email })) {
      this.#view.notify({ msg: "Please fill form fields.", isError: true });
      return;
    }
    this.#view.notify({ msg: `Successful added ${name} account` });
    this.#view.addRow({ name, age, email });
    this.#view.resetForm();

    try {
      await this.#service.createUser({ name, age, email });
    } catch (err) {
      this.#view.notify({ msg: "server is not available", isError: true });
    }
  }

  async #getUsersFromAPI() {
    try {
      const result = await this.#service.getUsers();
      return result;
    } catch (err) {
      this.#view.notify({ msg: "Server is not available", isError: true });
      return [];
    }
  }

  async #init() {
    this.#view.configureFormSubmit(this.#onSumbit.bind(this));
    this.#view.configureFormClear();

    const data = await this.#getUsersFromAPI();
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
      ...data,
    ];

    this.#view.render(INITIAL_DATA);
  }
}
