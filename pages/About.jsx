import React, { useState, useEffect } from "react";

const About = () => {
  const [isDayMode, setIsDayMode] = useState(true);

  useEffect(() => {
        const currentHour = new Date().getHours();
        const initialMode = currentHour >= 7 && currentHour < 19;
        setIsDayMode(initialMode);
    }, []);


  return (
    <section className="w-full h-screen relative flex transition-colors">
      <div className="glass-panel p-8 text-center w-3/4 mx-auto">
        <h1 className="text-5xl text-shadow font-bold">Informazioni sul Museo Digitale</h1>
        <p className="text-lg mt-6">
          Benvenuto nel Museo Digitale, uno spazio virtuale dedicato a mostrare la bellezza e la storia dell'arte attraverso la potenza del 3D. La nostra missione è rendere l'arte accessibile a tutti, superando i limiti dei musei fisici e invitandoti ad esplorare capolavori da qualsiasi parte del mondo.
        </p>
          <p className="text-lg mt-6">
           Qui puoi interagire con sculture iconiche e altre opere d'arte in una dimensione completamente nuova, utilizzando innovativi modelli 3D per migliorarle e portarle in vita.
          </p>
         <p className="text-lg mt-6">
           Crediamo che l'arte debba essere vissuta, non solo osservata. Ecco perché forniamo strumenti che ti consentono di ruotare, ingrandire ed esplorare queste opere in dettaglio. Che tu sia un appassionato d'arte, uno studente o semplicemente curioso, speriamo che tu possa trovare qualcosa che ti ispiri qui.
          </p>
        <p className="text-lg mt-6">
          Grazie per esserti unito a noi in questo viaggio attraverso il mondo dell'arte. Siamo in continua evoluzione e aggiungiamo nuove funzionalità, quindi non vediamo l'ora della tua continua esplorazione del Museo Digitale.
           </p>
      </div>
    </section>
  );
};

export default About;