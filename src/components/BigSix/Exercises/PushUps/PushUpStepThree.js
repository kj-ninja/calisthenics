import React from 'react';

const PushUpStepThree = () => {
    return (
        <>
            <div className="exercises__header">
                <h3>Krok 3</h3>
                <h2>Pompki na kolanach</h2>
            </div>
            <div className="exercises__images">
                <div className="exercises__image"/>
                <div className="exercises__image"/>
            </div>
            <div className="exercises__goals-container">
                <h3 className="exercises__goals-title">Cele treningowe:</h3>
                <ul className="exercises__goals-list">
                    <li>Próg początkowy: 3 serie 10 powtórzeń</li>
                    <li>Próg średniozaawansowany: 3 serie po 15 powtórzeń</li>
                    <li>Próg przejścia: 3 serie po 30 powtórzeń</li>
                </ul>
            </div>
        </>
    );
};

export default PushUpStepThree;