import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, NavigationControl, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { baseUrl, baseWsUrl } from '../../Constants';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiZGVsYWRlbS1waW5nc2hpcCIsImEiOiJjbHRubWF2eTUwOXBiMm1vNnI0MTNjZmNyIn0.c_hBpKu5mroAjOtRHuKb6Q';
const MAP_STYLE = process.env.REACT_APP_MAP_STYLE || 'mapbox://styles/mapbox/dark-v11';
const INITIAL_VIEW_STATE = { longitude: -1.023, latitude: 7.9465, zoom: 6 };
const EMPTY_COLLECTION = { type: 'FeatureCollection', features: [] };

const formatNumber = (value) =>
  typeof value === 'number' ? value.toLocaleString('en-US') : '—';

const formatPercent = (value) =>
  typeof value === 'number' ? `${value.toFixed(1)}%` : '—';

const formatTimestamp = (value) => {
  if (!value) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const MapView = () => {
  const [electionId, setElectionId] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [wsStatus, setWsStatus] = useState('disconnected');

  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const latestSubscription = useRef({ scope: 'national', scopeId: null });

  const featureCollection = useMemo(
    () => payload?.feature_collection ?? EMPTY_COLLECTION,
    [payload]
  );
  const summary = payload?.summary ?? {};
  const scopeName = payload?.scope?.name ?? 'National';
  const candidates = payload?.candidates ?? [];
  const features = payload?.features ?? [];
  const options = payload?.options ?? {};

  const cleanupSocket = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const fetchPayload = useCallback(
    async (targetElectionId, targetScope, targetScopeId) => {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (targetElectionId) {
          params.set('election_id', targetElectionId);
        }
        if (targetScope) {
          params.set('scope', targetScope);
        }
        if (targetScopeId) {
          params.set('scope_id', targetScopeId);
        }
        const query = params.toString();
        const response = await fetch(
          `${baseUrl}api/elections/map/payload/${query ? `?${query}` : ''}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );
        const body = await response.json().catch(() => null);
        if (!response.ok) {
          const detail = body && body.detail ? body.detail : 'Unable to load map data.';
          throw new Error(detail);
        }

        const data = body ?? {};
        setPayload(data);
        setElectionId(data.election?.id ?? null);
        const newScopeId = data.scope?.id ?? null;
        latestSubscription.current = { scope: data.scope?.level ?? 'national', scopeId: newScopeId };

        if ((data.scope?.level ?? 'national') === 'national') {
          setSelectedRegion(null);
          setSelectedConstituency(null);
        } else if (data.scope?.level === 'region') {
          setSelectedRegion(newScopeId);
          setSelectedConstituency(null);
        } else if (data.scope?.level === 'constituency') {
          setSelectedConstituency(newScopeId);
        }
      } catch (err) {
        setError(err.message || 'Unable to load map data.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPayload(null, 'national', null);
    return () => cleanupSocket();
  }, [fetchPayload, cleanupSocket]);

  useEffect(() => {
    if (!electionId || !MAPBOX_TOKEN) {
      return () => undefined;
    }

    let cancelled = false;

    const connect = () => {
      if (cancelled) {
        return;
      }
      const socket = new WebSocket(`${baseWsUrl}ws/live-map-consumer/`);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsStatus('connected');
        const { scope: currentScope, scopeId: currentScopeId } = latestSubscription.current;
        if (electionId) {
          socket.send(
            JSON.stringify({
              action: 'subscribe',
              election_id: electionId,
              scope: currentScope,
              scope_id: currentScopeId,
            })
          );
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'snapshot' || message.type === 'update') {
            setPayload(message.payload);
            const payloadScope = message.payload?.scope?.level ?? 'national';
            const payloadScopeId = message.payload?.scope?.id ?? null;
            latestSubscription.current = { scope: payloadScope, scopeId: payloadScopeId };

            if (payloadScope === 'national') {
              setSelectedRegion(null);
              setSelectedConstituency(null);
            } else if (payloadScope === 'region') {
              setSelectedRegion(payloadScopeId);
              setSelectedConstituency(null);
            } else if (payloadScope === 'constituency') {
              setSelectedConstituency(payloadScopeId);
            }
          } else if (message.type === 'error') {
            setError(message.message || 'Unable to load map updates.');
          }
        } catch (err) {
          setError('Malformed message received from server.');
        }
      };

      socket.onclose = () => {
        setWsStatus('disconnected');
        if (!cancelled) {
          reconnectTimer.current = setTimeout(connect, 5000);
        }
      };

      socket.onerror = () => {
        setWsStatus('error');
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (err) {
          // ignore close errors
        }
        wsRef.current = null;
      }
    };
  }, [electionId]);

  const handleRegionChange = async (event) => {
    const value = event.target.value || null;
    setSelectedRegion(value);
    setSelectedConstituency(null);

    const nextScope = value ? 'region' : 'national';
    await fetchPayload(electionId, nextScope, value);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && electionId) {
      wsRef.current.send(
        JSON.stringify({
          action: 'subscribe',
          election_id: electionId,
          scope: value ? 'region' : 'national',
          scope_id: value,
        })
      );
    }
  };

  const handleConstituencyChange = async (event) => {
    const value = event.target.value || null;
    setSelectedConstituency(value);

    const nextScope = value ? 'constituency' : 'region';
    const nextScopeId = value ? value : selectedRegion;
    await fetchPayload(electionId, nextScope, nextScopeId);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && electionId) {
      wsRef.current.send(
        JSON.stringify({
          action: 'subscribe',
          election_id: electionId,
          scope: nextScope,
          scope_id: nextScopeId,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="px-6 py-4 border-b border-slate-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ghana 2024 Live Map</h1>
          <p className="text-sm text-slate-300">Viewing: {scopeName}</p>
          <p className="text-sm text-slate-300" aria-live="polite">
            Updated {formatTimestamp(summary.updated_at)} · Reporting {formatNumber(summary.reporting)} of{' '}
            {formatNumber(summary.total_stations)} polling stations ({formatPercent(summary.reporting_percent)})
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className={`px-3 py-1 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-600' : wsStatus === 'error' ? 'bg-red-600' : 'bg-slate-700'}`}>
            WebSocket: {wsStatus}
          </div>
          {isLoading && <div className="px-3 py-1 rounded-full bg-slate-700 animate-pulse">Loading…</div>}
        </div>
      </header>

      <main className="grid gap-6 px-6 py-6 lg:grid-cols-[2fr,1fr]">
        <section className="relative min-h-[520px] rounded-xl overflow-hidden border border-slate-700">
          {!MAPBOX_TOKEN && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/90">
              <p className="max-w-md text-center text-lg">
                Provide <code>REACT_APP_MAPBOX_TOKEN</code> to render the interactive map.
              </p>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-500 border-t-white animate-spin" aria-hidden />
              <span className="sr-only">Loading map data…</span>
            </div>
          )}
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle={MAP_STYLE}
            initialViewState={INITIAL_VIEW_STATE}
            style={{ width: '100%', height: '100%' }}
          >
            <Source id="regions" type="geojson" data={featureCollection}>
              <Layer
                id="region-fill"
                type="fill"
                paint={{
                  'fill-color': ['coalesce', ['get', 'leader_color'], '#1f2937'],
                  'fill-opacity': 0.7,
                }}
              />
              <Layer
                id="region-outline"
                type="line"
                paint={{ 'line-color': '#ffffff', 'line-width': 1 }}
              />
            </Source>
            <NavigationControl position="bottom-right" />
          </Map>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-300">Region</span>
                <select
                  value={selectedRegion ?? ''}
                  onChange={handleRegionChange}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">All regions</option>
                  {(options.regions ?? []).map((regionOption) => (
                    <option key={regionOption.id} value={regionOption.id}>
                      {regionOption.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Constituency</span>
                <select
                  value={selectedConstituency ?? ''}
                  onChange={handleConstituencyChange}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  disabled={!selectedRegion || (options.constituencies ?? []).length === 0}
                >
                  <option value="">All constituencies</option>
                  {(options.constituencies ?? []).map((constituencyOption) => (
                    <option key={constituencyOption.id} value={constituencyOption.id}>
                      {constituencyOption.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="text-lg font-semibold mb-3">Leading Candidates</h2>
            <ul className="space-y-3">
              {candidates.length === 0 && <li className="text-sm text-slate-400">No results yet.</li>}
              {candidates.map((candidate) => (
                <li key={candidate.candidate_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{candidate.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-300 uppercase tracking-wide">
                      {candidate.party_name || candidate.party || 'Independent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatNumber(candidate.total_votes)}</p>
                    <p className="text-xs text-slate-300">{formatPercent(candidate.vote_share)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="text-lg font-semibold mb-3">Areas reporting</h2>
            <ul className="max-h-64 space-y-3 overflow-auto pr-2">
              {features.length === 0 && <li className="text-sm text-slate-400">Awaiting first submissions.</li>}
              {features.map((feature) => (
                <li key={feature.id} className="flex justify-between gap-4 border-b border-slate-700 pb-2 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{feature.name}</p>
                    <p className="text-xs text-slate-400">
                      {feature.leader?.name ? `Lead: ${feature.leader.name} (${feature.leader.party})` : 'No leader yet'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-300">
                    <p>{formatNumber(feature.reporting?.reporting)} / {formatNumber(feature.reporting?.total_stations)}</p>
                    <p>{formatPercent(feature.reporting?.reporting_percent)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {error && (
        <div className="px-6 pb-6" role="alert" aria-live="assertive">
          <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
