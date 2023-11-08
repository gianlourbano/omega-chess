"use client" 

export default function Content({ contentHtml }: { contentHtml: string }) {
    return (
        <main className="p-3 grid grid-cols-1 sm:grid-cols-2">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </main>
    );
}