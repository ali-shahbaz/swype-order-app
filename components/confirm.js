import { CloseCircle } from "react-ionicons";
const Confirm = ({ message }) => {
    return <>
        <div className="modal fade dialogbox checkout-list-item-delete show" id="deleteConfirmation" data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-modal="true" style="display: block;">
            <div className="modal-dialog" role="document">
                <div className="modal-content card-border">
                    <div className="modal-icon text-danger">
                        <CloseCircle />
                    </div>
                    <div className="modal-header">
                        <h5 className="modal-title">{message || `Do you wish to delete item?`}</h5>
                    </div>
                    <div className="modal-body">
                    </div>
                    <div className="modal-footer">
                        <div className="btn-inline">
                            <a href="#" id="modalDelete" className="btn btn-text-primary" data-bs-dismiss="modal">Cancel</a>
                            <a href="#" id="modalConfirmed" className="btn btn-text-danger" data-bs-dismiss="modal">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Confirm;