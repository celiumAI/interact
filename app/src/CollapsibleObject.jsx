import React, { useState } from 'react';

function Collapsible({ json }) {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    const renderJsonAsHtml = (json) => {
        if (!json) {
            return
        }

        if (typeof json !== 'object') {
            return json;
        }


        return (
            <ul>
                {Object.entries(json).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong>
                        {typeof value === 'object' ? (
                            <ul>{renderJsonAsHtml(value)}</ul>
                        ) : (
                            value
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <button onClick={toggle}>show info</button>
            <div style={{ overflow: "auto", maxHeight: "300px", maxWidth: "300px" }}>
                {open && renderJsonAsHtml(json)}
            </div>
        </div>
    );
}

export default Collapsible;
