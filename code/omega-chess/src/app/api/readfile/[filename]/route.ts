import matter from "gray-matter";

const fs = require("fs");
const path = require("path");

export async function GET(req: Request, { params }: { params: { filename: string } }) {

    const filepath = path.join(process.cwd(), "public", params.filename);

    if(!fs.existsSync(filepath)) {
        return Response.json({error: "File not found"}, {status: 404});
    }

    //read file with grey-matter
    const file = matter.read(filepath);

    return Response.json({content: file.content, fileMetadata: file.data}, {status: 200});
}