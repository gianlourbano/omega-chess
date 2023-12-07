"use client";

import Link from "next/link";

const apis = [
    {
        title: "Darkboard API",
        description:
            "The Darkboard API is used to connect to our Darkboard service. Write your own Player!",
        url: "/developer/api/darkboard",
        example: "example1",
    },
    {
        title: "Omega Chess API",
        description:
            "The Omega Chess API is used to retrieve data from our Omega Chess service. Want to train your model?",
        url: "/developer/api/omega-chess",
    },
];

const API = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 p-4">
                {apis.map((api, index) => {
                    return (
                        <div
                            key={index}
                            className="p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1"
                        >
                            <h1 className="text-2xl">{api.title}</h1>
                            <p className="p-2">{api.description}</p>
                            <Link
                                href={api.url}
                                className="text-blue-500 hover:text-blue-700 mt-auto self-start"
                            >
                                Go to API
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default API;
