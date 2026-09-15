'use client';

import * as React from 'react';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Eye,
  FileText,
  KeyRound,
  Lock,
  Menu,
  RotateCcw,
  Ruler,
  Save,
  Search,
  Settings,
  Trash2,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  clearCalculations,
  deleteCalculation,
  loadCalculations,
  type SavedCalculation,
} from '../lib/calculationStore';
import { formatLKR } from '../lib/calculations';
import {
  DEFAULT_ROOM_SIZES,
  ROOM_META,
  getRoomSizes,
  getShowSqft,
  resetRoomConfig,
  saveRoomSizes,
  setShowSqft,
  type RoomKey,
} from '../lib/roomConfig';
import { getAdminUsername, updateAdminCredentials } from '../lib/adminAuth';
import { cn } from './ui/utils';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor'];

type Section = 'calculations' | 'rooms' | 'analytics' | 'settings';

const NAV_ITEMS: { id: Section; label: string; icon: typeof FileText; blurb: string }[] = [
  { id: 'calculations', label: 'Calculations', icon: FileText, blurb: 'All submitted estimates' },
  { id: 'rooms', label: 'Room Sizes', icon: Ruler, blurb: 'Edit sqft per room + visibility' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, blurb: 'Volume, value & roof mix' },
  { id: 'settings', label: 'Settings', icon: Settings, blurb: 'Login & danger zone' },
];

const PIE_COLORS = ['#ED9420', '#2D3748', '#38bdf8', '#22c55e', '#a78bfa'];

function exportCsv(records: SavedCalculation[]) {
  const header = [
    'Date',
    'Name',
    'Phone',
    'Email',
    'Location',
    'Perches',
    'Stories',
    'Total Sqft',
    'Roof',
    'Total Cost (LKR)',
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = records.map((r) =>
    [
      new Date(r.updatedAt).toLocaleString(),
      r.user.fullName,
      r.user.phone,
      r.user.email,
      r.user.location,
      r.perches,
      r.stories,
      Math.round(r.totals.totalSqft),
      r.totals.roofName,
      Math.round(r.totals.totalCost),
    ]
      .map(esc)
      .join(',')
  );
  const blob = new Blob([[header.map(esc).join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bismark-calculations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard({ onBack, onLock }: { onBack: () => void; onLock: () => void }) {
  const [active, setActive] = React.useState<Section>('calculations');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [records, setRecords] = React.useState<SavedCalculation[]>([]);
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<SavedCalculation | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [confirmClear, setConfirmClear] = React.useState(false);
  const [clearInput, setClearInput] = React.useState('');
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [resetInput, setResetInput] = React.useState('');
  const [roomSizes, setRoomSizes] = React.useState<Record<RoomKey, number>>(DEFAULT_ROOM_SIZES);
  const [showSqft, setShowSqftState] = React.useState(true);
  const [newUsername, setNewUsername] = React.useState(getAdminUsername());
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [credError, setCredError] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => setRecords(loadCalculations()), []);

  React.useEffect(() => {
    refresh();
    setRoomSizes(getRoomSizes());
    setShowSqftState(getShowSqft());
  }, [refresh]);

  const filtered = records.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [r.user.fullName, r.user.phone, r.user.email, r.user.location]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  const totalValue = records.reduce((s, r) => s + r.totals.totalCost, 0);
  const avgValue = records.length > 0 ? totalValue / records.length : 0;

  const dailyData = React.useMemo(() => {
    const days: { date: string; label: string; count: number; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        count: 0,
        value: 0,
      });
    }
    const map = new Map(days.map((d) => [d.date, d]));
    records.forEach((r) => {
      const key = new Date(r.updatedAt).toISOString().slice(0, 10);
      const slot = map.get(key);
      if (slot) {
        slot.count += 1;
        slot.value += r.totals.totalCost;
      }
    });
    return days;
  }, [records]);

  const roofData = React.useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => map.set(r.totals.roofName, (map.get(r.totals.roofName) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [records]);

  const storiesData = React.useMemo(() => {
    const map = new Map<number, number>();
    records.forEach((r) => map.set(r.stories, (map.get(r.stories) ?? 0) + 1));
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([stories, count]) => ({ name: `${stories} ${stories === 1 ? 'Story' : 'Stories'}`, count }));
  }, [records]);

  const roofValueData = React.useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    records.forEach((r) => {
      const e = map.get(r.totals.roofName) ?? { count: 0, value: 0 };
      e.count += 1;
      e.value += r.totals.totalCost;
      map.set(r.totals.roofName, e);
    });
    return [...map.entries()]
      .map(([name, v]) => ({ name, ...v, avg: v.count > 0 ? v.value / v.count : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const locationData = React.useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    records.forEach((r) => {
      const loc = (r.user.location || 'Unknown').trim() || 'Unknown';
      const e = map.get(loc) ?? { count: 0, value: 0 };
      e.count += 1;
      e.value += r.totals.totalCost;
      map.set(loc, e);
    });
    return [...map.entries()]
      .map(([location, v]) => ({ location, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [records]);

  const portfolio = React.useMemo(() => {
    const totalSqft = records.reduce((s, r) => s + r.totals.totalSqft, 0);
    const totalPerches = records.reduce((s, r) => s + r.perches, 0);
    const maxQuote = records.reduce((m, r) => Math.max(m, r.totals.totalCost), 0);
    return {
      totalSqft,
      avgPerches: records.length > 0 ? totalPerches / records.length : 0,
      avgArea: records.length > 0 ? totalSqft / records.length : 0,
      maxQuote,
    };
  }, [records]);

  const recentRecords = React.useMemo(
    () =>
      [...records]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .slice(0, 5),
    [records]
  );

  const handleSaveRooms = () => {
    saveRoomSizes(roomSizes);
    setShowSqft(showSqft);
    toast.success('Room sizes updated. Calculator uses the new values.');
  };

  const handleResetRooms = () => {
    resetRoomConfig();
    setRoomSizes(getRoomSizes());
    setShowSqftState(getShowSqft());
    setConfirmReset(false);
    setResetInput('');
    toast.success('Room sizes reset to defaults.');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCalculation(deleteId);
    setDeleteId(null);
    refresh();
    toast.success('Calculation deleted.');
  };

  const handleClear = () => {
    clearCalculations();
    setConfirmClear(false);
    setClearInput('');
    refresh();
    toast.success('All calculations cleared.');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const u = newUsername.trim();
    if (u.length < 3) {
      setCredError('Username must be at least 3 characters.');
      return;
    }
    if (newPassword.length < 4) {
      setCredError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredError('Passwords do not match.');
      return;
    }
    updateAdminCredentials(u, newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setCredError(null);
    toast.success('Admin login updated.');
  };

  const go = (s: Section) => {
    setActive(s);
    setSidebarOpen(false);
  };

  const activeMeta = NAV_ITEMS.find((n) => n.id === active)!;

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-clip">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle admin menu"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-neutral-400">
              {activeMeta.label} — {activeMeta.blurb}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={18} />
            Calculator
          </Button>
          <Button variant="outline" onClick={onLock}>
            <Lock size={18} />
            Lock
          </Button>
          <Button
            variant="outline"
            disabled={records.length === 0}
            onClick={() => exportCsv(filtered)}
          >
            <Download size={18} />
            Export CSV
          </Button>
          <Button
            variant="destructive"
            disabled={records.length === 0}
            onClick={() => { setClearInput(''); setConfirmClear(true); }}
          >
            <Trash2 size={18} />
            Clear All
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-full lg:w-60 shrink-0 lg:sticky lg:top-8',
            sidebarOpen ? 'block' : 'hidden lg:block'
          )}
        >
          <nav className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 shadow-sm">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    isActive
                      ? 'bg-[#ED9420]/10 text-[#ED9420] font-semibold'
                      : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  )}
                >
                  <Icon size={19} className="shrink-0" />
                  <span>
                    <span className="block text-sm leading-tight">{item.label}</span>
                    {item.id === 'calculations' && records.length > 0 && (
                      <span className="block text-xs font-normal opacity-70">
                        {records.length} records
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            <div className="mt-2 border-t border-gray-200 dark:border-neutral-800 px-3 py-2 text-xs text-gray-500 dark:text-neutral-500">
              Signed in as <span className="font-semibold">{getAdminUsername()}</span>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {active === 'calculations' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Total Calculations
                    </CardTitle>
                    <FileText size={18} className="text-[#ED9420]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {records.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Total Quoted Value
                    </CardTitle>
                    <Wallet size={18} className="text-[#ED9420]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {formatLKR(totalValue)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Average Quote
                    </CardTitle>
                    <Users size={18} className="text-[#ED9420]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {formatLKR(avgValue)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Search + table */}
              <Card>
                <CardHeader>
                  <div className="relative max-w-sm">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search name, phone, email, location..."
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filtered.length === 0 ? (
                    <div className="py-12 text-center">
                      <FileText size={40} className="mx-auto mb-3 text-gray-300 dark:text-neutral-700" />
                      <p className="font-medium text-gray-900 dark:text-neutral-100">
                        {records.length === 0 ? 'No calculations yet' : 'No matches found'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {records.length === 0
                          ? 'Completed estimates will appear here automatically.'
                          : 'Try a different search term.'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-neutral-800">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Land</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>
                                <p className="font-medium">{r.user.fullName || '-'}</p>
                                <p className="text-xs text-muted-foreground">{r.user.phone}</p>
                              </TableCell>
                              <TableCell className="max-w-40 truncate">{r.user.location || '-'}</TableCell>
                              <TableCell>
                                {r.perches} P
                                <span className="text-muted-foreground"> · {r.stories}st</span>
                              </TableCell>
                              <TableCell>{Math.round(r.totals.totalSqft).toLocaleString()} sqft</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-semibold">
                                  {formatLKR(r.totals.totalCost)}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                {new Date(r.updatedAt).toLocaleDateString('en-GB')}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
                                    <Eye size={18} />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                                    <Trash2 size={18} className="text-destructive" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {active === 'rooms' && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg font-bold">Room Sizes (sqft each)</CardTitle>
                    <CardDescription>
                      These values drive Ground Floor / Space Planning totals. Changes apply instantly.
                    </CardDescription>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                    <Switch checked={showSqft} onCheckedChange={setShowSqftState} />
                    Show sqft labels
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROOM_META.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 dark:border-neutral-800 px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{label}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          max={100000}
                          value={roomSizes[key]}
                          onChange={(e) =>
                            setRoomSizes((s) => ({ ...s, [key]: Math.max(0, Number(e.target.value) || 0) }))
                          }
                          className="w-24 text-right"
                          aria-label={`${label} sqft`}
                        />
                        <span className="text-xs text-muted-foreground">sqft</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={handleSaveRooms} className="bg-[#ED9420] hover:bg-[#d67f12] font-semibold">
                    <Save size={18} />
                    Save Room Settings
                  </Button>
                  <Button variant="outline" onClick={() => { setResetInput(''); setConfirmReset(true); }}>
                    <RotateCcw size={18} />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === 'analytics' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Estimates (14 days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {dailyData.reduce((s, d) => s + d.count, 0)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Quoted Value (14 days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {formatLKR(dailyData.reduce((s, d) => s + d.value, 0))}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Roof Options Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {roofData.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Total Area Quoted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {Math.round(portfolio.totalSqft).toLocaleString()}
                      <span className="text-base font-medium text-gray-500 dark:text-neutral-400"> sqft</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Avg Land / Avg Build Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {portfolio.avgPerches.toFixed(1)}
                      <span className="text-base font-medium text-gray-500 dark:text-neutral-400"> P · </span>
                      {Math.round(portfolio.avgArea).toLocaleString()}
                      <span className="text-base font-medium text-gray-500 dark:text-neutral-400"> sqft</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Largest Quote
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 break-words">
                      {records.length > 0 ? formatLKR(portfolio.maxQuote) : formatLKR(0)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Submissions — last 14 days</CardTitle>
                  <CardDescription>Estimates completed per day</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ED9420" radius={[6, 6, 0, 0]} name="Estimates" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Quoted value trend — last 14 days</CardTitle>
                  <CardDescription>Total LKR quoted per day</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v: number) => `${Math.round(v / 1000000)}M`}
                      />
                      <Tooltip formatter={(v: number | undefined) => formatLKR(v ?? 0)} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ED9420"
                        fill="#ED9420"
                        fillOpacity={0.25}
                        name="Quoted value"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Roof type mix</CardTitle>
                    <CardDescription>Share of estimates by roof option</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {roofData.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                        No data yet — completed estimates will appear here.
                      </p>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={roofData} dataKey="value" nameKey="name" outerRadius={90} label>
                              {roofData.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Stories distribution</CardTitle>
                    <CardDescription>Estimates by number of stories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {storiesData.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                        No data yet — completed estimates will appear here.
                      </p>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={storiesData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2D3748" radius={[0, 6, 6, 0]} name="Estimates" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Value by roof type</CardTitle>
                    <CardDescription>Count, total and average quote per roof</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {roofValueData.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                        No data yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-neutral-800">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Roof</TableHead>
                              <TableHead className="text-right">Estimates</TableHead>
                              <TableHead className="text-right">Total Value</TableHead>
                              <TableHead className="text-right">Avg Quote</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roofValueData.map((r) => (
                              <TableRow key={r.name}>
                                <TableCell className="font-medium">{r.name}</TableCell>
                                <TableCell className="text-right">{r.count}</TableCell>
                                <TableCell className="text-right font-semibold">{formatLKR(r.value)}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{formatLKR(r.avg)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Top locations</CardTitle>
                    <CardDescription>Most requested building locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {locationData.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                        No data yet.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {locationData.map((l, i) => (
                          <li key={l.location} className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ED9420]/10 text-sm font-bold text-[#ED9420]">
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">
                                {l.location}
                              </p>
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                                <div
                                  className="h-full rounded-full bg-[#ED9420]"
                                  style={{
                                    width: `${Math.max(4, (l.count / locationData[0].count) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              <p className="font-semibold text-gray-900 dark:text-neutral-100">
                                {l.count} {l.count === 1 ? 'estimate' : 'estimates'}
                              </p>
                              <p>{formatLKR(l.value)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent estimates</CardTitle>
                  <CardDescription>Latest 5 submissions — click the eye icon for detail</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentRecords.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                      No data yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-neutral-800">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Area</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentRecords.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-medium">{r.user.fullName || '-'}</TableCell>
                              <TableCell className="max-w-40 truncate">{r.user.location || '-'}</TableCell>
                              <TableCell className="text-right">
                                {Math.round(r.totals.totalSqft).toLocaleString()} sqft
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="secondary" className="font-semibold">
                                  {formatLKR(r.totals.totalCost)}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-right text-sm text-muted-foreground">
                                {new Date(r.updatedAt).toLocaleDateString('en-GB')}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
                                  <Eye size={18} />
                                  <span className="sr-only">View</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {active === 'settings' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <KeyRound size={19} className="text-[#ED9420]" />
                    <CardTitle className="text-lg font-bold">Admin Login</CardTitle>
                  </div>
                  <CardDescription>Change the username and password used at /admin.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveCredentials} className="max-w-sm space-y-4">
                    <Field>
                      <FieldLabel htmlFor="settings-username">Username</FieldLabel>
                      <Input
                        id="settings-username"
                        value={newUsername}
                        onChange={(e) => {
                          setNewUsername(e.target.value);
                          setCredError(null);
                        }}
                        autoComplete="username"
                      />
                    </Field>
                    <Field data-invalid={Boolean(credError)}>
                      <FieldLabel htmlFor="settings-password">New password</FieldLabel>
                      <Input
                        id="settings-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setCredError(null);
                        }}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field data-invalid={Boolean(credError)}>
                      <FieldLabel htmlFor="settings-confirm">Confirm password</FieldLabel>
                      <Input
                        id="settings-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setCredError(null);
                        }}
                        placeholder="Repeat new password"
                        autoComplete="new-password"
                      />
                      {credError && <FieldError>{credError}</FieldError>}
                    </Field>
                    <Button type="submit" className="bg-[#ED9420] hover:bg-[#d67f12] font-semibold">
                      <Save size={18} />
                      Save Login
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-destructive/40">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for this browser.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => { setResetInput(''); setConfirmReset(true); }}>
                    <RotateCcw size={18} />
                    Reset Room Sizes
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={records.length === 0}
                    onClick={() => { setClearInput(''); setConfirmClear(true); }}
                  >
                    <Trash2 size={18} />
                    Clear All Calculations
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.user.fullName || 'Calculation detail'}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selected.updatedAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selected.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selected.user.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{selected.user.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Land</p>
                    <p className="font-medium">
                      {selected.perches} Perches (
                      {Math.round(selected.totals.totalLandSqft).toLocaleString()} sqft)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stories</p>
                    <p className="font-medium">{selected.stories}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Roof</p>
                    <p className="font-medium">{selected.totals.roofName}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-medium">Floors</p>
                  <div className="space-y-2 text-sm">
                    {selected.floors.map((f, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-gray-50 dark:bg-neutral-800 px-3 py-2"
                      >
                        <span className="font-medium">{FLOOR_NAMES[i] ?? `Floor ${i + 1}`}: </span>
                        <span className="text-muted-foreground">
                          Living {f.livingAreas}, Dining {f.diningAreas}, Pantry {f.pantries},
                          Kitchen {f.kitchens}, Parking {f.parkings}, Rooms {f.rooms}, Baths{' '}
                          {f.bathrooms}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#ED9420] to-[#d67f12] p-4 text-white">
                  <p className="text-sm opacity-90">Total Estimated Cost</p>
                  <p className="text-2xl font-bold">{formatLKR(selected.totals.totalCost)}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this calculation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear-all confirm — typed confirmation */}
      <AlertDialog open={confirmClear} onOpenChange={(open) => { setConfirmClear(open); if (!open) setClearInput(''); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all calculations?</AlertDialogTitle>
            <AlertDialogDescription>
              All {records.length} saved records will be permanently removed. This action cannot be
              undone. Type <code className="rounded bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono font-semibold">CLEAR</code> below
              to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={clearInput}
            onChange={(e) => setClearInput(e.target.value)}
            placeholder="Type CLEAR to confirm"
            autoComplete="off"
            className="font-mono"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              disabled={clearInput.trim() !== 'CLEAR'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset room sizes confirm — typed confirmation */}
      <AlertDialog open={confirmReset} onOpenChange={(open) => { setConfirmReset(open); if (!open) setResetInput(''); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset room sizes?</AlertDialogTitle>
            <AlertDialogDescription>
              All custom sqft values and the label visibility toggle will revert to defaults. This
              action cannot be undone. Type <code className="rounded bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono font-semibold">RESET</code> below
              to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={resetInput}
            onChange={(e) => setResetInput(e.target.value)}
            placeholder="Type RESET to confirm"
            autoComplete="off"
            className="font-mono"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetRooms}
              disabled={resetInput.trim() !== 'RESET'}
              className="disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset to Defaults
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
