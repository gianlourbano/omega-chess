"use client";

import Example from "@/components/Developer/Example";

export default function Page() {
    return (
        <main className="p-5">
            <h1 className="text-4xl mb-5">Darkboard API</h1>
            <div className="grid grid-cols-2 gap-4">
                <section className="p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1">
                    <Example example="example1" language="javascript" />
                </section>
            </div>
        </main>
    );
}
