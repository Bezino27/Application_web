import { Fragment, useEffect, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import './AdminOrdersPage.css';
import Layout from '../components/layout.tsx';

type ProductType = 'stick' | 'apparel' | 'blade' | 'other';

type AdminOrderItem = {
    id: number;
    product_type: ProductType;
    product_name?: string;
    product_code?: string;
    side?: string;
    height?: string;
    size?: string;
    quantity: number;
    unit_price?: number | string;
    note?: string;
    line_total?: number | string;
};

type AdminOrder = {
    id: number;
    user: number;
    username: string;
    club: number;
    club_name: string;
    status: 'new' | 'processing' | 'done' | 'canceled';
    is_paid: boolean;
    note: string;
    created_at: string;
    total_amount: number | string;
    items: AdminOrderItem[];
};

const formatSK = (iso: string) => {
    const d = new Date(iso);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hh}:${mm}`;
};

export default function AdminClubOrdersPage() {
    const [clubId] = useState<number>(1); // nastav podľa kontextu
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<AdminOrder['status'] | ''>('');
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [editing, setEditing] = useState<Record<number, { total: string; status: AdminOrder['status'] }>>({});

    const fetchOrders = async () => {
        setLoading(true);
        const qs = new URLSearchParams();
        if (status) qs.set('status', status);
        const res = await fetchWithAuth(`/club-orders/${clubId}/?${qs.toString()}`);
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
            const init: typeof editing = {};
            for (const o of data) {
                init[o.id] = { total: String(o.total_amount ?? '0.00'), status: o.status };
            }
            setEditing(init);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const toggle = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEditChange = (orderId: number, field: 'total' | 'status', value: string) => {
        setEditing((prev) => ({
            ...prev,
            [orderId]: { ...prev[orderId], [field]: value },
        }));
    };

    const saveOrderUpdate = async (orderId: number) => {
        const edit = editing[orderId];
        const total = parseFloat(edit.total);

        if (isNaN(total)) {
            alert("Neplatná hodnota pre sumu.");
            return;
        }

        const body = {
            status: edit.status,
            total_amount: total,
            is_paid: false, // Ak chceš neskôr pridať checkbox
            note: `Celková suma upravená na ${total.toFixed(2)} €`
        };

        console.log("Odosielam PUT", body);

        const res = await fetchWithAuth(`/order/${orderId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            await fetchOrders();
        } else {
            const text = await res.text();
            alert('Nepodarilo sa uložiť objednávku.\n\n' + text);
        }
    };

    return (
        <Layout>
        <div className="page">
            <div className="row between center" style={{ marginBottom: 16 }}>
                <h2>Objednávky klubu</h2>
                <div className="row gap">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as AdminOrder['status'] | '')}
                    >
                        <option value="">Všetky</option>
                        <option value="new">Nové</option>
                        <option value="processing"> Prijatá adminom</option>
                        <option value="done">Objednané</option>
                        <option value="canceled">Zrušené</option>
                    </select>
                    <button onClick={fetchOrders}>Obnoviť</button>
                </div>
            </div>

            {loading ? (
                <div>Načítavam…</div>
            ) : orders.length === 0 ? (
                <div>Žiadne objednávky.</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Dátum</th>
                            <th>Stav</th>
                            <th>Zaplatené</th>
                            <th>Používateľ</th>
                            <th>Spolu (€)</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((o) => {
                            const isEditing = editing[o.id];
                            return (
                                <Fragment key={o.id}>
                                    <tr>
                                        <td>{o.id}</td>
                                        <td>{formatSK(o.created_at)}</td>
                                        <td>
                                            <select
                                                value={isEditing?.status ?? o.status}
                                                onChange={(e) =>
                                                    handleEditChange(o.id, 'status', e.target.value)
                                                }
                                            >
                                                <option value="new">Nové</option>
                                                <option value="processing"> Prijatá adminom</option>
                                                <option value="done">Objednané</option>
                                                <option value="canceled">Zrušené</option>
                                            </select>
                                        </td>
                                        <td>{o.is_paid ? 'Áno' : 'Nie'}</td>
                                        <td>{o.username}</td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={isEditing?.total}
                                                onChange={(e) =>
                                                    handleEditChange(o.id, 'total', e.target.value)
                                                }
                                                style={{ width: 80 }}
                                            /> €
                                        </td>
                                        <td>
                                            <button onClick={() => toggle(o.id)}>
                                                {expanded[o.id] ? 'Skryť' : 'Detail'}
                                            </button>
                                            <button onClick={() => saveOrderUpdate(o.id)}>
                                                Uložiť
                                            </button>
                                        </td>
                                    </tr>

                                    {expanded[o.id] && (
                                        <tr>
                                            <td colSpan={7} style={{ background: '#fafafa' }}>
                                                <div style={{ padding: 12 }}>
                                                    {o.note && (
                                                        <div style={{ marginBottom: 8 }}>
                                                            <b>Poznámka:</b> {o.note}
                                                        </div>
                                                    )}
                                                    <table className="subtable">
                                                        <thead>
                                                        <tr>
                                                            <th>Produkt</th>
                                                            <th>Kód</th>
                                                            <th>Typ</th>
                                                            <th>Parametre</th>
                                                            <th>Množstvo</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {o.items.map((it) => {
                                                            const qty = Number(it.quantity ?? 1);
                                                            return (
                                                                <tr key={it.id}>
                                                                    <td>{it.product_name || '-'}</td>
                                                                    <td>{it.product_code || '-'}</td>
                                                                    <td>{it.product_type}</td>
                                                                    <td>
                                                                        {[
                                                                            it.size && `veľ.: ${it.size}`,
                                                                            it.height && `výš.: ${it.height}`,
                                                                            it.side && `str.: ${it.side}`,
                                                                        ].filter(Boolean).join(', ') || '-'}
                                                                    </td>
                                                                    <td>{qty}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </Layout>
    );
}
