import React from 'react';
import styles from './Button.module.css';
import { BsArrowRight } from 'react-icons/bs';

const Button = ({ text, onClick, disabled = false }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={styles.button}
        >
            <span>{text}</span>
            <BsArrowRight className={styles.arrow} />
        </button>
    );
};
export default Button;
