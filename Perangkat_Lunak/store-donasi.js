let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    try {
        if (!text) return replyt(`*Contoh: ${usedPrefix + command} 15000*`, m.chat, m);
        await conn.sendMessage(m.chat, {
            react: {
                text: "🕛",
                key: m.key
            }
        });

        let amount = parseInt(text);
        if (isNaN(amount) || amount < 1000)
            return replyt(`*Nominal tidak valid.* Minimal 1000.`, m.chat, m);

        let project = pakasir.project
        let api_key = pakasir.apikey

        let now = new Date();
        let tanggal = now.toISOString().split("T")[0];
        let uniq = Date.now();
        let order_id = `${tanggal}-${uniq}`;

        let createResRaw = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                project,
                api_key,
                order_id,
                amount
            })
        });

        let createRes = await createResRaw.json();
        let payment = createRes.payment || createRes;

        if (!payment || (!payment.payment_number && !createRes.code))
            return replyt("*🍂 Gagal membuat transaksi QRIS.*", m.chat, m);

        let payment_number = payment.payment_number || createRes.payment_number || "";
        let payCode = createRes.code || payment.code || "";
        let qrisString = payment.payment_number || createRes.qris_string || "";

        let qrBuffer;
        if (payCode) {
            let qrUrl = `https://app.pakasir.com/qris/${payCode}.png`;
            qrBuffer = await fetch(qrUrl).then(r => r.arrayBuffer());
        } else if (qrisString) {
            let qcUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrisString)}&size=500&format=png`;
            qrBuffer = await fetch(qcUrl).then(r => r.arrayBuffer());
        }

        let invoiceText = `
*INVOICE TRANSAKSI*
─────────────────
📝 *Order ID:* ${order_id}
💰 *Nominal:* Rp ${amount.toLocaleString()}
🏦 *Metode:* QRIS
⏳ *Status:* Menunggu Pembayaran
─────────────────
`.trim();

        let invoiceMsg = await conn.sendMessage(m.chat, {
            image: Buffer.from(qrBuffer),
            caption: invoiceText
        });

        let attempts = 0;
        let last = "";

        while (attempts < 24) {
            await new Promise(r => setTimeout(r, 3000));

            let detailUrl = `https://app.pakasir.com/api/transactiondetail?project=${encodeURIComponent(project)}&amount=${encodeURIComponent(amount)}&order_id=${encodeURIComponent(order_id)}&api_key=${encodeURIComponent(api_key)}`;
            let detRaw = await fetch(detailUrl);
            let det = await detRaw.json();
            let tx = det.transaction || det || {};
            let status = (tx.status || "").toString().toUpperCase();

            if (status && status !== last) {
                last = status;

                if (status.includes("SUCCESS") || status.includes("COMPLETED") || status.includes("BERHASIL")) {
                    await conn.sendMessage(m.chat, {
                        delete: invoiceMsg.key
                    });

                    await replyt(`✅ *PEMBAYARAN BERHASIL*\nOrder ID: *${order_id}*\nNominal: *Rp ${amount.toLocaleString()}*`, m.chat, m);
                    return;
                }

                if (status.includes("FAILED") || status.includes("EXPIRED") || status.includes("GAGAL")) {
                    await replyt(`❌ *PEMBAYARAN GAGAL / EXPIRED*\nOrder ID: *${order_id}*`, m.chat, m);
                    return;
                }
            }

            attempts++;
        }

        await replyt(`⚠️ *Status belum berubah setelah 1 menit.*\nOrder ID: *${order_id}*`, m.chat, m);
        await conn.sendMessage(m.chat, {
            delete: invoiceMsg.key
        });

    } catch (e) {
        console.log(e);
        await replyt("*🍂 Terjadi kesalahan saat memproses pembayaran.*", m.chat, m);
    } finally {
        await conn.sendMessage(m.chat, {
            react: {
                text: "",
                key: m.key
            }
        });
    }
};

handler.help = ["donasi"];
handler.tags = ["store", "info"]
handler.command = /^(donasi|pembayaran-qris)$/i;

export default handler;