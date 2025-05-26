import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

import { graphJSON } from "./graph";
import { nodeSort } from "../utils";

// helper functions
async function navtoPrefill(formName: string): Promise<void> {
  const linkElement = screen.getByText(new RegExp(formName as string));

  const user = userEvent.setup();
  await user.click(linkElement);
}

async function openSidebar(formName: string, fieldName: string): Promise<void> {
  await navtoPrefill(formName);

  const fieldElement = screen.getByDisplayValue(fieldName);
  const user = userEvent.setup();
  await user.click(fieldElement);
}

async function clickButton(text: string, flag: string): Promise<void> {
  let button: Element | null = null;
  if (flag === "text") {
    button = screen.getByText(text);
  } else if (flag === "testid") {
    button = screen.getByTestId(text);
  } else {
    return;
  }
  const user = userEvent.setup();
  await user.click(button);
}

async function typeSearch(text: string): Promise<void> {
  const user = userEvent.setup();
  const searchElement = screen.getByPlaceholderText("Search");
  await user.type(searchElement, text);
}

describe("NodeList tests", () => {
  test("Home page renders the nodes from graph.json in alphabetical order (Forms A-F in this example)", () => {
    render(<App testGraph={graphJSON} />);

    const sortedGraph = graphJSON.nodes.sort(nodeSort);
    for (let i = 0; i < sortedGraph.length; i++) {
      const linkElement = screen.getByText(
        new RegExp(sortedGraph[i].data.name)
      );

      // check that Form A-F are presen
      expect(linkElement).toHaveTextContent(sortedGraph[i].data.name);

      // check that Forms are in alphabetical order
      if (i > 0) {
        const previousLinkElement = screen.getByText(
          new RegExp(sortedGraph[i - 1].data.name)
        );
        // eslint-disable-next-line jest/no-conditional-expect
        expect(
          previousLinkElement.compareDocumentPosition(linkElement)
        ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
      }
    }
  });

  test("clicking on form navigates to /prefill for that node", async () => {
    render(<App testGraph={graphJSON} />);

    const formName = graphJSON.nodes[0].data.name;
    await navtoPrefill(formName);

    const prefillHeading = screen.getByRole("heading", { name: "Prefill" });
    const textElement = screen.getByText(new RegExp(formName));
    expect(prefillHeading).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });
});

describe("Prefill tests", () => {
  test("Prefill renders correct fields for given node", async () => {
    render(<App testGraph={graphJSON} />);
    const node = graphJSON.nodes[0];

    await navtoPrefill(node.data.name);

    const form = graphJSON.forms.filter(
      (f) => f.id === node.data.component_id
    )[0];
    const fields = Object.keys(form.field_schema.properties);

    for (let field of fields) {
      const fieldElement = screen.getByDisplayValue(new RegExp(field, "i"));
      expect(fieldElement).toBeInTheDocument();
    }
  });

  test("clicking field input sets field name in sidebar and disables Prefill text inputs when sidebar opens", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form A";
    const fieldName = "email";

    await openSidebar(formName, fieldName);

    const modalHeader = screen.getByRole("heading", {
      name: formName + "." + fieldName,
    });
    expect(modalHeader).toBeInTheDocument();

    const fieldElement = screen.getByDisplayValue(fieldName);
    expect(fieldElement).toBeDisabled();
  });

  test("clicking X on field input clears prefill for and enables that field", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form A";
    const fieldName = "email";

    await openSidebar(formName, fieldName);
    await clickButton("Action Properties", "text");
    await clickButton("actionProps-" + fieldName, "testid");
    await clickButton("x-" + fieldName, "testid");

    const fieldElement = screen.getByDisplayValue(fieldName);
    expect(fieldElement).not.toBeDisabled();
  });
});

describe("PrefillSidebar tests", () => {
  test("modal shows all parent nodes + 2 globals. In this case, Form F displays Forms A-E", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form F";
    const fieldName = "email";

    await openSidebar(formName, fieldName);

    const actionPropsButton = screen.getByText("Action Properties");
    expect(actionPropsButton).toBeInTheDocument();

    const clientPropsButton = screen.getByText(
      "Client Organization Properties"
    );
    expect(clientPropsButton).toBeInTheDocument();

    ["A", "B", "C", "D", "E"].forEach((letter) => {
      const parentNode = screen.getByText("Form " + letter);
      expect(parentNode).toBeInTheDocument();
    });
  });

  test("clicking a data source button moves the icon arrow down when the collapse opens", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form A";
    const fieldName = "email";

    await openSidebar(formName, fieldName);

    const actionPropsArrowImg = screen.getByTestId("icon-actionProps");
    expect(actionPropsArrowImg).toHaveClass("fa-angle-right");

    await clickButton("Action Properties", "text");
    expect(actionPropsArrowImg).toHaveClass("fa-angle-down");
  });

  test("clicking a data source's field in the sidebar clears/closes the sidebar and sets prefill text input with that value", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form A";
    const fieldName = "email";

    await openSidebar(formName, fieldName);
    await clickButton("Action Properties", "text");
    await clickButton("actionProps-" + fieldName, "testid");

    expect(
      screen.queryByRole("heading", {
        name: formName + "." + fieldName,
      })
    ).not.toBeInTheDocument();

    const fieldElement = screen.getByDisplayValue(
      `${fieldName}: Action Properties.${fieldName}`
    );
    expect(fieldElement).toBeInTheDocument();
  });

  test("typing a field in the search bar filters each data source to show only that field.", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form B";
    const fieldName = "email";

    await openSidebar(formName, fieldName);
    await typeSearch(fieldName);

    expect(screen.getByTestId("actionProps-" + fieldName)).toBeInTheDocument();
    expect(screen.queryByTestId("actionProps-id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("actionProps-name")).not.toBeInTheDocument();

    expect(screen.getByTestId("clientProps-" + fieldName)).toBeInTheDocument();
    expect(screen.queryByTestId("clientProps-id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("clientProps-name")).not.toBeInTheDocument();

    expect(
      screen.getByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-" + fieldName
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-id")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-button")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-notes")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-name")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-multi_select"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-dynamic_checkbox_group"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-dynamic_object"
      )
    ).not.toBeInTheDocument();
  });

  test("clearing the search bar returns the full list of data sources", async () => {
    render(<App testGraph={graphJSON} />);
    const formName = "Form B";
    const fieldName = "email";

    await openSidebar(formName, fieldName);
    await typeSearch(fieldName);

    const searchElement = screen.getByPlaceholderText("Search");
    const user = userEvent.setup();
    await user.clear(searchElement);

    expect(screen.getByTestId("actionProps-" + fieldName)).toBeInTheDocument();
    expect(screen.getByTestId("actionProps-id")).toBeInTheDocument();
    expect(screen.getByTestId("actionProps-name")).toBeInTheDocument();

    expect(screen.getByTestId("clientProps-" + fieldName)).toBeInTheDocument();
    expect(screen.getByTestId("clientProps-id")).toBeInTheDocument();
    expect(screen.getByTestId("clientProps-name")).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-" + fieldName
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-id")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-button")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-notes")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-name")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-multi_select"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-dynamic_checkbox_group"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-dynamic_object"
      )
    ).toBeInTheDocument();
  });
});
