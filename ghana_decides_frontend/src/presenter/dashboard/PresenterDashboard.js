import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const numberFormatter = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const PresenterDashboard = () => {
    const navigate = useNavigate();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [latestUpdate, setLatestUpdate] = useState(null);
    const [history, setHistory] = useState([]);
    const [highlightUpdate, setHighlightUpdate] = useState(false);
    const [lastHeartbeat, setLastHeartbeat] = useState(null);
    const [error, setError] = useState(null);

    const [electionId, setElectionId] = useState(() => localStorage.getItem('presenterElectionId') || '');
    const [scopeLevel, setScopeLevel] = useState('national');
    const [scopeIdentifier, setScopeIdentifier] = useState('');

    const socketRef = useRef(null);
    const reconnectRef = useRef(null);
    const heartbeatRef = useRef(null);
    const manualCloseRef = useRef(false);

    useEffect(() => {
        if (!token) {
            navigate('/login-presenter');
        }
    }, [navigate, token]);

    useEffect(() => {
        localStorage.setItem('presenterElectionId', electionId);
    }, [electionId]);

    const stopHeartbeat = useCallback(() => {
        if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = null;
        }
    }, []);

    const handleMessage = useCallback((event) => {
        if (!event) return;
        if (event.type === 'snapshot' || event.type === 'update') {
            const payload = event.payload || {};
            setLatestUpdate(payload);
            setHistory(Array.isArray(payload.history) ? payload.history : []);
            setHighlightUpdate(true);
        } else if (event.type === 'heartbeat') {
            setLastHeartbeat(event.timestamp);
        } else if (event.type === 'error') {
            setError(event.message || 'Unable to process realtime update.');
        }
    }, []);

    const sendPing = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: 'ping' }));
        }
    }, []);

    const subscribe = useCallback(() => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }
        if (!electionId.trim()) {
            setError('Enter an election ID to subscribe.');
            return;
        }
        if (scopeLevel !== 'national' && !scopeIdentifier.trim()) {
            setError('Provide an identifier for the selected scope.');
            return;
        }

        const payload = {
            action: 'subscribe',
            election_id: electionId.trim(),
            scope: scopeLevel,
        };
        if (scopeLevel !== 'national') {
            payload.scope_id = scopeIdentifier.trim();
        }
        setError(null);
        socketRef.current.send(JSON.stringify(payload));
    }, [electionId, scopeIdentifier, scopeLevel]);

    const connect = useCallback(() => {
        if (!token) {
            return;
        }
        manualCloseRef.current = false;
        if (socketRef.current) {
            socketRef.current.close();
        }

        const baseUrl = process.env.REACT_APP_BASE_URL_WS_URL || 'ws://localhost:8000/';
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const url = `${normalizedBase}ws/presenter-dashboard/?token=${token}`;

        const socket = new WebSocket(url);
        socketRef.current = socket;
        setConnectionStatus('connecting');

        socket.onopen = () => {
            setConnectionStatus('connected');
            subscribe();
            stopHeartbeat();
            heartbeatRef.current = setInterval(() => {
                sendPing();
            }, 25000);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleMessage(data);
            } catch (err) {
                console.error('Invalid websocket payload', err);
            }
        };

        socket.onclose = () => {
            setConnectionStatus('disconnected');
            stopHeartbeat();
            if (!manualCloseRef.current && !reconnectRef.current) {
                reconnectRef.current = setTimeout(() => {
                    reconnectRef.current = null;
                    connect();
                }, 4000);
            }
        };

        socket.onerror = () => {
            socket.close();
        };
    }, [handleMessage, sendPing, stopHeartbeat, subscribe, token]);

    useEffect(() => {
        connect();
        return () => {
            manualCloseRef.current = true;
            stopHeartbeat();
            if (reconnectRef.current) {
                clearTimeout(reconnectRef.current);
                reconnectRef.current = null;
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect, stopHeartbeat]);

    useEffect(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            subscribe();
        }
    }, [subscribe]);

    useEffect(() => {
        if (!highlightUpdate) {
            return undefined;
        }
        const timeout = setTimeout(() => setHighlightUpdate(false), 4000);
        return () => clearTimeout(timeout);
    }, [highlightUpdate]);

    const leader = latestUpdate?.leader;
    const runnerUp = latestUpdate?.runner_up;
    const totals = latestUpdate?.totals || {};

    const formattedTimestamp = useMemo(() => {
        if (!latestUpdate?.timestamp) return '—';
        try {
            return new Date(latestUpdate.timestamp).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch (err) {
            return latestUpdate.timestamp;
        }
    }, [latestUpdate]);

    const formatDelta = (value) => {
        if (value === undefined || value === null) return '0.0 pts';
        const prefix = value > 0 ? '+' : '';
        return `${prefix}${percentFormatter.format(value)} pts`;
    };

    const renderHistory = () => {
        if (!history.length) {
            return <p className="text-sm text-white/60">No updates received yet.</p>;
        }

        return (
            <ul className="space-y-2">
                {history.map((entry, index) => {
                    const entryTime = (() => {
                        try {
                            return new Date(entry.timestamp).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });
                        } catch (err) {
                            return entry.timestamp;
                        }
                    })();
                    return (
                        <li
                            key={`${entry.timestamp}-${index}`}
                            className="rounded-lg bg-white/5 px-4 py-3"
                        >
                            <div className="flex justify-between text-xs text-white/70">
                                <span>{index === 0 ? 'Latest' : entryTime}</span>
                                <span>{formatDelta(entry.vote_share_delta)}</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-white">
                                {entry.leader?.name || '—'} leads with {numberFormatter.format(entry.leader?.total_votes || 0)} votes
                            </p>
                            <p className="text-xs text-white/60">
                                Turnout change: {numberFormatter.format(entry.turnout_change || 0)} | Reporting {percentFormatter.format(entry.totals?.reporting_percent || 0)}%
                            </p>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const statusBadgeClass = connectionStatus === 'connected'
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
        : connectionStatus === 'connecting'
            ? 'bg-amber-500/20 text-amber-200 border border-amber-400/60'
            : 'bg-rose-500/20 text-rose-200 border border-rose-400/60';

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Presenter Control Room</h1>
                        <p className="text-sm text-white/60">Authenticated realtime feed for on-air narration.</p>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${statusBadgeClass}`}>
                        <span className="h-2 w-2 rounded-full bg-current"></span>
                        {connectionStatus.toUpperCase()}
                    </div>
                </header>

                <section className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h2 className="text-lg font-semibold">Subscription</h2>
                    <p className="text-sm text-white/60">Choose the election context and geography you want to narrate.</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <label className="flex flex-col gap-2 text-sm">
                            <span>Election ID</span>
                            <input
                                value={electionId}
                                onChange={(event) => setElectionId(event.target.value)}
                                placeholder="e.g. EL2024"
                                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            <span>Scope</span>
                            <select
                                value={scopeLevel}
                                onChange={(event) => setScopeLevel(event.target.value)}
                                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                            >
                                <option value="national">National</option>
                                <option value="region">Region</option>
                                <option value="constituency">Constituency</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            <span>{scopeLevel === 'national' ? 'Scope ID (optional)' : 'Scope ID'}</span>
                            <input
                                value={scopeIdentifier}
                                onChange={(event) => setScopeIdentifier(event.target.value)}
                                placeholder={scopeLevel === 'region' ? 'Region ID' : scopeLevel === 'constituency' ? 'Constituency ID' : 'Leave blank for national'}
                                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                                disabled={scopeLevel === 'national'}
                            />
                        </label>
                    </div>
                    {error && (
                        <p className="mt-3 rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                            {error}
                        </p>
                    )}
                    <div className="mt-4 text-xs text-white/50">
                        Last heartbeat: {lastHeartbeat ? new Date(lastHeartbeat).toLocaleTimeString() : '—'}
                    </div>
                </section>

                <section
                    className={`rounded-2xl border bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 shadow-xl transition ${highlightUpdate ? 'border-emerald-400/70 shadow-emerald-500/30' : 'border-white/10'}`}
                >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-wide text-emerald-300">{latestUpdate?.scope?.name || 'Awaiting data'}</p>
                            <h2 className="text-2xl font-semibold">{leader?.name || 'No leader yet'}</h2>
                        </div>
                        <div className="text-right text-sm text-white/60">
                            <p>Updated {formattedTimestamp}</p>
                            <p>{history.length} event{history.length === 1 ? '' : 's'} archived</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-sm font-semibold text-white/80">Vote share</h3>
                            <p className="mt-2 text-3xl font-bold text-white">{percentFormatter.format(leader?.vote_share || 0)}</p>
                            <p className="text-sm text-emerald-300">{formatDelta(latestUpdate?.vote_share_delta)}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-sm font-semibold text-white/80">Total votes</h3>
                            <p className="mt-2 text-3xl font-bold text-white">{numberFormatter.format(leader?.total_votes || 0)}</p>
                            <p className="text-sm text-white/60">Turnout change {numberFormatter.format(latestUpdate?.turnout_change || 0)}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-sm font-semibold text-white/80">Runner up</h3>
                            <p className="mt-2 text-xl font-semibold text-white">{runnerUp?.name || '—'}</p>
                            <p className="text-sm text-white/60">{runnerUp ? percentFormatter.format(runnerUp.vote_share || 0) : '—'}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-sm font-semibold text-white/80">Reporting progress</h3>
                            <p className="mt-1 text-2xl font-bold text-white">{percentFormatter.format(totals.reporting_percent || 0)}%</p>
                            <p className="text-sm text-white/60">{numberFormatter.format(totals.reporting || 0)} of {numberFormatter.format(totals.total_stations || 0)} polling stations reporting</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-sm font-semibold text-white/80">Update history</h3>
                            <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
                                {renderHistory()}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PresenterDashboard;
