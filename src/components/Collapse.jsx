import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { NodeContext, PrefillContext } from "../context/ContextProvider";

function Collapse({
  source = {},
  fieldName,
  setFieldName,
  displayedDataSources,
}) {
  const { elements, id, title } = source;

  const [down, setDown] = useState();
  const { prefill, setPrefill } = useContext(PrefillContext);
  const { nodeId } = useContext(NodeContext);

  useEffect(() => {
    const collapseElement = document.getElementById("collapse-" + id);
    if (collapseElement) {
      setDown([...collapseElement.classList].includes("show"));
    }
  }, [displayedDataSources]);

  function handleClick(event) {
    const { innerText } = event.target;
    const field = fieldName.split(".")[1];

    const prefillCopy = { ...prefill };
    prefillCopy[nodeId][field] = title + "." + innerText;
    setPrefill(prefillCopy);
    setFieldName("");
  }

  return (
    <li>
      <button
        className="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapse-" + id}
        aria-expanded="false"
        aria-controls={"collapse-" + id}
        onClick={() => setDown((prev) => !prev)}
      >
        <FontAwesomeIcon icon={down ? faAngleDown : faAngleRight} /> {title}
      </button>
      <div className="collapse" id={"collapse-" + id}>
        <ul style={{ listStyleType: "none" }}>
          {elements.map((el) => (
            <li key={el}>
              <button className="btn" onClick={handleClick}>
                {el}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default Collapse;
