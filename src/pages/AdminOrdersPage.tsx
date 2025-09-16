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
    is_canceled?: boolean;

};

type AdminOrder = {
    id: number;
    user: number;
    full_name: string;
    club: number;
    club_name: string;
    status: 'Nová' | 'Spacováva sa' | 'Objednaná' | 'Doručená'| 'Zrušená';
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
    const [editing, setEditing] = useState<
        Record<number, { total: string; status: AdminOrder['status']; is_paid: boolean }>
    >({});
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
                init[o.id] = { 
                    total: String(o.total_amount ?? '0.00'), 
                    status: o.status, 
                    is_paid: o.is_paid   // ✅ pridané
                };
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

    const handleEditChange = (
    orderId: number, 
    field: 'total' | 'status' | 'is_paid', 
    value: string | boolean
    ) => {
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
        is_paid: edit.is_paid,  // ✅ pridané
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
                        <option value="Nová">Nové</option>
                        <option value="Spracováva sa"> Prijatá adminom</option>
                        <option value="Objednaná">Objednané</option>
                        <option value="Doručená">Doručená</option>
                        <option value="Zrušená">Zrušené</option>
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
                        <option value="Nová">Nové</option>
                        <option value="Spracováva sa">Spracováva sa</option>
                        <option value="Objednaná">Objednaná</option>
                        <option value="Doručená">Doručená</option>
                        <option value="Zrušená">Zrušené</option>

                    </select>
                </td>
                <td>
                <input
                type="checkbox"
                checked={isEditing?.is_paid ?? o.is_paid}
                onChange={(e) =>
                    handleEditChange(o.id, 'is_paid', e.target.checked) // 👈 tu ide priamo boolean
                }
                />
                {(isEditing?.is_paid ?? o.is_paid) ? "Áno" : "Nie"}
                </td>
                <td>{o.full_name}</td>
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
                    <td colSpan={7} style={{ background: '#fafafa', textAlign: "left" }}>
                        <div style={{ padding: 12 }}>
                            {o.note && (
                                <div style={{ marginBottom: 8 }}>
                                    <b>Poznámka:</b> {o.note}
                                </div>
                            )}
                            <table className="subtable" style={{ width: "100%", textAlign: "left" }}>
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

                                        const handleCancelItem = async (itemId: number) => {
                                        if (!window.confirm("Naozaj chceš zrušiť túto položku?")) return;

                                        try {
                                            const res = await fetchWithAuth(`/order-items/${itemId}/cancel/`, {
                                            method: "POST",
                                            });
                                            if (res.ok) {
                                            const data = await res.json();
                                            alert(data.detail || "✅ Položka bola zrušená");
                                            await fetchOrders();
                                            } else {
                                            const text = await res.text();
                                            alert("❌ Nepodarilo sa zrušiť položku:\n" + text);
                                            }
                                        } catch (err) {
                                            console.error("Chyba pri rušení položky", err);
                                            alert("Chyba pri spojení so serverom.");
                                        }
                                        };

                                        return (
                                            <tr key={it.id} style={it.is_canceled ? { backgroundColor: "#ffe0e0", textDecoration: "line-through", opacity: 0.6 } : {}}>
                                            <td>{it.product_name || "-"}</td>
                                            <td>{it.product_code || "-"}</td>
                                            <td>{it.product_type}</td>
                                            <td>
                                                {[
                                                it.size && `veľ.: ${it.size}`,
                                                it.height && `výš.: ${it.height}`,
                                                it.side && `str.: ${it.side}`,
                                                ]
                                                .filter(Boolean)
                                                .join(", ") || "-"}
                                            </td>
                                            <td>{qty}</td>
                                            <td>
                                                {!it.is_canceled && (
                                                <button
                                                    style={{
                                                    background: "#D32F2F",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "4px 8px",
                                                    borderRadius: 4,
                                                    cursor: "pointer",
                                                    }}
                                                    onClick={() => handleCancelItem(it.id)}
                                                >
                                                    Zrušiť
                                                </button>
                                                )}
                                                {it.is_canceled && <span style={{ color: "#D32F2F", fontWeight: "bold" }}>Zrušené</span>}
                                            </td>
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
