import { useContext, useEffect, useState } from "react";
import Collapse from "./Collapse";
import { GraphContext } from "../context/ContextProvider";

function PrefillSidebar({ fieldName = "", setFieldName, parentNodes = [] }) {
  const { graph } = useContext(GraphContext);
  const [show, setShow] = useState();
  const [globalElements, setGlobalElement] = useState(["email", "id", "name"]);
  const [dataSources, setDataSources] = useState([
    { title: "Action Properties", id: "actionProps", elements: globalElements },
    {
      title: "Client Organization Properties",
      id: "clientProps",
      elements: globalElements,
    },
  ]);

  useEffect(() => {
    const parentSources = [];
    for (let id of parentNodes) {
      let node = graph.nodes.filter((f) => f.id === id)[0];
      const { name, component_id } = node.data;

      const form = graph.forms.filter((f) => f.id === component_id)[0];
      const elements = Object.keys(form.field_schema.properties);

      const source = { title: name, id, elements };
      parentSources.push(source);
    }
    parentSources.sort(sortSources);
    setDataSources(dataSources.concat(parentSources));
  }, [parentNodes]);

  useEffect(() => {
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
          />
        </form>
        <ul className="navbar-nav mt-3 data-elements">
          {dataSources.map((source) => (
            <Collapse key={source.id} source={source} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrefillSidebar;
