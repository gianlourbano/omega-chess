// lib/posts.js
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import addClasses from "rehype-class-names";
import rehypeExternalLinks from 'rehype-external-links'

import Content from "./content";

import styles from "./md-classes.json";

// Your markdown folder for posts.
const postsDirectory = path.join(process.cwd(), "releases");

async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
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
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener"] })
        .use(rehypeStringify)
        .use(addClasses, styles)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}

const Error = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-zinc-900">
            <div className="text-center">
                <h1 className="text-4xl font-medium">404</h1>
                <p className="text-2xl font-medium m-6">
                    Oops! Something went wrong
                </p>
                <p className="text-xl font-medium m-6">
                    It seems the release you&apos;re looking for doesn&apos;t
                    exist
                </p>
                <a
                    href="/releases/"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Go Back
                </a>
            </div>
        </div>
    );
};

export default async function Page({ params }) {
    const postData = await getPostData(params.release);
    return postData ? (
        <Content contentHtml={postData.contentHtml} />
    ) : (
        <Error />
    );
}
