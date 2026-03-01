import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import Draggable from 'react-draggable';
import { Play, X } from 'lucide-react';

interface EditorProps {
    onClose: () => void;
    onApply: (cssText: string) => void;
    targetElement: HTMLElement;
}

export const EditorConsole: React.FC<EditorProps> = ({ onClose, onApply, targetElement }) => {
    const [code, setCode] = useState('/* Rebuild the CSS here */\n\n');

    const handleApply = () => {
        onApply(code);
    };

    return (
        <Draggable handle=".handle">
            <div
                className="fixed z-[9999999] top-10 right-10 w-[400px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                style={{
                    background: 'rgba(10, 15, 28, 0.95)',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}
            >
                <div className="handle flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 cursor-move">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs font-semibold text-slate-300 tracking-wider">STYLE DUEL CONSOLE</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 bg-black/40 border-b border-white/10 border-t-black">
                    <p className="text-xs text-slate-400 mb-2 font-mono break-all">
                        Targeting: <span className="text-cyan-400">{targetElement.tagName.toLowerCase()}</span>
                        {targetElement.id && <span className="text-fuchsia-400">#{targetElement.id}</span>}
                        {Array.from(targetElement.classList).map(c => <span key={c} className="text-yellow-400">.{c}</span>)}
                    </p>
                </div>

                <div className="bg-[#282c34] overflow-y-auto" style={{ maxHeight: '300px' }}>
                    <CodeMirror
                        value={code}
                        height="300px"
                        theme={oneDark}
                        extensions={[css()]}
                        onChange={(value) => setCode(value)}
                        className="text-sm rounded-none border-none outline-none"
                    />
                </div>

                <div className="p-4 flex justify-end bg-white/5 border-t border-white/10">
                    <button
                        onClick={handleApply}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-medium tracking-wide shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
                    >
                        <Play size={16} /> Update DOM
                    </button>
                </div>
            </div>
        </Draggable>
    );
};
