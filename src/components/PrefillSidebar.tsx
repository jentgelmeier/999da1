import { useContext, useEffect, useState } from "react";
import Collapse from "./Collapse";
import { GraphContext } from "../context/ContextProvider";
import { SetString } from "../types";

function PrefillSidebar({
  fieldName = "",
  setFieldName,
  parentNodes = [],
}: {
  fieldName: string;
  setFieldName: SetString;
  parentNodes: string[];
}) {
  const globalElements = ["email", "id", "name"];

  const { graph } = useContext(GraphContext);

  const [search, setSearch] = useState("");
  const [show, setShow] = useState();
  // there are 2 data sources states: one to display, which gets filtered by the search input,
  // and one that stays unchanged that can be used to reshow all data sources when the search input is cleared
  const [displayedDataSources, setDisplayedDataSources] = useState([]);
  const [fullDataSources, setFullDataSources] = useState([
    { title: "Action Properties", id: "actionProps", elements: globalElements },
    {
      title: "Client Organization Properties",
      id: "clientProps",
      elements: globalElements,
    },
  ]);

  useEffect(() => {
    const parentSources = [];
    // loop through parentNodes and format data to add to data sources
    for (let id of parentNodes) {
      let node = graph.nodes.filter((f) => f.id === id)[0];
      const { name, component_id } = node.data;

      const form = graph.forms.filter((f) => f.id === component_id)[0];
      const elements = Object.keys(form.field_schema.properties);

      const source = { title: name, id, elements };
      parentSources.push(source);
    }
    parentSources.sort(sortSources);

    setFullDataSources(fullDataSources.concat(parentSources));
    // use JSON.parse and JSON.stringify to create a deep copy;
    // otherwise, fullDataSources will get change along with displayedDataSources
    setDisplayedDataSources(
      JSON.parse(JSON.stringify(fullDataSources.concat(parentSources)))
    );
  }, [parentNodes]);

  useEffect(() => {
    // show the sidebar based on whether there is a fieldName selected
    setShow(fieldName ? "show" : "");
  }, [fieldName]);

  function sortSources(a, b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }

  function handleSearchChange(event) {
    const { value } = event.target;
    setSearch(value);

    if (value) {
      // expand collapses
      const collapses = document.getElementsByClassName("collapse");
      for (let collapse of collapses) {
        collapse.classList.add("show");
      }
      // filter datasources
      const displayedCopy = [...displayedDataSources];
      for (let source of displayedCopy) {
        source.elements = source.elements.filter((el) =>
          el.includes(value.toLowerCase().trim())
        );
      }
      setDisplayedDataSources(displayedCopy);
    } else {
      //re-dispaly all data sources
      setDisplayedDataSources(JSON.parse(JSON.stringify(fullDataSources)));
    }
  }

  return (
    <div
      className={show + " offcanvas offcanvas-start"}
      tabIndex="-1"
      id="offcanvasNavbar"
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
          {displayedDataSources.map((source) => (
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
