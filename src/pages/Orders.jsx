import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpDown,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LayoutGrid,
  Package,
  PackageSearch,
  RefreshCw,
  Rocket,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { ordersApi } from '../api/orders';
import { formatCurrency } from '../utils/format';
import { FILTER_GROUPS, SORT_OPTIONS, isLiveStatus, stageIndex, summarize } from '../utils/orderStatus';
import OrderCard from '../components/orders/OrderCard';
import OrderDetailDrawer from '../components/orders/OrderDetailDrawer';
import StatusPill from '../components/orders/StatusPill';

const ORDERS_PAGE_SIZE = 12;

function StatTile({ icon: Icon, label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'border-stone-200 bg-white',
    accent: 'border-amber-200 bg-linear-to-br from-white to-amber-50/80',
    good: 'border-emerald-200 bg-linear-to-br from-white to-emerald-50/70',
    alert: 'border-rose-200 bg-linear-to-br from-white to-rose-50/60',
  };
  const iconTones = {
    default: 'bg-stone-100 text-slate-600',
    accent: 'bg-amber-100 text-primary',
    good: 'bg-emerald-100 text-emerald-700',
    alert: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className={`rounded-2xl border p-3 shadow-sm transition hover:shadow-md sm:p-4 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-1.5">
        <span className="font-mono text-[9px] font-bold uppercase leading-tight tracking-wider text-stone-500 sm:text-[9px]">
          {label}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl sm:h-8 sm:w-8 ${iconTones[tone]}`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      </div>
      <p className="mt-2 font-syne text-lg font-extrabold leading-tight tracking-tight text-[#1f1914] wrap-break-word sm:text-2xl">
        {value}
      </p>
      {hint && <p className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-snug text-stone-500 sm:truncate sm:text-[11px]">{hint}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="h-1.5 w-full rounded-full bg-stone-200" />
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-stone-200" />
          <div className="h-3 w-24 rounded bg-stone-100" />
        </div>
        <div className="h-6 w-28 rounded-full bg-stone-200" />
      </div>
      <div className="mt-5 h-1.5 w-full rounded-full bg-stone-100" />
      <div className="mt-5 h-24 w-full rounded-2xl bg-stone-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-24 rounded-lg bg-stone-100" />
        <div className="h-6 w-20 rounded-lg bg-stone-100" />
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
        <div className="h-5 w-24 rounded bg-stone-200" />
        <div className="h-8 w-32 rounded-xl bg-stone-200" />
      </div>
    </div>
  );
}

function EmptyState({ filterId, onReset }) {
  const filtered = filterId !== 'ALL';
  return (
    <div className="col-span-full overflow-hidden rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center shadow-sm sm:px-6 sm:py-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-primary sm:h-16 sm:w-16">
        <PackageSearch className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <h3 className="mt-5 font-syne text-lg font-extrabold text-[#1f1914] sm:text-xl">
        {filtered ? 'No orders match this filter' : 'No orders yet'}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
        {filtered
          ? 'Try switching to another status tab or clearing your search to see the rest of your shipments.'
          : 'Book your first parcel and it will appear here with live status, rider details, and a full charge breakdown.'}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        {filtered && (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-stone-100"
            onClick={onReset}
            type="button"
          >
            <RefreshCw className="h-4 w-4 shrink-0" /> Reset filters
          </button>
        )}
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-5 py-3 text-sm font-bold text-white shadow-md transition hover:from-primary-container hover:to-primary"
          to="/book-delivery"
        >
          <Rocket className="h-4 w-4 shrink-0" /> Book a Parcel
        </Link>
      </div>
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [serverTotal, setServerTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [filterId, setFilterId] = useState('ALL');
  const [sortId, setSortId] = useState('newest');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const loadOrders = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await ordersApi.getAll({ page, limit: ORDERS_PAGE_SIZE });
      setOrders(res.data.data || []);
      setServerTotal(res.data.pagination?.total ?? (res.data.data || []).length);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load your orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    const timerId = window.setTimeout(loadOrders, 0);
    return () => window.clearTimeout(timerId);
  }, [loadOrders]);

  const stats = useMemo(() => summarize(orders), [orders]);

  const countsByFilter = useMemo(() => {
    const map = {};
    for (const group of FILTER_GROUPS) {
      map[group.id] = orders.filter((order) => group.match(order)).length;
    }
    return map;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const group = FILTER_GROUPS.find((item) => item.id === filterId) || FILTER_GROUPS[0];
    const term = query.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      if (!group.match(order)) return false;
      if (!term) return true;
      const haystack = [
        order.trackingId,
        order.pickupDetails?.name,
        order.pickupDetails?.address,
        order.pickupAddress?.district,
        order.pickupAddress?.area,
        order.deliveryDetails?.name,
        order.deliveryDetails?.address,
        order.deliveryAddress?.district,
        order.deliveryAddress?.area,
        order.parcel?.description,
        order.packageDetails?.description,
        order.pricing?.zone,
        order.rider?.name,
        order.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortId === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortId === 'status') return stageIndex(b.status) - stageIndex(a.status);
      if (sortId === 'amount') return (b.pricing?.deliveryFee || 0) - (a.pricing?.deliveryFee || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sorted;
  }, [orders, filterId, query, sortId]);

  const totalPages = Math.max(1, Math.ceil(serverTotal / ORDERS_PAGE_SIZE));

  const handleTrack = (order) => navigate(`/tracking?id=${encodeURIComponent(order.trackingId)}`);

  const resetFilters = () => {
    setFilterId('ALL');
    setQuery('');
    setSortId('newest');
    setPage(1);
  };

  const activeShipment = useMemo(
    () => visibleOrders.find((order) => isLiveStatus(order.status)) || visibleOrders[0] || null,
    [visibleOrders],
  );

  return (
    <div className="min-h-full bg-surface pb-16 font-sans text-on-surface sm:pb-20">
      {/* Page header */}
      <OrdersHeader
        loadOrders={loadOrders}
        loading={loading}
        refreshing={refreshing}
        serverTotal={serverTotal}
        stats={stats}
      />

      {/* Active spotlight */}
      {!loading && activeShipment && isLiveStatus(activeShipment.status) && filterId === 'ALL' && !query && (
        <OrdersSpotlight
          activeShipment={activeShipment}
          handleTrack={handleTrack}
        />
      )}

      {/* Toolbar */}
      <OrdersMain
        countsByFilter={countsByFilter}
        error={error}
        filterId={filterId}
        handleTrack={handleTrack}
        loadOrders={loadOrders}
        loading={loading}
        page={page}
        query={query}
        resetFilters={resetFilters}
        serverTotal={serverTotal}
        setFilterId={setFilterId}
        setPage={setPage}
        setQuery={setQuery}
        setSelected={setSelected}
        setSortId={setSortId}
        sortId={sortId}
        totalPages={totalPages}
        visibleOrders={visibleOrders}
      />

      <OrderDetailDrawer onClose={() => setSelected(null)} onTrack={handleTrack} order={selected} />
    </div>
  );
}


function OrdersHeader({ loadOrders, loading, refreshing, serverTotal, stats }) {
  return (
<div className="border-b border-stone-200/70 bg-linear-to-br from-white via-[#fff9f5] to-amber-50/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                <Truck className="h-3.5 w-3.5 shrink-0" /> Consignment Command Centre
              </span>
              <h1 className="mt-3 font-syne text-2xl font-extrabold tracking-tight text-[#1f1914] sm:text-4xl lg:text-5xl">
                My <span className="text-primary">Orders</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
                Every parcel you have booked, with live courier status, rider contacts, and a full transparent
                charge breakdown — updated in real time across all 64 districts.
              </p>
            </div>
            <div className="flex w-full items-center gap-2.5 sm:w-auto sm:flex-wrap">
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-primary/50 hover:text-primary sm:flex-none"
                onClick={() => loadOrders({ silent: true })}
                type="button"
              >
                <RefreshCw className={`h-4 w-4 shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing' : 'Refresh'}
              </button>
              <Link
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-container px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition hover:from-primary-container hover:to-primary sm:flex-none"
                to="/book-delivery"
              >
                <Sparkles className="h-4 w-4 shrink-0" /> New Booking
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 lg:grid-cols-5">
            <StatTile
              hint={`${serverTotal} total on record`}
              icon={Package}
              label="Parcels Loaded"
              tone="accent"
              value={loading ? '—' : serverTotal}
            />
            <StatTile
              hint="Still moving through the network"
              icon={Truck}
              label="In Motion"
              value={loading ? '—' : stats.inTransit}
            />
            <StatTile
              hint="Completed consignments"
              icon={Package}
              label="Delivered"
              tone="good"
              value={loading ? '—' : stats.delivered}
            />
            <StatTile
              hint="Freight billed on this page"
              icon={Banknote}
              label="Total Freight"
              value={loading ? '—' : formatCurrency(stats.totalFreight)}
            />
            <StatTile
              hint="To be collected on handover"
              icon={Banknote}
              label="COD Outstanding"
              tone="alert"
              value={loading ? '—' : formatCurrency(stats.codOutstanding)}
            />
          </div>
        </div>
      </div>
  );
}

function OrdersSpotlight({ activeShipment, handleTrack }) {
  return (
<div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <div className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-teal-200 bg-linear-to-r from-teal-50 via-white to-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md sm:h-12 sm:w-12">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-700">
                  Live Shipment in Progress
                </p>
                <p className="mt-0.5 truncate font-syne text-base font-extrabold text-[#1f1914] sm:text-lg">
                  {activeShipment.trackingId}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-stone-600 sm:truncate sm:text-xs">
                  {activeShipment.pickupAddress?.district || 'Origin'} → {activeShipment.deliveryAddress?.district || 'Destination'}
                  {activeShipment.rider?.name ? ` · Rider ${activeShipment.rider.name}` : ''}
                </p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-2.5 sm:w-auto">
              <span className="min-w-0 flex-1 sm:flex-none">
                <StatusPill size="lg" status={activeShipment.status} />
              </span>
              <button
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-teal-700"
                onClick={() => handleTrack(activeShipment)}
                type="button"
              >
                Follow Parcel <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
  );
}

function OrdersMain({ countsByFilter, error, filterId, handleTrack, loadOrders, loading, page, query, resetFilters, serverTotal, setFilterId, setPage, setQuery, setSelected, setSortId, sortId, totalPages, visibleOrders }) {
  return (
<div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-stone-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tracking ID, recipient, district…"
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-slate-700"
                  onClick={() => setQuery('')}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1 lg:flex-none">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                <select
                  aria-label="Sort orders"
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-8 text-xs font-bold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setSortId(event.target.value)}
                  value={sortId}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-stone-400" />
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-500 sm:inline-flex">
                <LayoutGrid className="h-3.5 w-3.5" />
                {visibleOrders.length} shown
              </span>
            </div>
          </div>

          <div className="-mx-3 mt-4 flex items-center gap-2 overflow-x-auto border-t border-stone-100 px-3 pt-3 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 sm:pt-4 [&::-webkit-scrollbar]:hidden">
            <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </span>
            {FILTER_GROUPS.map((group) => {
              const active = filterId === group.id;
              return (
                <button
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition ${
                    active
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-primary/40 hover:text-primary'
                  }`}
                  key={group.id}
                  onClick={() => setFilterId(group.id)}
                  type="button"
                >
                  {group.label}
                  <span className={`ml-1.5 font-mono text-[10px] ${active ? 'text-white/75' : 'text-stone-400'}`}>
                    {countsByFilter[group.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <p className="text-sm font-bold text-rose-900">Orders could not be loaded</p>
                <p className="mt-0.5 text-xs text-rose-700">{error}</p>
              </div>
            </div>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
              onClick={() => loadOrders()}
              type="button"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        )}

        {/* Order grid */}
        <OrdersGrid
          error={error}
          filterId={filterId}
          handleTrack={handleTrack}
          loading={loading}
          resetFilters={resetFilters}
          setSelected={setSelected}
          visibleOrders={visibleOrders}
        />

        {/* Pagination */}
        {!loading && serverTotal > ORDERS_PAGE_SIZE && (
          <OrdersPagination
            page={page}
            serverTotal={serverTotal}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}

        {/* Help banner */}
        <OrdersHelpBanner />
      </div>
  );
}

function OrdersGrid({ error, filterId, handleTrack, loading, resetFilters, setSelected, visibleOrders }) {
  return (
<div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}

          {!loading && !error && visibleOrders.length === 0 && (
            <EmptyState filterId={filterId} onReset={resetFilters} />
          )}

          {!loading &&
            !error &&
            visibleOrders.map((order) => (
              <OrderCard key={order._id} onOpen={setSelected} onTrack={handleTrack} order={order} />
            ))}
        </div>
  );
}

function OrdersHelpBanner() {
  return (
<div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-stone-200 bg-linear-to-r from-primary to-primary-container p-5 text-white shadow-lg sm:mt-8 sm:flex-row sm:items-center sm:p-7">
          <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:h-12 sm:w-12">
              <CircleHelp className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0">
              <h3 className="font-syne text-base font-extrabold sm:text-lg">Need to change a delivery?</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/85 sm:text-sm">
                Our dispatch desk can reschedule slots, redirect parcels, or raise a return for any order still in
                motion. Average response time is under 12 minutes.
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-primary shadow-md transition hover:bg-[#fff9f5]"
              href="tel:09612404040"
            >
              Call 09612-404040
            </a>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
              to="/book-delivery"
            >
              Book Another Parcel
            </Link>
          </div>
        </div>
  );
}

function OrdersPagination({ page, serverTotal, setPage, totalPages }) {
  return (
<nav className="mt-6 flex flex-col items-stretch gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <p className="text-center font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500 sm:text-left">
              Page <span className="text-primary">{page}</span> of {totalPages} · {serverTotal} parcels
            </p>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const target = start + index;
                if (target > totalPages) return null;
                return (
                  <button
                    aria-current={target === page ? 'page' : undefined}
                    aria-label={`Page ${target}`}
                    className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition sm:inline-flex ${
                      target === page
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-stone-200 text-slate-600 hover:border-primary/50 hover:text-primary'
                    }`}
                    key={target}
                    onClick={() => setPage(target)}
                    type="button"
                  >
                    {target}
                  </button>
                );
              })}
              <button
                aria-label="Next page"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                type="button"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </div>
          </nav>
  );
}
