"use client";

import DarkboardGame from "@/components/Darkboard/DarkboardGame";

const Page = ({params}: {params: {lobbyid: string}}) => {
    return <DarkboardGame room={params.lobbyid}/>;
};

export default Page;
