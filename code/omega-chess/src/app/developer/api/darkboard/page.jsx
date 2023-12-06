import Example from "@/components/Developer/Example";
import getMarkdownData from "@/utils/getMarkdownData";

export default async function Page() {
    const data = await getMarkdownData("darkboard-api");

    return (
        <main className="p-5 flex flex-col gap-3">
            <section className="p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1">
                <div
                    dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                ></div>
            </section>
            <div className="">
                <section className="p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1">
                    <Example example="example1" language="javascript" />
                </section>
            </div>
        </main>
    );
}
