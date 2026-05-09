import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Bot, User, CheckCircle, XCircle, BarChart3,
  Settings, Shield, Server, RefreshCw, Zap, Layers,
  Wrench, Database, Command
} from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      role: 'agent',
      text: "Welcome to your Generative UI workspace. I am equipped to render interactive components on the fly rather than just plain text.\n\nTo see this in action, try asking me to:\n• **Show metrics** (Dynamic chart generation)\n• **Review the budget** (Tool-enabled approval workflow)\n• **Open system controls** (Agentic feedback dashboard)",
      latency: "8ms"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAntigravity, setIsAntigravity] = useState(false);
  const messagesEndRef = useRef(null);

  // --- GOOGLE ANTIGRAVITY PHYSICS ENGINE ---
  useEffect(() => {
    if (!isAntigravity) {
      // Restore layout
      document.querySelectorAll('.physics-element').forEach(el => {
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        el.style.width = '';
        el.style.height = '';
        el.style.transform = '';
        el.style.zIndex = '';
        el.style.transition = '';
        el.style.margin = '';
      });
      return;
    }

    const elements = document.querySelectorAll('.physics-element');
    const bodies = Array.from(elements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        rot: 0,
        vrot: (Math.random() - 0.5) * 3,
        isDragging: false,
        baseLeft: rect.left,
        baseTop: rect.top
      };
    });

    // Detach elements and apply fixed positioning
    bodies.forEach(b => {
      b.el.style.position = 'fixed';
      b.el.style.left = b.baseLeft + 'px';
      b.el.style.top = b.baseTop + 'px';
      b.el.style.width = b.w + 'px';
      b.el.style.height = b.h + 'px';
      b.el.style.zIndex = Math.floor(Math.random() * 100) + 1000;
      b.el.style.transition = 'none';
      b.el.style.margin = '0';
    });

    let animationId;
    let mouseX = 0, mouseY = 0;
    let pmouseX = 0, pmouseY = 0;
    let draggedBody = null;

    // Grab and throw interaction
    const onMouseDown = (e) => {
      if (['INPUT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;

      let found = null;
      for (let b of bodies) {
        if (e.clientX >= b.x && e.clientX <= b.x + b.w && e.clientY >= b.y && e.clientY <= b.y + b.h) {
          if (!found || parseInt(b.el.style.zIndex) > parseInt(found.el.style.zIndex)) found = b;
        }
      }
      if (found) {
        draggedBody = found;
        draggedBody.isDragging = true;
        draggedBody.vx = 0;
        draggedBody.vy = 0;
        draggedBody.vrot = 0;
        draggedBody.el.style.zIndex = 2000;
      }
    };

    const onMouseMove = (e) => {
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (draggedBody) {
        draggedBody.x = mouseX - draggedBody.w / 2;
        draggedBody.y = mouseY - draggedBody.h / 2;
      }
    };

    const onMouseUp = () => {
      if (draggedBody) {
        draggedBody.vx = mouseX - pmouseX;
        draggedBody.vy = mouseY - pmouseY;
        draggedBody.vrot = (Math.random() - 0.5) * 5;
        draggedBody.isDragging = false;
        draggedBody.el.style.zIndex = Math.floor(Math.random() * 100) + 1000;
        draggedBody = null;
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Physics Loop
    const loop = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      bodies.forEach(b => {
        if (!b.isDragging) {
          b.x += b.vx;
          b.y += b.vy;
          b.rot += b.vrot;

          // Wall collisions
          if (b.x < 0) { b.x = 0; b.vx *= -1; }
          if (b.x + b.w > ww) { b.x = ww - b.w; b.vx *= -1; }
          if (b.y < 0) { b.y = 0; b.vy *= -1; }
          if (b.y + b.h > wh) { b.y = wh - b.h; b.vy *= -1; }
        }
        b.el.style.transform = `translate(${b.x - b.baseLeft}px, ${b.y - b.baseTop}px) rotate(${b.rot}deg)`;
      });
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isAntigravity]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAgentResponse = async (userText, currentMessages) => {
    const apiKey = ""; // Injected automatically by the workspace environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemInstruction = `You are an Agentic UI assistant built for a Hackathon. You help users by communicating naturally AND generating interactive UI components (widgets) directly in the chat stream.
You MUST respond in strict JSON format. 

JSON Schema:
{
  "text": "Your natural language response addressing the user.",
  "widget": null // OR provide a widget object if the user intent matches below.
}

Widget Generation Rules:
- If the user asks for Data, Metrics, Sales, or Charts: 
  "widget": { "type": "chart", "data": { "title": "Chart Title", "labels": ["L1", "L2", "L3"], "values": [10, 50, 30] } }
- If the user asks for Approvals, Workflows, or Budgets: 
  "widget": { "type": "approval", "data": { "requestName": "Document Name", "requester": "Person/Dept", "amount": "$0.00" } }
- If the user asks for Settings, Controls, Systems, or Dashboard: 
  "widget": { "type": "controls", "data": { "services": [{ "name": "Service Name", "status": true, "icon": "Shield" }] } }
  (Icon MUST be exactly one of: "Shield", "Database", "Server")

If the user interacts with a system component (you will see a [System Action] message), acknowledge the action in your "text" response and do not generate a new widget unless explicitly requested. Do NOT include markdown block markers like \`\`\`json. Just output raw JSON.`;

    // Map existing React state messages to Gemini's expected history format
    const apiHistory = currentMessages
      .filter(msg => !msg.isAutomated || msg.text.startsWith('[System Action]')) // Keep user inputs and relevant system actions
      .map(msg => ({
        role: msg.role === 'agent' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Add the latest interaction
    apiHistory.push({ role: 'user', parts: [{ text: userText }] });

    const payload = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: apiHistory,
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const startTime = performance.now();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const endTime = performance.now();

      if (data.candidates && data.candidates.length > 0) {
        const jsonText = data.candidates[0].content.parts[0].text;
        const jsonResponse = JSON.parse(jsonText);

        return {
          id: Date.now().toString(),
          role: 'agent',
          text: jsonResponse.text,
          widget: jsonResponse.widget,
          latency: `${Math.round(endTime - startTime)}ms`
        };
      }
    } catch (error) {
      console.error("LLM Generation Error:", error);
      return {
        id: Date.now().toString(),
        role: 'agent',
        text: "I encountered an error connecting to my AI backend. Please verify your connection or check the console.",
        latency: "err"
      };
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // --- ANTIGRAVITY EASTER EGG ---
    if (input.trim().toLowerCase() === 'antigravity') {
      setIsAntigravity(prev => !prev);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'agent',
        text: !isAntigravity ? "🚀 Antigravity mode engaged. Commencing zero-G float..." : "🛬 Gravity restored. Touchdown confirmed.",
        latency: "0ms",
        isAutomated: true
      }]);
      setInput('');
      return;
    }

    const userText = input;
    const userMsg = { id: Date.now().toString(), role: 'user', text: userText };

    // Capture current messages state before we update it, to pass as context
    const currentMessages = [...messages];

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const agentReply = await generateAgentResponse(userText, currentMessages);

    setMessages(prev => [...prev, agentReply]);
    setIsTyping(false);
  };

  const handleWidgetFeedback = async (actionText) => {
    const feedbackMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: actionText,
      isAutomated: true
    };

    const currentMessages = [...messages];

    setMessages(prev => [...prev, feedbackMsg]);
    setIsTyping(true);

    // Feed the UI interaction directly back to the AI so it knows the updated state
    const agentReply = await generateAgentResponse(actionText, currentMessages);

    setMessages(prev => [...prev, agentReply]);
    setIsTyping(false);
  };

  return (
    <div className={`flex h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden`}>

      {/* Sidebar - Hackathon Theme Checklist */}
      <div className={`physics-element w-72 border-r border-slate-800/50 bg-[#0B1120] flex-col hidden md:flex`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Command className="w-7 h-7 text-emerald-400 shrink-0" />
            <span className="text-xl font-bold tracking-tight text-slate-100 whitespace-nowrap">Agentic-UI</span>
          </div>

          <div className="text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase mb-4 text-left">Active Protocols</div>
          <div className="space-y-2">
            <SidebarItem icon={<Layers className="w-4 h-4" />} title="Dynamic Components" active={true} />
            <SidebarItem icon={<RefreshCw className="w-4 h-4" />} title="Agentic Feedback" active={false} />
            <SidebarItem icon={<Zap className="w-4 h-4" />} title="Latency-Optimized" active={false} />
            <SidebarItem icon={<Wrench className="w-4 h-4" />} title="Tool-Enabled UI" active={false} />
          </div>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-left">
            <div className="text-xs font-bold text-emerald-400 mb-1">AI Tinkerers HK</div>
            <div className="text-sm font-medium text-slate-300 leading-snug">Generative UI Global Hackathon Target</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full relative">
        <header className="physics-element flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-[#0F172A]/80 backdrop-blur-md absolute top-0 w-full z-10">
          <div className="text-sm font-medium text-slate-300 text-left">Workspace / <span className="text-emerald-400">Production</span></div>
          <div className="flex gap-2 text-xs font-medium">
            {isAntigravity && (
              <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full flex items-center gap-1.5 animate-pulse">
                🚀 ZERO-G ACTIVE
              </span>
            )}
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              A2UI Protocol
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pt-24 pb-32 space-y-6">
          {messages.map((msg, index) => (
            <MessageBubble key={msg.id} msg={msg} onFeedback={handleWidgetFeedback} isAntigravity={isAntigravity} index={index} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-400 text-left">
                Rendering structured output...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent pointer-events-none">
          <form onSubmit={handleSend} className="physics-element max-w-3xl mx-auto relative pointer-events-auto">
            <div className="relative flex items-center bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for metrics, an approval flow, or system controls..."
                className="flex-1 bg-transparent border-none px-5 py-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 text-left"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 mr-2 text-slate-500 hover:text-emerald-400 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components & Widgets ---

const SidebarItem = ({ icon, title, active }) => (
  <div className={`flex items-center gap-3 py-2 transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>
    <div className={`p-1.5 rounded-lg ${active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-transparent text-emerald-500'}`}>
      {icon}
    </div>
    <span className="text-sm font-semibold text-left">{title}</span>
  </div>
);

const MessageBubble = ({ msg, onFeedback, isAntigravity, index }) => {
  const isAgent = msg.role === 'agent';

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.trim() === '') return <div key={i} className="h-3"></div>;

      if (line.startsWith('•')) {
        const parts = line.substring(1).split('**');
        return (
          <li key={i} className="ml-4 list-none flex items-start gap-3 mb-2.5 text-left">
            <div className="w-1.5 h-1.5 bg-emerald-500 shrink-0 mt-2"></div>
            <span className="text-slate-400 text-[15px] leading-relaxed">
              {parts.map((part, idx) => idx % 2 !== 0 ? <strong key={idx} className="text-slate-100 font-semibold">{part}</strong> : part)}
            </span>
          </li>
        );
      }
      return <p key={i} className="text-[15px] leading-relaxed text-slate-300 text-left">{line}</p>;
    });
  };

  return (
    <div className={`physics-element flex items-start gap-4 ${msg.isAutomated ? 'opacity-60' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${isAgent
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
        }`}>
        {isAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className="flex-1 max-w-3xl text-left">
        <div className={`p-5 rounded-2xl shadow-sm border ${isAgent
            ? 'bg-slate-800/40 border-slate-700/50 rounded-tl-sm'
            : 'bg-slate-800 border-slate-700 rounded-tr-sm'
          }`}>
          {formatText(msg.text)}

          {/* Dynamically Generated Components (The Magic!) */}
          {msg.widget && (
            <div className="mt-5 border-t border-slate-700/50 pt-5">
              {msg.widget.type === 'chart' && <ChartWidget data={msg.widget.data} />}
              {msg.widget.type === 'approval' && <ApprovalWidget data={msg.widget.data} onFeedback={onFeedback} />}
              {msg.widget.type === 'controls' && <ControlsWidget data={msg.widget.data} onFeedback={onFeedback} />}
            </div>
          )}
        </div>

        {isAgent && msg.latency && (
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1.5 ml-1">
            <Zap className="w-3 h-3 text-emerald-500/70" />
            Render Latency: {msg.latency}
          </div>
        )}
      </div>
    </div>
  );
};

// Widget 1: Dynamic Data Visualization
const ChartWidget = ({ data }) => {
  const max = Math.max(...data.values);
  return (
    <div className="bg-[#0B1120] border border-slate-700/50 p-5 rounded-xl w-full text-left">
      <div className="text-sm font-medium text-slate-200 mb-6 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-emerald-400" />
        {data.title}
      </div>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.values.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-slate-800/50 rounded-t-sm relative group max-w-[40px]" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-700 ease-out hover:brightness-110"
                style={{ height: `${(val / max) * 100}%` }}
              ></div>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs py-1 px-2 rounded shadow-lg text-white transition-opacity border border-slate-700 pointer-events-none z-10">
                ${val}k
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-500">{data.labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Widget 2: Tool-Enabled Approval Flow
const ApprovalWidget = ({ data, onFeedback }) => {
  const [status, setStatus] = useState('pending');

  const handleAction = (action) => {
    setStatus(action);
    // Triggers Agentic Feedback Loop
    onFeedback(`[System Action]: User ${action === 'approved' ? 'Approved' : 'Rejected'} request "${data.requestName}"`);
  };

  return (
    <div className="bg-[#0B1120] border border-slate-700/50 p-5 rounded-xl max-w-sm relative overflow-hidden text-left">
      <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
      <div className="mb-5 pl-2">
        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Pending Workflow</span>
        <div className="text-base font-semibold text-slate-100 mt-1">{data.requestName}</div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-slate-400">{data.requester}</span>
          <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">{data.amount}</span>
        </div>
      </div>

      {status === 'pending' ? (
        <div className="flex gap-3 pl-2">
          <button
            onClick={() => handleAction('rejected')}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => handleAction('approved')}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        </div>
      ) : (
        <div className={`ml-2 p-3 rounded-lg flex items-center gap-2 text-sm border ${status === 'approved'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          Workflow advanced to next stage.
        </div>
      )}
    </div>
  );
};

// Widget 3: Agentic Settings Dashboard
const ControlsWidget = ({ data, onFeedback }) => {
  const [services, setServices] = useState(data.services);

  const toggleService = (index) => {
    const newServices = [...services];
    newServices[index].status = !newServices[index].status;
    setServices(newServices);
    // Triggers Agentic Feedback Loop
    onFeedback(`[System Action]: Toggled ${newServices[index].name} to ${newServices[index].status ? 'ONLINE' : 'OFFLINE'}`);
  };

  const getIcon = (name) => {
    if (name === 'Shield') return <Shield className="w-4 h-4" />;
    if (name === 'Database') return <Database className="w-4 h-4" />;
    return <Server className="w-4 h-4" />;
  }

  return (
    <div className="bg-[#0B1120] border border-slate-700/50 p-5 rounded-xl max-w-sm text-left">
      <div className="text-sm font-medium text-slate-200 mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4 text-violet-400" />
        Infrastructure Context
      </div>
      <div className="space-y-3">
        {services.map((srv, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${srv.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {getIcon(srv.icon)}
              </div>
              <span className="text-sm font-medium text-slate-300">{srv.name}</span>
            </div>
            <button
              onClick={() => toggleService(i)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0F172A] ${srv.status ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${srv.status ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};