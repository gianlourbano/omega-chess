"use client";

export default function Content({ contentHtml }: { readonly contentHtml: string }) {
    return (
        <main className="p-4 grid grid-cols-1 sm:grid-cols-3 h-screen gap-4">
            <div
                className="bg-zinc-900 rounded-lg h-full p-10 sm:col-span-2"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </main>
    );
}
