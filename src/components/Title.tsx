import React from "react";
import "../styles/Title.sass";

const Title = (props: { title: string }) => {
    return (
        <div className="Title">
            <h1>{props.title}</h1>
        </div>
    );
};

export default Title;
