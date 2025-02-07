/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import './Input.scss';
import '../../Styles/styles.scss';
import '../../Styles/_mixin.scss';
function Input({ label, type, placeholder }) {
        return (
            <div className="input-container">
                <label>{label}</label>
                <input type={type} placeholder={placeholder} />
            </div>
        );
}

export default Input;