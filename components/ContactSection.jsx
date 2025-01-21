import React from 'react';

const ContactSection = () => {

    return (
        <footer className="glass-panel py-4 text-center">
            <div className="glass-content">
                <p>
                    Contact us at: <a href="mailto:your@email.com" className="text-sky-400 hover:text-sky-500">morepoly.zone@gmail.com</a>
                </p>
                <p>
                    Phone: <a href="tel:+11234567890" className="text-sky-400 hover:text-sky-500">+39 3388211342</a>
                </p>
                <p>© {new Date().getFullYear()} Polyzone </p>
            </div>
        </footer>
    );
};

export default ContactSection;