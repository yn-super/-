
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Vintage Photo Editor
            </h1>
            <p className="mt-4 text-lg text-slate-400">
                Using Gemini "Nano Banana" to give your photos a nostalgic, retro record album vibe.
            </p>
        </header>
    );
};

export default Header;
