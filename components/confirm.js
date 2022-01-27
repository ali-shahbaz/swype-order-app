import React, { useEffect } from "react";
import { CloseCircle } from "react-ionicons";
import PropTypes from 'prop-types';
import { confirmable, createConfirmation } from 'react-confirm';

const Confirmation = ({ show, proceed, dismiss, cancel, confirmation, title,
    okText, cancelText, okButtonStyle, cancelButtonStyle, ...options }) => {
    if (show) {
        setTimeout(() => {
            var myModal = new bootstrap.Modal(document.getElementById('deleteConfirmation'));
            myModal.show();
        }, 0);

    }
    return <>
        <div className="modal fade dialogbox checkout-list-item-delete" id="deleteConfirmation" data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content card-border">
                    <div className="modal-icon text-danger">
                        <CloseCircle cssClasses="ion-icon" />
                    </div>
                    <div className="modal-header">
                        <h5 className="modal-title">{confirmation}</h5>
                    </div>
                    <div className="modal-body">
                    </div>
                    <div className="modal-footer">
                        <div className="btn-inline">
                            <a href="#" id="modalDelete" className="btn btn-text-primary" onClick={() => proceed(false)} data-bs-dismiss="modal">Cancel</a>
                            <a href="#" id="modalConfirmed" className="btn btn-text-danger" onClick={() => proceed(true)} data-bs-dismiss="modal">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

Confirmation.propTypes = {
    /** header title */
    title: PropTypes.string,
    confirmation: PropTypes.string, // arguments of your confirm function
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okButtonStyle: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'light', 'dark', 'link']),
    cancelButtonStyle: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'light', 'dark', 'link']),
    show: PropTypes.bool, // from confirmable.
    proceed: PropTypes.func, // from confirmable.
    cancel: PropTypes.func, // from confirmable.
    dismiss: PropTypes.func, // from confirmable.
};

Confirmation.defaultProps = {
    title: undefined,
    confirmation: undefined,
    okText: 'OK',
    cancelText: 'Cancel',
    okButtonStyle: 'primary',
    cancelButtonStyle: 'secondary',
    show: undefined,
    proceed: undefined,
    cancel: undefined,
    dismiss: undefined,
};

const confirmLow = createConfirmation(confirmable(Confirmation));

export const confirm = (message, options = {}) => {
    return confirmLow(Object.assign({ confirmation: message }, options));
};