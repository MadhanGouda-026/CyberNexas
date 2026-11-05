import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2 } from 'lucide-react';

interface TerminalProps {
  initialBanner?: string;
  customCommands?: Record<string, string>;
  onCommandExecuted?: (cmd: string, output: string) => void;
  onExecuteCommand?: (cmd: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>;
  hostname?: string;
  username?: string;
  heightClass?: string;
  isConnectedToContainer?: boolean;
  containerName?: string;
  isExecuting?: boolean;
}

interface CommandHistoryItem {
  command: string;
  output: string;
  timestamp: string;
  isError?: boolean;
}

export const InteractiveTerminal: React.FC<TerminalProps> = ({
  initialBanner = 'CyberNexus Virtual Environment v1.4.0 (x86_64-pc-linux-gnu)\nType "help" for a list of built-in commands or explore the filesystem.\n',
  customCommands = {},
  onCommandExecuted,
  onExecuteCommand,
  hostname = 'nexus-node',
  username = 'cadet',
  heightClass = 'h-80',
  isConnectedToContainer = false,
  containerName
}) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    { command: '', output: initialBanner, timestamp: '' }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState<number>(-1);
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [runningCmd, setRunningCmd] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, runningCmd]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd || runningCmd) return;

    setCmdHistoryList(prev => [...prev, cmd]);
    setCmdHistoryIndex(-1);
    setInputVal('');

    const lowerCmd = cmd.toLowerCase();

    // Clear is handled locally
    if (lowerCmd === 'clear') {
      setHistory([]);
      return;
    }

    // If connected to a real Docker container, delegate execution
    if (onExecuteCommand) {
      setRunningCmd(true);
      try {
        const result = await onExecuteCommand(cmd);
        const combinedOutput = result.stdout || result.stderr || (result.exitCode === 0 ? '' : `[Exited with code ${result.exitCode}]`);
        setHistory(prev => [
          ...prev,
          {
            command: cmd,
            output: combinedOutput,
            timestamp: new Date().toLocaleTimeString(),
            isError: result.exitCode !== 0 && Boolean(result.stderr)
          }
        ]);
        if (onCommandExecuted) {
          onCommandExecuted(cmd, combinedOutput);
        }
      } catch (err: any) {
        setHistory(prev => [
          ...prev,
          {
            command: cmd,
            output: err.message || 'Execution error in container',
            timestamp: new Date().toLocaleTimeString(),
            isError: true
          }
        ]);
      } finally {
        setRunningCmd(false);
      }
      return;
    }

    let output = '';

    // Check custom commands first
    if (customCommands[cmd]) {
      output = customCommands[cmd];
    } else if (customCommands[lowerCmd]) {
      output = customCommands[lowerCmd];
    } else if (lowerCmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lowerCmd === 'help') {
      output = `CyberNexus Shell Help:
  whoami           Display current user
  id               Show UID and GID groups
  pwd              Print working directory
  ls [-la]         List directory contents
  cat <file>       Display file contents
  find <args>      Search directory tree
  nmap <target>    Network scanner simulator
  curl <url>       HTTP/HTTPS transfer client
  base64 [-d]      Base64 encode/decode utility
  grep <pattern>   Filter text patterns
  uname -a         Display kernel release
  date             Print current system date
  clear            Clear terminal screen`;
    } else if (lowerCmd === 'whoami') {
      output = username;
    } else if (lowerCmd === 'id') {
      output = `uid=1000(${username}) gid=1000(${username}) groups=1000(${username}),27(sudo),100(users)`;
    } else if (lowerCmd === 'pwd') {
      output = `/home/${username}`;
    } else if (lowerCmd === 'ls' || lowerCmd === 'ls -la' || lowerCmd === 'ls -l') {
      output = `total 32
drwxr-xr-x 4 ${username} ${username} 4096 Nov 04 09:00 .
drwxr-xr-x 3 root     root     4096 Nov 04 08:30 ..
-rw-r--r-- 1 ${username} ${username}  220 Nov 04 08:30 .bash_logout
-rw-r--r-- 1 ${username} ${username} 3771 Nov 04 08:30 .bashrc
-rw-r--r-- 1 ${username} ${username}  807 Nov 04 08:30 .profile
-rw-r--r-- 1 ${username} ${username} 1042 Nov 04 09:15 mission_briefing.txt
-rwxr-xr-x 1 ${username} ${username} 8420 Nov 04 09:12 verify_target.sh`;
    } else if (lowerCmd.startsWith('cat mission_briefing.txt')) {
      output = `=== CYBERNEXUS MISSION BRIEFING ===
Target: 192.168.10.15
Classification: RESTRICTED
Objectives: Inspect running services, identify configuration weaknesses, and report finding flags.`;
    } else if (lowerCmd.startsWith('cat')) {
      const target = cmd.split(' ')[1];
      output = target ? `cat: ${target}: No such file or directory` : 'cat: missing operand';
    } else if (lowerCmd === 'uname -a') {
      output = 'Linux nexus-node 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (lowerCmd === 'date') {
      output = new Date().toUTCString();
    } else if (lowerCmd.startsWith('echo ')) {
      output = cmd.substring(5);
    } else {
      output = `bash: ${cmd.split(' ')[0]}: command not found. Type "help" for available utilities.`;
    }

    setHistory(prev => [
      ...prev,
      {
        command: cmd,
        output,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    if (onCommandExecuted) {
      onCommandExecuted(cmd, output);
    }

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryList.length > 0) {
        const nextIndex = cmdHistoryIndex === -1 ? cmdHistoryList.length - 1 : Math.max(0, cmdHistoryIndex - 1);
        setCmdHistoryIndex(nextIndex);
        setInputVal(cmdHistoryList[nextIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryIndex !== -1) {
        const nextIndex = cmdHistoryIndex + 1;
        if (nextIndex >= cmdHistoryList.length) {
          setCmdHistoryIndex(-1);
          setInputVal('');
        } else {
          setCmdHistoryIndex(nextIndex);
          setInputVal(cmdHistoryList[nextIndex]);
        }
      }
    }
  };

  return (
    <div
      className={`bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 flex flex-col font-mono shadow-md ${
        isMaximized ? 'fixed inset-4 z-50 h-auto' : heightClass
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Titlebar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-xs font-semibold text-slate-400">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{username}@{hostname}: ~</span>
          </div>
          {isConnectedToContainer && (
            <span className="ml-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DOCKER ENGINE LIVE</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHistory([]);
            }}
            className="text-slate-400 hover:text-slate-200 p-1"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="text-slate-400 hover:text-slate-200 p-1"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output stream */}
      <div className="flex-1 p-4 overflow-y-auto text-xs space-y-2 font-mono">
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-emerald-400 font-bold">{username}@{hostname}</span>
                <span className="text-slate-500">:</span>
                <span className="text-indigo-400">~</span>
                <span className="text-slate-300 font-bold">$</span>
                <span className="text-white font-semibold">{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className={`whitespace-pre-wrap leading-relaxed font-mono ${item.isError ? 'text-rose-400' : 'text-slate-300'}`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {runningCmd && (
          <div className="flex items-center gap-2 text-amber-400 text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Executing inside Docker container...</span>
          </div>
        )}

        {/* Current Active Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold text-xs">{username}@{hostname}</span>
          <span className="text-slate-500">:</span>
          <span className="text-indigo-400">~</span>
          <span className="text-slate-300 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={runningCmd}
            className="flex-1 bg-transparent text-white outline-none font-mono text-xs caret-cyan-400 disabled:opacity-50"
            autoFocus
            spellCheck={false}
          />
        </form>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
