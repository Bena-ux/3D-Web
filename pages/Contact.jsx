import React, { useState, useEffect } from "react";

const Contact = () => {
    const [isDayMode, setIsDayMode] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
     const [isMessageSent, setIsMessageSent] = useState(false)

    useEffect(() => {
        const currentHour = new Date().getHours();
        const initialMode = currentHour >= 7 && currentHour < 19;
        setIsDayMode(initialMode);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsMessageSent(true)

     setTimeout(() => setIsMessageSent(false), 3000)
          setFormData({
            name: "",
             email: "",
             message: "",
          });
    };

    return (
        <section className="w-full h-screen relative flex transition-colors">
            <div className="glass-panel p-8 text-center w-3/4 mx-auto">
                <h1 className="text-5xl text-shadow font-bold">Contattaci</h1>
                <p className="text-lg mt-6">
                  Se hai domande o feedback, sentiti libero di inviarci un messaggio utilizzando il modulo sottostante!
                </p>
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Il tuo nome"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="p-2 rounded border-white/30 border bg-transparent text-black dark:text-white"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="La tua email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-2 rounded border-white/30 border bg-transparent text-black dark:text-white"
                    />
                    <textarea
                        name="message"
                        placeholder="Il tuo messaggio"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="p-2 rounded border-white/30 border bg-transparent text-black dark:text-white"
                    />
                    <button type="submit" className="btn-style">
                        Invia messaggio
                    </button>
                   {isMessageSent &&
                     <p className="mt-4 text-green-500">Messaggio inviato! Grazie per averci contattato.</p>
                    }
                </form>
            </div>
        </section>
    );
};

export default Contact;