import { useState } from 'react';
import { Swords, Code2 } from 'lucide-react';

export default function App() {
    const [active, setActive] = useState(false);

    const toggleInspector = async () => {
        setActive(!active);
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { action: active ? 'stop_inspect' : 'start_inspect' });
        }
    };

    return (
        <div className="w-[340px] p-4 bg-[#0A0F1C] text-slate-200 font-sans border border-purple-900/40 rounded-xl glass shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg shadow-lg">
                    <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">StyleDuel</h1>
                    <p className="text-xs text-slate-400">Gamify the Internet's CSS</p>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={toggleInspector}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${active
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                        }`}
                >
                    <Code2 className="w-5 h-5" />
                    {active ? 'Stop Inspecting' : 'Pick an Element to Duel'}
                </button>

                <div className="bg-[#131B2F] p-3 rounded-lg border border-slate-800 text-sm text-slate-400">
                    <p><strong>How to play:</strong> Click the button above, hover over any element on this page, and click it to strip its CSS. Can you rebuild it from scratch?</p>
                </div>
            </div>
        </div>
    );
}
