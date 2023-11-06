interface ReleaseInfo {
    version: string;
    text: string;
}

const releaseTEXT = [
    {
        "version": "alpha-0.1.0",
        "text": `
            Hello this is our first release thanks for checking it out!
        `
    }
]

export async function GET(request: Request,{ params }: {params : { release: string }}) {
    const releaseInfo = releaseTEXT.find((releaseInfo: ReleaseInfo) => releaseInfo.version === params.release);
    if (!releaseInfo) {
        return Response.json({
            error: `Release ${params.release} not found`
        }, {
            status: 404
        })
    }
    return Response.json(releaseInfo);
}