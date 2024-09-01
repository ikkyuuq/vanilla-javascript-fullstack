import assert from "node:assert";
import { before, describe, it } from "node:test";
import View from "../src/platforms/web/view.js";
import Controller from "../src/shared/controller.js";
import { warn } from "node:console";

const getDocument = (mock) => {
  globalThis.alert = (message) => {};
  globalThis.document = {
    createElement: mock.fn((element) => {
      return {
        classList: {
          add: mock.fn((className) => {}),
        },
      };
    }),
    querySelector: mock.fn((attribute) => {
      return {
        addEventListener: mock.fn((event, fn) => {
          return fn({
            preventDefault: () => {},
          });
        }),
        appendChild: mock.fn((childElement) => {}),
        reset: mock.fn(() => {}),
        value: "test_value",
      };
    }),
  };
  return globalThis.document;
};

describe("Web app test suite", () => {
  let _controller;
  before(() => {});
  it("given valid input, should update the table data", async (context) => {
    const document = getDocument(context.mock);
    const view = new View();
    const addRow = context.mock.method(view, view.addRow.name);
    _controller = Controller.init({
      view,
    });

    const [form, btn_form_clear, table_body, name, age, email] =
      document.querySelector.mock.calls;

    assert.strictEqual(form.arguments[0], "#form");
    assert.strictEqual(btn_form_clear.arguments[0], "#btnFormClear");
    assert.strictEqual(table_body.arguments[0], ".flex-table");
    assert.strictEqual(name.arguments[0], "#name");
    assert.strictEqual(age.arguments[0], "#age");
    assert.strictEqual(email.arguments[0], "#email");

    const onSubmit = form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();

    assert.strictEqual(addRow.mock.callCount(), 4);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    assert.strictEqual(addRow.mock.callCount(), 5);

    assert.deepStrictEqual(addRow.mock.calls.at(2).arguments.at(0), {
      name: "Kittipong Prasompong",
      age: 21,
      email: "the.kittipongpras@gmail.com",
    });
  });
});
