const fs = require('fs');
const path = require('path');

module.exports = async function (currentDir, age=null, limit=null) {
    const now = new Date().getTime();
    let totalRemoved = 0;
    let removed = [];

    try {
        const files = await fs.promises.readdir(currentDir);
        for (const file of files) {
            const currentFile = path.join(currentDir, file);
            try {
                const stat = await fs.promises.stat(currentFile);
                
                if (!stat.isFile()) {
                    continue;
                }

                if (limit && totalRemoved >= limit) {
                    continue;
                }

                if (age && now <= (stat.mtime.getTime() + age * 1000)) {
                    continue;
                }

                fs.promises.unlink(currentFile);
                removed.push(currentFile);
                totalRemoved++;
            }
            catch(error) {
                console.error(error);
            }
        }
    }
    catch(error) {
        console.error(error);
    }
    
    return removed
}