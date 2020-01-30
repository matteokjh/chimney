import React from "react";
import "../styles/BestCard.sass";
import Title from "./Title";
import WrappedForm from './WrappedForm'


const BestCard = () => {
    return (
        <div className="BestCard">
            <Title title="I. Select the best card!"></Title>
            <WrappedForm />
        </div>
    );
};

export default BestCard;
