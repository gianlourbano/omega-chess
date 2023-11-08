const path = require("path");
const fs = require("fs");
import matter from "gray-matter";

const releasesDir = path.join(process.cwd(), "releases");

const getReleases = () => {
    let releases: any[] = [];

    const files = fs.readdirSync(releasesDir);

    const regex = /^(alpha|hotfix|release)-[0-9]+\.[0-9]+\.[0-9]+\.md$/g;

    //get all files that matches the regex in the folder
    const filteredFiles = files.filter((file: any) => file.match(regex));

    //get the file data
    filteredFiles.forEach((file: any) => {
        const fileData = fs.readFileSync(path.join(releasesDir, file), "utf8");
        const { data } = matter(fileData);
        if(data) releases.push(data);
    });

    const num = /[0-9]+/g

    releases.sort((a, b) => {
        const aNum = a.version.match(num);
        const bNum = b.version.match(num);

        if (aNum[0] > bNum[0]) {
            return -1;
        } else if (aNum[0] < bNum[0]) {
            return 1;
        } else {
            if (aNum[1] > bNum[1]) {
                return -1;
            } else if (aNum[1] < bNum[1]) {
                return 1;
            } else {
                if (aNum[2] > bNum[2]) {
                    return -1;
                } else if (aNum[2] < bNum[2]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    })

    return releases;
};

export async function GET() {
    return Response.json(getReleases());
}
