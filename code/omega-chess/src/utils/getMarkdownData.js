import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import addClasses from "rehype-class-names";
import rehypeExternalLinks from "rehype-external-links";

import styles from "@/utils/md-classes.json";

const mdDirectory = path.join(process.cwd(), "public/md");

export default async function getMarkdownData(p) {
    const fullPath = path.join(mdDirectory, `${p}.md`);
    let fileContents;

    try {
        fileContents = fs.readFileSync(fullPath, "utf8");
    } catch {
        return null;
    }

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener"] })
        .use(rehypeStringify)
        .use(addClasses, styles)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        p,
        contentHtml,
        ...matterResult.data,
    };
}