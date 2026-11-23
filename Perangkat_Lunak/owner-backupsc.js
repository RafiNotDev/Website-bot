import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const exec_ = promisify(exec);

const handler = async (m, { conn, isROwner }) => {
   try {
      let zipFileName = `backup-rafibotz.zip`;

      setTimeout(() => {
         if (fs.existsSync("node_modules")) {
            replyt("Folder 'node_modules & tmp' tidak ikut di backup.", m.chat, m);
         }
         
         const file = fs.readFileSync('./backup-rafibotz.zip');
         conn.sendMessage(`${setting.owner}@s.whatsapp.net`,
            {
               document: file,
               mimetype: "application/zip",
               fileName: zipFileName,
               caption: "Backup selesai. Silakan unduh file backup.",
            },
            { quoted: m }
         );

         setTimeout(() => {
            fs.unlinkSync(zipFileName);
            replyt("File backup telah dihapus.", m.chat, m);
         }, 5000);
      }, 3000);

      setTimeout(() => {
         let zipCommand = `zip -r ${zipFileName} * -x "node_modules/*" "tmp/*"`;
         exec_(zipCommand, (err, stdout) => {
            // Anda mungkin ingin menangani stdout dan err jika perlu
         });
      }, 1000);
   } catch (error) {
      replyt("Terjadi kesalahan saat melakukan backup.", m.chat, m);
      console.error(error);
   }
};

handler.help = ["backupsc"];
handler.tags = ["developer"];
handler.command = ["backupsc"];
handler.developer = true;

export default handler;