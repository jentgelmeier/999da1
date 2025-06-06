import { useContext, useEffect, useMemo, useState } from "react";

import Collapse from "./Collapse";

import { GraphContext } from "../context/ContextProvider";
import { DataSource, Node, SetString } from "../types";

function PrefillSidebar({
  fieldName = "",
  setFieldName,
  nodeId,
}: {
  fieldName: string;
  setFieldName: SetString;
  nodeId: string;
}) {
  const globalElements: string[] = ["email", "id", "name"];
  const globalDataSources: DataSource[] = [
    { title: "Action Properties", id: "actionProps", elements: globalElements },
    {
      title: "Client Organization Properties",
      id: "clientProps",
      elements: globalElements,
    },
  ];
  const query = useMemo(() => new URLSearchParams(window.location.search), []);

  const { graph } = useContext(GraphContext);

  const [search, setSearch] = useState<string>("");
  const [show, setShow] = useState<string>("");
  const [parentNodes, setParentNodes] = useState<string[]>([]);

  // there are 2 data sources states: one to display, which gets filtered by the search input,
  // and one that stays unchanged that can be used to reshow all data sources when the search input is cleared
  const [displayedDataSources, setDisplayedDataSources] = useState<
    DataSource[]
  >([]);
  const [fullDataSources, setFullDataSources] = useState<DataSource[]>(
    query.get("parent")?.includes("global") || !query.get("parent")
      ? globalDataSources
      : []
  );

  useEffect(() => {
    if (query.get("parent") !== "global") {
      setParentNodes(getParentNodes(query.get("parent")?.split(","), nodeId));
    }
  }, [graph]);

  useEffect(() => {
    if (
      !fullDataSources.length ||
      JSON.stringify(fullDataSources) === JSON.stringify(globalDataSources)
    ) {
      const parentSources: DataSource[] = [];
      // loop through parentNodes and format data to add to data sources
      for (let id of parentNodes) {
        let node: Node | undefined = graph?.nodes?.filter(
          (f) => f.id === id
        )[0];
        const { name, component_id } = node?.data;

        const form: Node | undefined = graph?.forms?.filter(
          (f) => f.id === component_id
        )[0];
        const elements: string[] = Object.keys(form?.field_schema.properties);

        const source: DataSource = { title: name, id, elements };
        parentSources.push(source);
      }
      parentSources.sort(sortSources);

      setFullDataSources(fullDataSources.concat(parentSources));
      // use JSON.parse and JSON.stringify to create a deep copy;
      // otherwise, fullDataSources will get changed along with displayedDataSources
      setDisplayedDataSources(
        JSON.parse(JSON.stringify(fullDataSources.concat(parentSources)))
      );
    }
  }, [parentNodes]);

  useEffect(() => {
    // show the sidebar based on whether there is a fieldName selected
    setShow(fieldName ? "show" : "");
  }, [fieldName]);

  function getParentNodes(
    flag: string[] | undefined,
    formId: string
  ): string[] {
    // use the spread operator here to create a copy; otherwise, I'd modify the graph.nodes.data.prerequisites object directly
    let currentParents: string[] = [
      ...(graph?.nodes?.filter((f) => f.id === formId)[0]?.data
        ?.prerequisites || []),
    ];

    if (flag?.includes("direct") && !flag?.includes("transitive")) {
      return currentParents;
    }

    let directParents: string[] = [];
    if (!flag?.includes("direct") && flag?.includes("transitive")) {
      directParents = [...currentParents];
    }

    let allParents: string[] = [];

    while (currentParents.length) {
      let currentId: string = currentParents.shift() as string;
      if (
        !allParents.includes(currentId) &&
        !directParents.includes(currentId)
      ) {
        allParents.push(currentId);
      }
      let nextParents: string[] = graph?.nodes?.filter(
        (f) => f.id === currentId
      )[0].data.prerequisites;
      currentParents = currentParents.concat(nextParents);
    }

    return allParents;
  }

  function sortSources(a: DataSource, b: DataSource) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target as HTMLInputElement;
    setSearch(value);

    if (value) {
      // expand collapses
      const collapses = Array.from(document.getElementsByClassName("collapse"));
      for (let collapse of collapses) {
        collapse.classList.add("show");
      }
      // filter datasources
      const displayedCopy = [...displayedDataSources];
      for (let source of displayedCopy) {
        source.elements = source.elements.filter((el: string) =>
          el.includes(value.toLowerCase().trim())
        );
      }
      setDisplayedDataSources(displayedCopy);
    } else {
      //re-display all data sources
      setDisplayedDataSources(JSON.parse(JSON.stringify(fullDataSources)));
    }
  }

  return (
    <div
      className={show + " offcanvas offcanvas-start"}
      tabIndex={-1}
      id="offcanvasNavbar"
      data-testid="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
          Select data element to map to
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setFieldName("")}
        />
      </div>
      <h4 className="ps-4">{fieldName}</h4>
      <hr className="mx-4" />
      <div className="offcanvas-body">
        <div>Avalable Data</div>
        <form className="d-flex mt-3" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
        </form>
        <ul className="navbar-nav mt-3 data-elements">
          {displayedDataSources.map((source: DataSource) => (
            <Collapse
              key={source.id}
              source={source}
              setFieldName={setFieldName}
              fieldName={fieldName}
              displayedDataSources={displayedDataSources}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrefillSidebar;
