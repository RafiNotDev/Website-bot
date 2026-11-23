import unzipper from "unzipper"
import {
    downloadContentFromMessage
} from "@adiwajshing/baileys"
import fetch from "node-fetch"
let rafiganteng = async (m, {
    conn,
    text,
    args,
    command,
    usedPrefix
}) => {

let TokenVercel = setting.tokenVercel

    switch (command) {
        case "deploy": {
        if (!TokenVercel) return replyt("maaf Kayaknya Token Vercelnya Belum Di Buat Deh", m.chat, m)
            if (!text) return replyt(`gunakan format ${command} <NamaWeb>`, m.chat, m)
            let q = m.quoted
            if (!q || !/zip|html/.test(q.mimetype)) return replyt("Reply file .zip atau .html!", m.chat, m)
            const webName = text.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "")
            const domainCheckUrl = `https://${webName}.vercel.app`
            try {
                const check = await fetch(domainCheckUrl)
                if (check.status === 200) return replyt(`Website *${webName}* sudah dipakai, coba nama lain`, m.chat, m)
            } catch {}

            const mediaType = q.mtype.replace("Message", "")
            let buffer = Buffer.from([])
            try {
                const stream = await downloadContentFromMessage(q, mediaType)
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
            } catch (err) {
                return replyt("Gagal mendownload file, mungkin sudah kadaluarsa atau rusak", m.chat, m)
            }
            const filesToUpload = []
            if (q.mimetype.includes("zip")) {
                
                const directory = await unzipper.Open.buffer(buffer)
                for (const file of directory.files) {
                    if (file.type === "File") {
                        const content = await file.buffer()
                        filesToUpload.push({
                            file: file.path.replace(/^\/+/g, ""),
                            data: content.toString("base64"),
                            encoding: "base64"
                        });
                    }
                }
                if (!filesToUpload.some(x => x.file.toLowerCase().endsWith("index.html"))) {
                    return replyt("index.html tidak ditemukan di dalam ZIP", m.chat, m)
                }
            } else if (q.mimetype.includes("html")) {
                filesToUpload.push({
                    file: "index.html",
                    data: buffer.toString("base64"),
                    encoding: "base64"
                })
            } else {
                return replyt("File tidak dikenali. Kirim ZIP atau file lain", m.chat, m);
            }
            const headers = {
                Authorization: `Bearer ${TokenVercel}`,
                "Content-Type": "application/json"
            }
            await fetch("https://api.vercel.com/v9/projects", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: webName
                })
            }).catch(() => {})
            const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: webName,
                    project: webName,
                    files: filesToUpload,
                    projectSettings: {
                        framework: null
                    }
                })
            })
            const deployData = await deployRes.json().catch(() => null);
            if (!deployData || !deployData.url) {
                console.log("Deploy Error:", deployData);
                return replyt(`Deploy gagal:\n${JSON.stringify(deployData)}`, m.chat, m);
            }
            const wurl = `https://${webName}.vercel.app`;
            await conn.sendMessage(m.chat, {
                text: `WEBSITE URL: *${wurl}*`,
                title: "",
                subtitle: "",
                footer: "©" + setting.namabot,
                interactiveButtons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "kunjungi web",
                            url: `${wurl}`
                        })
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "salin URL",
                            copy_code: `${wurl}`
                        })
                    }
                ]
            }, {
                quoted: m
            })
        }
        break
        case "listweb": {
        if (!TokenVercel) return replyt("maaf Kayaknya Token Vercelnya Belum Di Buat Deh", m.chat, m)
            const headers = {
                Authorization: `Bearer ${TokenVercel}`,
            }
            try {
                const res = await fetch(`https://api.vercel.com/v9/projects`, {
                    method: "GET",
                    headers,
                })
                if (!res.ok) {
                    const errText = await res.text()
                    return replyt(`Gagal mengambil daftar:\n${errText}`, m.chat, m)
                }
                const data = await res.json()
                if (!data.projects || data.projects.length === 0) {
                    return replyt("Tidak ada proyek/web yang ditemukan.", m.chat, m);
                }
                let textList = `📄 *Daftar Web yang telah di buat di akun vercel:*\n\n`
                data.projects.forEach((proj, i) => {
                    textList += `${i + 1}. *${proj.name}*\n• ID: ${proj.id}\n• URL: https://${proj.name}.vercel.app\n\n`;
                })
                replyt(textList.trim(), m.chat, m)
            } catch (err) {
                console.error("error :", err)
                replyt("Terjadi kesalahan saat mengambil daftar web", m.chat, m)
            }
        }
        break

        case 'delweb': {
        if (!TokenVercel) return replyt("maaf Kayaknya Token Vercelnya Belum Di Buat Deh", m.chat, m)
            if (!text) return replyt(`gunakan format ${command} <NamaWeb>`, m.chat, m)
            const webName = text.trim().toLowerCase();
            const headers = {
                Authorization: `Bearer ${TokenVercel}`
            }
            try {
                const response = await fetch(`https://api.vercel.com/v9/projects/${webName}`, {
                    method: "DELETE",
                    headers,
                }, )
                if (response.status === 200 || response.status === 204) {
                    return m.reply(`Website *${webName}* berhasil dihapus dari Vercel`, )
                } else if (response.status === 404) {
                    return m.reply(`Website *${webName}* tidak ditemukan di akun Vercel kamu`, )
                } else if (response.status === 403 || response.status === 401) {
                    return m.reply(`Token Vercel tidak valid atau tidak punya akses ke project ini`, )
                } else {
                    let result = {}
                    try {
                        result = await response.json()
                    } catch (e) {}
                    return m.reply(`Gagal menghapus website:\n${result.error?.message || "Tidak diketahui"}`, )
                }
            } catch (err) {
                console.error(err)
                m.reply(`Terjadi kesalahan saat mencoba menghapus:\n${err.message}`, )
            }
        }
        break
    }
}
rafiganteng.command = rafiganteng.help = ['deploy', 'listweb', 'delweb']
rafiganteng.tags = ['rowner']
rafiganteng.rowner = true
export default rafiganteng