import { useContext, useEffect, useState } from "react";

import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NodeContext, PrefillContext } from "../context/ContextProvider";
import { DataSource, PrefillType, SetString } from "../types";

interface CollapseProps {
  fieldName: string;
  setFieldName: SetString;
  displayedDataSources: DataSource[];
  source: DataSource;
}

function Collapse({
  source,
  fieldName,
  setFieldName,
  displayedDataSources,
}: CollapseProps) {
  const { elements, id, title } = source;

  const [down, setDown] = useState<Boolean>();
  const { prefill, setPrefill } = useContext(PrefillContext);
  const { nodeId } = useContext(NodeContext);

  useEffect(() => {
    const collapseElement = document.getElementById("collapse-" + id);
    if (collapseElement) {
      setDown(Array.from(collapseElement.classList).includes("show"));
    }
  }, [displayedDataSources]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { value } = event.target as HTMLButtonElement;
    const field: string = fieldName.split(".")[1];

    const prefillCopy: Partial<PrefillType> = { ...prefill };
    // @ts-ignore
    prefillCopy[nodeId][field] = title + "." + value;
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
        <FontAwesomeIcon data-testid={"icon-" + id} icon={down ? faAngleDown : faAngleRight} /> {title}
      </button>
      <div className="collapse" id={"collapse-" + id} >
        <ul style={{ listStyleType: "none" }}>
          {elements.map((el) => (
            <li key={el}>
              <button className="btn" value={el} data-testid={id + "-" + el} onClick={handleClick}>
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
