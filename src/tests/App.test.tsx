import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import App from "../App";
import NodeList from "../components/NodeList";
import Prefill from "../components/Prefill";

import { ContextProvider } from "../context/ContextProvider";

import { graphJSON } from "./graph";
import { nodeSort } from "../utils";


// describe("NodeList tests", () => {
// function renderWithContext (child: ReactElement, value: any) {
//   return render(
//     <ContextProvider value={value}>
//       {child}
//     </ContextProvider>
//   )
// };

test("sample", async () => {
  render(<App testGraph={graphJSON} />);
    const linkElement = screen.getByText(/form A/i);

    const user = userEvent.setup();
    await user.click(linkElement)
      expect(screen.getByRole('heading')).toBeInTheDocument();


})

//   test("renders the nodes from graph.json in alphabetical order (Forms A-F in this example)", () => {
//     render(
//       <ContextProvider value={{graph: graphJSON}}>
//         <NodeList />
//       </ContextProvider>,
//       { wrapper: MemoryRouter }
//     );

//     const sortedGraph = graph.nodes.sort(nodeSort);
//     for (let i = 0; i < sortedGraph.length; i++) {
//       const linkElement = screen.getByText(
//         new RegExp(sortedGraph[i].data.name)
//       );
//       expect(linkElement).toHaveTextContent(sortedGraph[i].data.name);

//       if (i > 0) {
//         const previousLinkElement = screen.getByText(
//           new RegExp(sortedGraph[i - 1].data.name)
//         );
//         // eslint-disable-next-line jest/no-conditional-expect
//         expect(
//           previousLinkElement.compareDocumentPosition(linkElement)
//         ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
//       }
//     }
//   });

//   // test("renders forms a-e", async () => {
//   //   render(<NodeList graph={graph} />, { wrapper: MemoryRouter });

//   //   const linkElement = screen.getByText(/form a/i);
//   //   const user = userEvent.setup();
//   //   await user.click(linkElement);

//   //   expect(screen.getByText("Prefill fields for Form A")).toBeInTheDocument();
//   // });
// });

// describe("Prefill tests", () => {
//   test("Prefill renders Node name", () => {
//     render(
//       <ContextProvider>
//         <Prefill />
//       </ContextProvider>,
//       { wrapper: MemoryRouter }
//     );

//     const heading = screen.getByRole("heading", { name: "Prefill" });
//     expect(heading).toHaveTextContent(/Prefill/);
//   });
// });
