import assert from "node:assert";
import { before, describe, it, mock } from "node:test";
import ViewBase from "../src/shared/viewBase.js";
import Controller from "../src/shared/controller.js";
import Service from "../src/shared/service.js";

const generateView = () => {
  class View extends ViewBase {
    configureFormClear = mock.fn();
    configureFormSubmit = mock.fn();
    resetForm = mock.fn();
    notify = mock.fn();
    addRow = mock.fn();
    render = mock.fn();
  }

  return new View();
};

describe("#Controller unit test", () => {
  it("#init", async () => {
    const API_URL = "http://localhost:3000";
    const view = generateView();
    const service = new Service({ url: API_URL });
    await Controller.init({
      view,
      service,
    });
    const data = await service.getUsers();

    const configureFormSubmit = view.configureFormSubmit.mock.callCount();
    assert.strictEqual(configureFormSubmit, 1);
    const configureFormClear = view.configureFormClear.mock.callCount();
    assert.strictEqual(configureFormClear, 1);

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

    const render = view.render.mock.calls.at(0).arguments.at(0);
    assert.deepStrictEqual(render, INITIAL_DATA);
    0;
  });
});
