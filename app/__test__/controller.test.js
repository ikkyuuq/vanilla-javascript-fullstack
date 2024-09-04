import assert from "node:assert";
import { before, describe, it, mock } from "node:test";
import ViewBase from "../src/shared/viewBase.js";
import Controller from "../src/shared/controller.js";

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
  it("#init", () => {
    const view = generateView();
    Controller.init({
      view,
    });

    const configureFormSubmit = view.configureFormSubmit.mock.callCount();
    assert.strictEqual(configureFormSubmit, 1);
    const configureFormClear = view.configureFormClear.mock.callCount();
    assert.strictEqual(configureFormClear, 1);

    const INITIAL_DATA = [
      {
        Name: "Kittipong Prasompong",
        Age: 21,
        Email: "kittipongprasompong@gmail.com",
      },
      {
        Name: "Kittipong Prasompong",
        Age: 21,
        Email: "the.kittipongpras@gmail.com",
      },
      { Name: "Kittipong Prasompong", Age: 21, Email: "kittipong.pras@ku.th" },
    ];

    const render = view.render.mock.calls.at(0).arguments.at(0);
    assert.deepStrictEqual(render, INITIAL_DATA);
    0;
  });
});
