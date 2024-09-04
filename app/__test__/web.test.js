import assert from "node:assert";
import { before, describe, it } from "node:test";
import View from "../src/platforms/web/view.js";
import Controller from "../src/shared/controller.js";

const getDocument = (mock, inputs) => {
  globalThis.alert = mock.fn((message) => {});
  globalThis.document = {
    createElement: mock.fn((element) => {
      return {
        classList: {
          add: mock.fn((className) => {}),
        },
      };
    }),
    querySelector: mock.fn((attribute) => {
      const key = attribute.replace("#", "");
      const value = inputs[key] ?? "test";
      return {
        addEventListener: mock.fn((event, fn) => {
          return fn({
            preventDefault: () => {},
          });
        }),
        appendChild: mock.fn((childElement) => {}),
        reset: mock.fn(() => {}),
        value,
      };
    }),
  };
  return globalThis.document;
};

describe("Web app test suite", () => {
  let _controller;
  it("given valid input, should update the table data", async (context) => {
    const document = getDocument(context.mock, {
      name: "test",
      age: "test",
      email: "test",
    });
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

    // This is getting 4 items because of mock data test has been added into
    assert.strictEqual(addRow.mock.callCount(), 4);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    // This should be increase by 1 after getting submit with valid data
    assert.strictEqual(addRow.mock.callCount(), 5);

    assert.deepStrictEqual(addRow.mock.calls.at(2).arguments.at(0), {
      Name: "Kittipong Prasompong",
      Age: 21,
      Email: "the.kittipongpras@gmail.com",
    });
  });
  it("given invalid data, should call alert with message", async (context) => {
    const document = getDocument(context.mock, {
      name: "",
      age: "",
      email: "",
    });
    const view = new View();
    const addRow = context.mock.method(view, view.addRow.name);
    const notify = context.mock.method(view, view.notify.name);
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

    // This should not be increase, because the mock data is invalid
    // so addRow it must not get call
    assert.strictEqual(addRow.mock.callCount(), 3);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    // and Again, It failed to Submit then it should still have 3 items
    assert.strictEqual(addRow.mock.callCount(), 3);

    assert.deepStrictEqual(addRow.mock.calls.at(1).arguments.at(0), {
      Name: "Kittipong Prasompong",
      Age: 21,
      Email: "the.kittipongpras@gmail.com",
    });

    assert.strictEqual(
      notify.mock.calls.at(0).arguments.at(0).msg,
      "Please fill form fields.",
    );

    assert.strictEqual(
      alert.mock.calls.at(0).arguments.at(0),
      "Please fill form fields.",
    );
  });
});
