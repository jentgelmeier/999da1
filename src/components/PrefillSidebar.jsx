import Collapse from "./Collapse";

function PrefillSidebar({ fieldName = "", setFieldName }) {
  const show = fieldName ? "show" : "";
  const globalElements = ["email", "id", "name"];
  const dataSources = [{title: "Action Properties", id:"actionProps"}, {title: "Client Organization Properties", id: "clientProps"}];

  return (
    <div
      class={show + " offcanvas offcanvas-start"}
      tabindex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">
          Select data element to map to
        </h5>
        <button
          type="button"
          class="btn-close"
          onClick={() => setFieldName("")}
        />
      </div>
      <h4 class="ps-4">{fieldName}</h4>
      <hr className="mx-4" />
      <div class="offcanvas-body">
        <div>Avalable Data</div>
        <form class="d-flex mt-3" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" />
        </form>
        <ul class="navbar-nav mt-3 data-elements">
          {dataSources.map((source) => (
            <Collapse key={source.id} source={source} elements={globalElements} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrefillSidebar;
