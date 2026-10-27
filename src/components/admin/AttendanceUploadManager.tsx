'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Search,
  Download,
  Trash2,
  Check,
  X,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown,
  Filter,
} from 'lucide-react';

interface Cohort {
  id: string;
  name: string;
  [key: string]: any;
}

interface AttendanceUploadManagerProps {
  allSessions: any[];
  liveClassEvents: any[];
  cohorts: Cohort[];
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  onAttendanceUpdated: () => void;
}

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  attended: boolean;
}

export function AttendanceUploadManager({
  allSessions,
  liveClassEvents,
  cohorts,
  fetchWithAuth,
  onAttendanceUpdated,
}: AttendanceUploadManagerProps) {
  // Navigation mode
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'guide'>('upload');

  // CSV Upload states
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventFilterType, setEventFilterType] = useState<'all' | 'sessions' | 'events'>('all');
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    processed?: number;
    matched?: number;
    errors?: string[];
  } | null>(null);

  // Manual Roster states
  const [manualCohortId, setManualCohortId] = useState<string>('');
  const [manualSessionId, setManualSessionId] = useState<string>('');
  const [rosterStudents, setRosterStudents] = useState<StudentRosterItem[]>([]);
  const [rosterSearch, setRosterSearch] = useState<string>('');
  const [loadingRoster, setLoadingRoster] = useState<boolean>(false);
  const [savingRoster, setSavingRoster] = useState<boolean>(false);
  const [rosterMessage, setRosterMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered sessions (non-cancelled)
  const activeSessions = useMemo(() => {
    return allSessions.filter((s: any) => s.status !== 'cancelled');
  }, [allSessions]);

  // Combined options for CSV upload selector
  const combinedEventOptions = useMemo(() => {
    const list: Array<{
      id: string;
      value: string;
      title: string;
      dateLabel: string;
      group: 'Session' | 'Event';
      cohortName?: string;
    }> = [];

    // Cohort sessions
    activeSessions.forEach((session: any) => {
      const cohortName =
        session.cohorts?.name ||
        cohorts.find((c) => c.id === session.cohort_id)?.name ||
        'Cohort';
      const dateLabel = session.session_date
        ? new Date(session.session_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '';
      const sessionTitle = `${cohortName} - Session ${session.session_number || ''}${
        session.topic ? `: ${session.topic}` : ''
      }`;

      list.push({
        id: String(session.id),
        value: `session-${session.id}`,
        title: sessionTitle,
        dateLabel,
        group: 'Session',
        cohortName,
      });
    });

    // Other events
    liveClassEvents.forEach((e: any) => {
      const dateLabel = e.start_time
        ? new Date(e.start_time).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '';

      list.push({
        id: String(e.id),
        value: String(e.id),
        title: e.name || 'Untitled Event',
        dateLabel,
        group: 'Event',
      });
    });

    return list;
  }, [activeSessions, liveClassEvents, cohorts]);

  // Filtered event options based on category and search
  const filteredEventOptions = useMemo(() => {
    return combinedEventOptions.filter((item) => {
      if (eventFilterType === 'sessions' && item.group !== 'Session') return false;
      if (eventFilterType === 'events' && item.group !== 'Event') return false;
      if (eventSearchQuery) {
        const query = eventSearchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.dateLabel.toLowerCase().includes(query) ||
          (item.cohortName && item.cohortName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [combinedEventOptions, eventFilterType, eventSearchQuery]);

  const selectedEventDetails = useMemo(() => {
    if (!selectedEventId) return null;
    return combinedEventOptions.find((e) => e.value === selectedEventId) || null;
  }, [selectedEventId, combinedEventOptions]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
      setUploadResult({
        success: false,
        message: 'Invalid file format. Please upload a .csv file exported from Google Meet.',
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadResult({
        success: false,
        message: 'File size exceeds maximum allowed size of 5MB.',
      });
      return;
    }
    setUploadResult(null);
    setSelectedFile(file);
  };

  // Submit CSV Upload
  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadResult({ success: false, message: 'Please select a CSV file to upload.' });
      return;
    }
    if (!selectedEventId) {
      setUploadResult({ success: false, message: 'Please select an event or session first.' });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('eventId', selectedEventId);

      const res = await fetchWithAuth('/api/admin/attendance/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload attendance CSV.');
      }

      setUploadResult({
        success: true,
        message: `Successfully processed ${data.processed || 0} records! Matched ${data.matched || 0} students to active profiles.`,
        processed: data.processed,
        matched: data.matched,
        errors: data.errors,
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onAttendanceUpdated();
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: err?.message || 'Failed to upload attendance file. Please check file format.',
      });
    } finally {
      setUploading(false);
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const csvContent =
      'Email,Name,Join Time,Leave Time,Duration (minutes)\n' +
      'student1@example.com,Abebe Bikila,2026-10-27 14:00:00,2026-10-27 15:30:00,90\n' +
      'student2@example.com,Sara Tesfay,2026-10-27 14:05:00,2026-10-27 15:28:00,83\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'google-meet-attendance-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Cohort Sessions for Manual Marking
  const cohortSessions = useMemo(() => {
    if (!manualCohortId) return [];
    return activeSessions
      .filter((s: any) => String(s.cohort_id) === String(manualCohortId))
      .sort((a: any, b: any) => (Number(a.session_number) || 0) - (Number(b.session_number) || 0));
  }, [activeSessions, manualCohortId]);

  // Load manual attendance student roster
  const loadRoster = useCallback(
    async (cohortId: string, sessionId: string) => {
      if (!cohortId || !sessionId) {
        setRosterStudents([]);
        return;
      }

      setLoadingRoster(true);
      setRosterMessage(null);

      try {
        const cleanSessionId = sessionId.replace(/^session-/, '');
        const [studentsRes, attendanceRes] = await Promise.all([
          fetchWithAuth(`/api/admin/students/all?limit=5000&cohort_id=${encodeURIComponent(cohortId)}`),
          fetchWithAuth(`/api/admin/attendance?event_id=${encodeURIComponent(cleanSessionId)}&limit=5000`),
        ]);

        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        if (!studentsRes.ok) {
          throw new Error(studentsData?.error || 'Failed to load cohort students');
        }

        const attendedSet = new Set<string>(
          ((attendanceData?.records || []) as Array<{ studentId?: string }>).map((r) => r.studentId).filter(Boolean) as string[]
        );

        const mapped: StudentRosterItem[] = ((studentsData?.students || []) as any[]).map((s) => ({
          id: String(s.id),
          name: String(s.name || 'Unnamed Student'),
          email: String(s.email || ''),
          attended: attendedSet.has(String(s.id)),
        }));

        // Sort by name
        mapped.sort((a, b) => a.name.localeCompare(b.name));
        setRosterStudents(mapped);
      } catch (err: any) {
        setRosterStudents([]);
        setRosterMessage({
          type: 'error',
          text: err?.message || 'Failed to load students for this session.',
        });
      } finally {
        setLoadingRoster(false);
      }
    },
    [fetchWithAuth]
  );

  // Change manual session
  const handleSessionChange = (sessionId: string) => {
    setManualSessionId(sessionId);
    if (manualCohortId && sessionId) {
      loadRoster(manualCohortId, sessionId);
    } else {
      setRosterStudents([]);
    }
  };

  // Change manual cohort
  const handleCohortChange = (cohortId: string) => {
    setManualCohortId(cohortId);
    setManualSessionId('');
    setRosterStudents([]);
    setRosterMessage(null);
  };

  // Toggle student presence
  const toggleStudent = (studentId: string) => {
    setRosterStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attended: !s.attended } : s))
    );
  };

  // Tick all / Untick all
  const setAllAttendance = (attended: boolean) => {
    setRosterStudents((prev) => prev.map((s) => ({ ...s, attended })));
  };

  // Save manual attendance
  const saveManualAttendance = async () => {
    if (!manualSessionId || !manualCohortId || rosterStudents.length === 0) return;
    setSavingRoster(true);
    setRosterMessage(null);

    try {
      const cleanSessionId = manualSessionId.replace(/^session-/, '');
      const updates = rosterStudents.map((s) => ({ studentId: s.id, attended: s.attended }));

      const res = await fetchWithAuth('/api/admin/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: cleanSessionId,
          updates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save attendance roster.');
      }

      setRosterMessage({
        type: 'success',
        text: `Attendance saved successfully! (${data.attendedCount || 0} present, ${data.notAttendedCount || 0} absent).`,
      });
      onAttendanceUpdated();
    } catch (err: any) {
      setRosterMessage({
        type: 'error',
        text: err?.message || 'Failed to save attendance. Please try again.',
      });
    } finally {
      setSavingRoster(false);
    }
  };

  // Filter roster students by search
  const filteredRosterStudents = useMemo(() => {
    if (!rosterSearch.trim()) return rosterStudents;
    const q = rosterSearch.toLowerCase();
    return rosterStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [rosterStudents, rosterSearch]);

  // Attendance stats for manual mode
  const rosterStats = useMemo(() => {
    const total = rosterStudents.length;
    const present = rosterStudents.filter((s) => s.attended).length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, rate };
  }, [rosterStudents]);

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 shadow-inner">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-50">
                  Attendance Center
                </h2>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                  Live Management
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400 max-w-xl">
                Upload Google Meet attendance reports directly or manually take roll call for live cohort sessions and academy events.
              </p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="inline-flex rounded-xl bg-zinc-950/80 p-1.5 border border-zinc-800/80 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>CSV Import</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Manual Roster</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>Format Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================= TAB 1: CSV UPLOAD ======================= */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Main Upload Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-6 md:p-8 shadow-xl">
            <form onSubmit={handleCsvSubmit} className="space-y-8">
              {/* Step 1: Target Selection */}
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <label className="flex items-center gap-2 text-base font-bold text-zinc-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400 font-bold border border-cyan-500/30">
                        1
                      </span>
                      <span>Select Target Session or Event</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Choose which cohort session or live event this Google Meet log belongs to.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setEventFilterType('all')}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        eventFilterType === 'all'
                          ? 'bg-zinc-800 text-cyan-300'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      All ({combinedEventOptions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventFilterType('sessions')}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        eventFilterType === 'sessions'
                          ? 'bg-zinc-800 text-cyan-300'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Sessions ({activeSessions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventFilterType('events')}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        eventFilterType === 'events'
                          ? 'bg-zinc-800 text-cyan-300'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Events ({liveClassEvents.length})
                    </button>
                  </div>
                </div>

                {/* Dropdown with Search */}
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      required
                      className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-950/70 px-4 py-3.5 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition hover:border-zinc-600"
                    >
                      <option value="">-- Choose an event or cohort session --</option>
                      {filteredEventOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.title} {item.dateLabel ? `(${item.dateLabel})` : ''} [{item.group}]
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  </div>

                  {/* Selected Event Details Preview Card */}
                  {selectedEventDetails && (
                    <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs text-cyan-200 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-100 text-sm">
                            {selectedEventDetails.title}
                          </p>
                          <p className="text-zinc-400">
                            {selectedEventDetails.group} • {selectedEventDetails.dateLabel || 'Scheduled'}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-cyan-300 font-medium">
                        Target Ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: CSV File Dropzone */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="flex items-center gap-2 text-base font-bold text-zinc-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400 font-bold border border-cyan-500/30">
                        2
                      </span>
                      <span>Upload Google Meet CSV File</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Export attendance from Google Meet and drop the CSV file below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Sample CSV</span>
                  </button>
                </div>

                {/* Dropzone Container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/30 ring-4 ring-cyan-500/10'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-zinc-700/80 bg-zinc-950/40 hover:border-zinc-500 hover:bg-zinc-900/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        validateAndSetFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-zinc-100">{selectedFile.name}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                        </p>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 group-hover:scale-105 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 border border-zinc-700 transition">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">
                          Click to browse or drag and drop your CSV here
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Standard Google Meet attendance export (CSV, TXT, up to 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Alert */}
              {uploadResult && (
                <div
                  className={`flex items-start justify-between rounded-2xl border p-4 text-sm animate-fadeIn ${
                    uploadResult.success
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                      : 'border-red-500/30 bg-red-950/20 text-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {uploadResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{uploadResult.message}</p>
                      {uploadResult.errors && uploadResult.errors.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs opacity-90">
                          <p className="font-bold">Warnings:</p>
                          <ul className="list-disc list-inside">
                            {uploadResult.errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadResult(null)}
                    className="text-zinc-400 hover:text-zinc-200 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !selectedEventId}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-500/30"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing Attendance CSV...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload & Process Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: MANUAL ROSTER ======================= */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-6 md:p-8 shadow-xl space-y-6">
            {/* Step 1: Select Cohort & Session */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cohort Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Step 1: Select Cohort
                </label>
                <div className="relative">
                  <select
                    value={manualCohortId}
                    onChange={(e) => handleCohortChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-950/70 px-4 py-3 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">-- Choose Cohort --</option>
                    {cohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Session Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Step 2: Select Session
                </label>
                <div className="relative">
                  <select
                    value={manualSessionId}
                    onChange={(e) => handleSessionChange(e.target.value)}
                    disabled={!manualCohortId || cohortSessions.length === 0}
                    className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-950/70 px-4 py-3 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!manualCohortId
                        ? 'Select a cohort first...'
                        : cohortSessions.length === 0
                        ? 'No sessions found for this cohort'
                        : '-- Choose Session --'}
                    </option>
                    {cohortSessions.map((s: any) => {
                      const dateLabel = s.session_date
                        ? new Date(s.session_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '';
                      return (
                        <option key={s.id} value={s.id}>
                          Session {s.session_number || ''}
                          {s.topic ? `: ${s.topic}` : ''} {dateLabel ? `(${dateLabel})` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Notification message */}
            {rosterMessage && (
              <div
                className={`flex items-start justify-between rounded-2xl border p-4 text-sm animate-fadeIn ${
                  rosterMessage.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                    : 'border-red-500/30 bg-red-950/20 text-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {rosterMessage.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  )}
                  <span>{rosterMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRosterMessage(null)}
                  className="text-zinc-400 hover:text-zinc-200 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Roster Area */}
            {manualCohortId && manualSessionId ? (
              loadingRoster ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                  <p className="text-sm font-medium">Loading enrolled students...</p>
                </div>
              ) : rosterStudents.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-8 text-center text-zinc-400">
                  <Users className="mx-auto h-10 w-10 text-zinc-600 mb-2" />
                  <p className="text-sm font-medium">No enrolled students found for this cohort.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Live Stats Summary Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                      <p className="text-xs text-zinc-500 font-medium">Total Enrolled</p>
                      <p className="text-xl font-bold text-zinc-100 mt-1">{rosterStats.total}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                      <p className="text-xs text-emerald-400 font-medium">Present</p>
                      <p className="text-xl font-bold text-emerald-300 mt-1">{rosterStats.present}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                      <p className="text-xs text-zinc-400 font-medium">Absent</p>
                      <p className="text-xl font-bold text-zinc-400 mt-1">{rosterStats.absent}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                      <p className="text-xs text-cyan-400 font-medium">Turnout Rate</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold text-cyan-300">{rosterStats.rate}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${rosterStats.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter and Quick Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search student by name or email..."
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAllAttendance(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark All Present</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllAttendance(false)}
                        className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700/60 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-800/40">
                    {filteredRosterStudents.map((student) => {
                      const initials = student.name
                        .split(' ')
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <div
                          key={student.id}
                          onClick={() => toggleStudent(student.id)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl p-3.5 transition-all ${
                            student.attended
                              ? 'bg-emerald-950/20 border border-emerald-500/30'
                              : 'bg-zinc-950/40 border border-zinc-800/60 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                student.attended
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {initials || 'ST'}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-zinc-100">
                                {student.name}
                              </p>
                              <p className="truncate text-xs text-zinc-400">{student.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                student.attended
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-zinc-800/60 text-zinc-400'
                              }`}
                            >
                              {student.attended ? 'Present' : 'Absent'}
                            </span>
                            <input
                              type="checkbox"
                              checked={student.attended}
                              onChange={() => toggleStudent(student.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-5 w-5 rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={saveManualAttendance}
                      disabled={savingRoster}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/30"
                    >
                      {savingRoster ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Saving Roster Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Save Session Attendance</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-8 text-center text-zinc-400">
                <Calendar className="mx-auto h-10 w-10 text-zinc-600 mb-2" />
                <p className="text-sm font-medium">
                  Please select both a cohort and a session above to view and edit student attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: FORMAT GUIDE ======================= */}
      {activeTab === 'guide' && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-100">Google Meet CSV Specifications</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Ensure your attendance file contains the required column headers (case-insensitive).
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 text-sm">Email</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-300 font-semibold">
                  Required
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Primary identifier used to match attendees with enrolled student profiles.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-sm">Name</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-semibold">
                  Optional
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Display name exported from Google Meet. Saved for attendance records audit.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-sm">Join Time</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-semibold">
                  Optional
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Timestamp when student joined the meeting (e.g. 2026-10-27 14:00:00).
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-sm">Leave Time</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-semibold">
                  Optional
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Timestamp when student left the meeting session.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-sm">Duration</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-semibold">
                  Optional
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Total attendance duration in minutes (e.g. 90).
              </p>
            </div>
          </div>

          {/* Sample Table Preview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
            <h4 className="text-sm font-bold text-zinc-200">Sample CSV Data Preview:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Join Time</th>
                    <th className="py-2 px-3">Leave Time</th>
                    <th className="py-2 px-3">Duration (minutes)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-cyan-300">student1@example.com</td>
                    <td className="py-2 px-3">Abebe Bikila</td>
                    <td className="py-2 px-3">2026-10-27 14:00:00</td>
                    <td className="py-2 px-3">2026-10-27 15:30:00</td>
                    <td className="py-2 px-3">90</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-300">student2@example.com</td>
                    <td className="py-2 px-3">Sara Tesfay</td>
                    <td className="py-2 px-3">2026-10-27 14:05:00</td>
                    <td className="py-2 px-3">2026-10-27 15:28:00</td>
                    <td className="py-2 px-3">83</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
