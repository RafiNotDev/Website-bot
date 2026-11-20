import {
    startSubBot,
    stopSubBot,
    getSubBots,
    getSubBotCount
} from '../Perangkat_Keras/Komponen/jadibot.js';


const handler = async (
    m,
    {
        conn,
        text,
        command
    }
) => {

    /* ========================================================
     * JADIBOT
     * ======================================================== */

    if (
        command === 'jadibot'
    ) {

        if (!text) {

            return replyt(`🤖 *JADIBOT*\n\n` +
                `Gunakan:\n` +
                `*.jadibot 628xxxxxxxxxx*`, m.chat, m);
        }


        return startSubBot(
            m,
            conn,
            text.trim()
        );
    }


    /* ========================================================
     * STOP JADIBOT
     * ======================================================== */

    if (
        command === 'stopjadibot'
    ) {

        if (!text) {

            return replyt(`Gunakan:\n` +
                `*.stopjadibot 628xxxxxxxxxx*`, m.chat, m);
        }


        const result =
            await stopSubBot(
                text.trim()
            );


        if (!result) {

            return replyt(`❌ Nomor tersebut tidak sedang menjadi sub-bot.`, m.chat, m);
        }


        return replyt(`✅ Sub-bot *${text.trim()}* berhasil dihentikan.\n\n` +
            `Session juga sudah dihapus.`, m.chat, m);
    }


    /* ========================================================
     * LIST JADIBOT
     * ======================================================== */

    if (
        command === 'listjadibot' ||
        command === 'listjadirbot'
    ) {

        const list =
            getSubBots();


        if (
            !list.length
        ) {

            return replyt(`📭 Belum ada sub-bot yang aktif.`, m.chat, m);
        }


        let teks =
            `🤖 *LIST JADIBOT*\n\n`;


        teks +=
            `Total aktif: *${getSubBotCount()}*\n\n`;


        for (
            const [number]
            of list
        ) {

            teks +=
                `• +${number}\n`;
        }


        return replyt(teks, m.chat, m);
    }
};


handler.help = [
    'jadibot <nomor>',
    'stopjadibot <nomor>',
    'listjadibot'
];


handler.tags = [
    'tools'
];


handler.command = [
    'jadibot',
    'stopjadibot',
    'listjadibot',
    'listjadirbot'
];


handler.premium =
    true;


export default handler;