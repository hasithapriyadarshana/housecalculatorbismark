'use client';

import * as React from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Lock,
  Search,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  clearCalculations,
  deleteCalculation,
  loadCalculations,
  type SavedCalculation,
} from '../lib/calculationStore';
import { formatLKR } from '../lib/calculations';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
  const [records, setRecords] = React.useState<SavedCalculation[]>([]);
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<SavedCalculation | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const refresh = React.useCallback(() => setRecords(loadCalculations()), []);

  React.useEffect(() => {
    refresh();
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
    refresh();
    toast.success('All calculations cleared.');
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 dark:text-neutral-400">
            All house cost calculations submitted through the estimator
          </p>
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
            onClick={() => setConfirmClear(true)}
          >
            <Trash2 size={18} />
            Clear All
          </Button>
        </div>
      </div>

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
            <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
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
            <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
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
            <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
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

      {/* Clear-all confirm */}
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all calculations?</AlertDialogTitle>
            <AlertDialogDescription>
              All {records.length} saved records will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
