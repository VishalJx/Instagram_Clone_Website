import React from "react";
import { RiCloseLine } from "react-icons/ri";
import "../style/Modal.css";
import { useNavigate } from "react-router-dom";

function Modal({ setModalOpen }) {
  const navigate = useNavigate();
  return (
    <div className="darkBg" onClick={() => setModalOpen(false)}>  {/*on clicking on dark background the modal will be closed */}
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          <div className="modalContent">Do you really want to log out?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="logOutBtn"
                onClick={() => {
                  setModalOpen(false);  //to clear the modal from screen
                  localStorage.clear(); //to clear the local storage containg jwt token
                  navigate("./signin"); //Navigate user to signin page
                }}
              >
                Log Out
              </button>

              <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Modal;