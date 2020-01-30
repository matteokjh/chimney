import React from "react";
import 'antd/dist/antd.css';
import "./App.sass";
import Header from "./components/Header";
import BestCard from "./components/BestCard";

const App: React.FC = () => {
    return (
        <div className="App">
            <Header></Header>
            <div className="main">
                <BestCard></BestCard>
            </div>
        </div>
    );
};

export default App;
