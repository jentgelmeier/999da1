import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Collapse({ source = {}, elements = [] }) {
  const { id, title } = source;
  const [down, setDown] = useState(false);
  return (
    <li>
      <button
        class="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapse-" + id}
        aria-expanded="false"
        aria-controls={"collapse-" + id}
        onClick={() => setDown((prev) => !prev)}
      >
        <FontAwesomeIcon icon={down ? faAngleDown : faAngleRight} /> {title}
      </button>
      <div class="collapse" id={"collapse-" + id}>
        <ul style={{ listStyleType: "none" }}>
          {elements.map((el) => (
            <li>
              <button class="btn">{el}</button>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default Collapse;
