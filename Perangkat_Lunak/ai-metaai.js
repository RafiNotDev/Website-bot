import fetch from 'node-fetch'
import fs from 'node:fs'
import path from 'node:path'

// Baca kredensial dari Pengaturan.js setiap kali dipakai agar perubahan berlaku tanpa redeploy.
function readMetaConfig() {
    try {
        const source = fs.readFileSync(path.resolve('./Pengaturan.js'), 'utf8')
        const key = source.match(/META_AI_API_KEY\s*=\s*['"]([^'"]*)['"]/)
        const account = source.match(/META_AI_ACCOUNT_ID\s*=\s*['"]([^'"]*)['"]/)
        return { apiKey: key?.[1] || '', accountId: account?.[1] || '' }
    } catch { return { apiKey: '', accountId: '' } }
}
export const metaAiConfig = {
    get apiKey() { return process.env.CLOUDFLARE_AI_API_KEY || readMetaConfig().apiKey },
    get accountId() { return process.env.CLOUDFLARE_ACCOUNT_ID || readMetaConfig().accountId }
};

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
    await conn.sendPresenceUpdate('composing', m.chat)
    await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
        const apiKey = metaAiConfig.apiKey;
        const accountId = metaAiConfig.accountId;
        const CloudflareAi = new CloudflareAI(apiKey, accountId);
        const CfAI = await CloudflareAi.ask({
            modelId: 1,
            messages: [{
                    role: "system",
                    content: `Kamu Adalah ${setting.namabot}, kamu Memiliki Sifat Lembut, Penyabar Dan Memiliki Pengelaman Yang Banyak, Mulai Dari Pengetahuan eknologi, kehidupan, dan Alam Mistis, kamu diciptakan oleh seorang developer bernama ${developer.namadev} dia orangnya ganteng dan baik hati, kamu kalau mau respon jawaban dari orang dengan singkat tapi jelas, kamu menguasai ilmu codingan`
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });
        // gagal dapat pesan
        if (!CfAI.result.response) return replyt('Pertanyaan Nya Gagal Di Jawab😹', m.chat, m);
        // Pesan Edit Respon
        
        await await conn.sendMessage(m.chat, {
            text: CfAI.result.response
        }, {
            quoted: m
        });
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
    }
}
handler.help = ['ai']
handler.tags = ['ai']
handler.command = ['ai']
handler.daftar = true
handler.limit = 2
export default handler

export class CloudflareAI {
    static models = {
        llm: [
            [1, "@cf/meta/llama-3.1-8b-instruct", "LLaMA 3.1 8B"],
            [2, "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", "DeepSeek R1 Distill Qwen 32B"],
            [3, "@cf/qwen/qwen1.5-7b-chat-awq", "Qwen 1.5 7B Chat AWQ"],
            [4, "@cf/mistral/mistral-7b-instruct-v0.1", "Mistral 7B Instruct"]
        ],
        image: [
            [5, "@cf/bytedance/stable-diffusion-xl-lightning", "Stable Diffusion XL Lightning"],
            [6, "@cf/black-forest-labs/flux-1-schnell", "Flux 1 Schnell"]
        ],
        vision: [
            [7, "@cf/llava-hf/llava-1.5-7b-hf", "LLaVA 1.5 7B HF"]
        ]
    };

    constructor(apiKey, accountId) {
        this.apiKey = apiKey;
        this.accountId = accountId;
    }

    async ask({
        modelId,
        messages = null,
        params = {},
        imageBuffer = null
    }) {
        const modelArr = Object.values(CloudflareAI.models).flat().find(m => m[0] === modelId);
        if (!modelArr) throw new Error("Model ID tidak valid! Pilih yang bener, nyaw~");

        const [id, model] = modelArr;
        const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`;

        let payload = {
            ...params
        };
        let headers = {
            "Authorization": `Bearer ${this.apiKey}`,
        };

        if (modelId >= 1 && modelId <= 4) {
            if (!Array.isArray(messages) || messages.length === 0) throw new Error("Messages harus berupa array, dong!");
            payload.messages = messages;
            headers["Content-Type"] = "application/json";
        } else if (imageBuffer) {
            payload.image = [...new Uint8Array(imageBuffer)];
            headers["Content-Type"] = "application/json";
        } else {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Gagal fetch: ${response.statusText}, coba lagi nyaw~`);

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.startsWith("image/")) {
            return await response.arrayBuffer();
        } else {
            return await response.json();
        }
    }
}