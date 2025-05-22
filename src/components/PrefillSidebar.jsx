import Collapse from "./Collapse";

function PrefillSidebar({ fieldName = "", setFieldName, parentNodes = [] }) {
  const show = fieldName ? "show" : "";
  const globalElements = ["email", "id", "name"];
  const dataSources = [{title: "Action Properties", id:"actionProps"}, {title: "Client Organization Properties", id: "clientProps"}];



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
          <input className="form-control me-2" type="search" placeholder="Search" />
        </form>
        <ul className="navbar-nav mt-3 data-elements">
          {dataSources.map((source) => (
            <Collapse key={source.id} source={source} elements={globalElements} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrefillSidebar;
