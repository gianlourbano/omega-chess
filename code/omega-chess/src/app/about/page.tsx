import React from 'react';
import '../globals.css'; // Make sure to import your custom CSS file

const Page: React.FC = () => {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <p className="md-paragraph">Alessandro Testa – <a href="mailto:alessandro.testa8@studio.unibo.it" className="md-link">alessandro.testa8@studio.unibo.it</a> - 0001043390</p>
            <p className="md-paragraph">Fabio Chiarini – <a href="mailto:fabio.chiarini2@studio.unibo.it" className="md-link">fabio.chiarini2@studio.unibo.it</a> - 0001028936</p>
            <p className="md-paragraph">Gianlorenzo Urbano – <a href="mailto:gianlorenzo.urbano@studio.unibo.it" className="md-link">gianlorenzo.urbano@studio.unibo.it</a> - 0001020458</p>
            <p className="md-paragraph">Liam Busnelli – <a href="mailto:liam.busnelliurso@studio.unibo.it" className="md-link">liam.busnelliurso@studio.unibo.it</a> - 0001019817</p>
            <p className="md-paragraph">Matteo Patella – <a href="mailto:matteo.patella@studio.unibo.it" className="md-link">matteo.patella@studio.unibo.it</a> - 0001020848</p>
            <p className="md-paragraph">Simone Folli – <a href="mailto:simone.folli2@studio.unibo.it" className="md-link">simone.folli2@studio.unibo.it</a> – 0000974629</p>
        </div>
    );
};

export default Page;
